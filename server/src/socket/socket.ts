import { Server } from 'socket.io';
import prisma from '../lib/prisma';
import { verifyToken } from '../utils/jwt';
import { accessWhere, ApiError, saveNote } from '../services/notes';
export let realtime: Server | undefined;
export const noteRoom = (id: string) => `note:${id}`;
export const userRoom = (id: string) => `user:${id}`;
export function initializeSocket(io: Server) {
  realtime = io;
  io.use(async (socket, next) => {
    try {
      const claims = verifyToken(socket.handshake.auth.token);
      const user = await prisma.user.findUnique({ where: { id: claims.id }, select: { id: true, email: true } });
      if (!user) throw new Error();
      socket.data.user = user; socket.data.exp = claims.exp;
      next();
    } catch { next(new Error('Please sign in again.')); }
  });
  io.on('connection', socket => {
    const user = socket.data.user;
    socket.join(userRoom(user.id));
    const expiry = setTimeout(() => socket.disconnect(true), Math.max(0, socket.data.exp * 1000 - Date.now()));
    const presence = async (id: string) => {
      try {
        const peers = await io.in(noteRoom(id)).fetchSockets();
        io.to(noteRoom(id)).emit('presence', { noteId: id, users: [...new Map(peers.map(p => [p.data.user.id, p.data.user])).values()] });
      } catch { /* Presence is best effort. */ }
    };
    socket.on('join-note', async (id, ack) => {
      try {
        if (typeof id !== 'string') throw new Error();
        const note = await prisma.note.findFirst({ where: accessWhere(id, user.id) });
        if (!note) throw new Error();
        for (const room of socket.rooms) if (room.startsWith('note:')) { await socket.leave(room); void presence(room.slice(5)); }
        await socket.join(noteRoom(id));
        const current = await prisma.note.findFirst({ where: accessWhere(id, user.id) });
        if (typeof ack === 'function') ack({ note: current });
        void presence(id);
      } catch { if (typeof ack === 'function') ack({ error: 'Cannot open note.' }); }
    });
    socket.on('send-changes', async (data, ack) => {
      if (typeof ack !== 'function') return;
      try {
        if (typeof data?.noteId !== 'string' || !socket.rooms.has(noteRoom(data.noteId))) throw new ApiError(403, 'Join the note first.');
        const result = await saveNote(data.noteId, user.id, data);
        if (!result.conflict) io.to(noteRoom(data.noteId)).emit('receive-changes', result.note);
        ack(result);
      } catch (e) { ack({ error: e instanceof ApiError ? e.message : 'Save failed.' }); }
    });
    let lastTyping = 0;
    socket.on('user-typing', async data => {
      try {
        if (typeof data?.noteId !== 'string' || !socket.rooms.has(noteRoom(data.noteId)) || Date.now() - lastTyping < 800) return;
        lastTyping = Date.now();
        if (await prisma.note.findFirst({ where: accessWhere(data.noteId, user.id), select: { id: true } })) socket.to(noteRoom(data.noteId)).emit('receive-typing', { noteId: data.noteId, user });
      } catch { /* Ignore failed presence lookups. */ }
    });
    socket.on('disconnecting', () => { const ids = [...socket.rooms].filter(r => r.startsWith('note:')).map(r => r.slice(5)); setTimeout(() => ids.forEach(id => void presence(id)), 0); });
    socket.on('disconnect', () => clearTimeout(expiry));
  });
}
