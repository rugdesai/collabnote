import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { accessWhere, ApiError, saveNote } from '../services/notes';
import { realtime, noteRoom } from '../socket/socket';
export async function createNote(req: Request, res: Response) {
  const { title, content } = req.body ?? {};
  if (typeof title !== 'string' || title.length > 500 || typeof content !== 'string' || Buffer.byteLength(content) > 900000) throw new ApiError(400, 'Valid title and content are required.');
  res.status(201).json({ note: await prisma.note.create({ data: { title, content, ownerId: req.user.id } }) });
}
export async function getNotes(req: Request, res: Response) {
  res.json({ notes: await prisma.note.findMany({ where: { OR: [{ ownerId: req.user.id }, { collaborations: { some: { userId: req.user.id } } }] }, orderBy: { updatedAt: 'desc' } }) });
}
export async function getNoteById(req: Request, res: Response) {
  const note = await prisma.note.findFirst({ where: accessWhere(req.params.id as string, req.user.id) });
  if (!note) throw new ApiError(404, 'Note not found or no access.');
  res.json({ ...note, isOwner: note.ownerId === req.user.id });
}
export async function updateNote(req: Request, res: Response) {
  const result = await saveNote(req.params.id as string, req.user.id, req.body);
  if (!result.conflict) realtime?.to(noteRoom(result.note.id)).emit('receive-changes', result.note);
  res.status(result.conflict ? 409 : 200).json(result);
}
export async function deleteNote(req: Request, res: Response) {
  const id = req.params.id as string;
  await prisma.$transaction(async tx => {
    if (!await tx.note.findFirst({ where: { id, ownerId: req.user.id } })) throw new ApiError(404, 'Note not found or no access.');
    await tx.invite.deleteMany({ where: { noteId: id } });
    await tx.collaboration.deleteMany({ where: { noteId: id } });
    await tx.note.delete({ where: { id } });
  });
  realtime?.to(noteRoom(id)).emit('note-deleted', { noteId: id });
  realtime?.in(noteRoom(id)).socketsLeave(noteRoom(id));
  res.sendStatus(204);
}
