// Run only against an explicitly supplied disposable database after migrate deploy.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const http = require('node:http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { io: client } = require('../../frontend/node_modules/socket.io-client');
if (!process.env.TEST_DATABASE_URL) throw new Error('Set TEST_DATABASE_URL to a migrated disposable PostgreSQL database.');
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.JWT_SECRET = 'integration-test-only';
process.env.FRONTEND_URL = 'http://localhost:5173';
const prisma = require('../dist/lib/prisma').default;
const app = require('../dist/app').default;
const { initializeSocket } = require('../dist/socket/socket');
test('approval, privacy, concurrent saves and socket authorization', { timeout: 15000 }, async () => {
 const server = http.createServer(app), io = new Server(server);
 initializeSocket(io);
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 const base = `http://127.0.0.1:${server.address().port}`;
 const users = [], sockets = [];
 const request = async (method, path, user, body) => {
  const response = await fetch(base + '/api' + path, { method, headers: { 'Content-Type': 'application/json', ...(user ? { Authorization: `Bearer ${user.token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, data: response.status === 204 ? null : await response.json() };
 };
 const connect = async user => {
  const socket = client(base, { auth: { token: user?.token }, reconnection: false }); sockets.push(socket);
  await new Promise((resolve, reject) => { socket.once('connect', resolve); socket.once('connect_error', reject); }); return socket;
 };
 const ack = (s, event, payload) => new Promise((resolve, reject) => s.timeout(2000).emit(event, payload, (e, r) => e ? reject(e) : resolve(r)));
 try {
  for (let i = 0; i < 3; i++) { const u = await prisma.user.create({ data: { email: `collab-test-${Date.now()}-${i}@example.com`, password: 'unused' } }); users.push({ ...u, token: jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: '1h' }) }); }
  const [owner, guest, stranger] = users;
  const created = await request('POST', '/notes', owner, { title: 'Private title', content: '<p>secret</p>' }); assert.equal(created.status, 201);
  const id = created.data.note.id;
  assert.equal((await request('POST', `/collaborators/${id}/link`, guest)).status, 404);
  const link = await request('POST', `/collaborators/${id}/link`, owner); const token = link.data.link.split('/').pop();
  const metadata = await request('GET', `/collaborators/invite/${token}`); assert.equal(metadata.status, 200); assert.equal(metadata.data.content, undefined);
  assert.equal((await request('GET', `/notes/${id}`, guest)).status, 404);
  assert.equal((await request('GET', `/collaborators/${id}`, guest)).status, 404);
  assert.equal((await request('POST', `/collaborators/join/${token}`)).status, 401);
  const results = await Promise.all(Array.from({ length: 4 }, () => request('POST', `/collaborators/join/${token}`, guest)));
  results.forEach(r => { assert.equal(r.status, 202); assert.equal(r.data.status, 'PENDING'); });
  assert.equal(await prisma.accessRequest.count({ where: { noteId: id } }), 1);
  assert.equal((await request('GET', `/collaborators/invite/${token}`, guest)).data.status, 'PENDING');
  assert.equal((await request('PUT', `/notes/${id}`, guest, { title: 'hack', content: '', version: 0 })).status, 404);
  await assert.rejects(connect());
  const gs = await connect(guest), os = await connect(owner);
  assert.ok((await ack(gs, 'join-note', id)).error);
  assert.ok((await ack(gs, 'send-changes', { noteId: id, title: 'hack', content: '', version: 0 })).error);
  const requests = (await request('GET', `/collaborators/${id}/requests`, owner)).data; const rid = requests[0].id;
  assert.equal((await request('PATCH', `/collaborators/${id}/requests/${rid}`, stranger, { status: 'APPROVED' })).status, 404);
  const decisionEvent = new Promise(resolve => gs.once('access-decision', resolve));
  const approvals = await Promise.all([1, 2, 3].map(() => request('PATCH', `/collaborators/${id}/requests/${rid}`, owner, { status: 'APPROVED' })));
  approvals.forEach(r => assert.equal(r.status, 200));
  assert.equal((await decisionEvent).status, 'APPROVED');
  assert.equal((await request('PATCH', `/collaborators/${id}/requests/${rid}`, owner, { status: 'APPROVED' })).status, 200);
  assert.equal(await prisma.collaboration.count({ where: { noteId: id } }), 1);
  assert.equal((await request('POST', `/collaborators/join/${token}`, owner)).data.status, 'APPROVED');
  assert.equal((await ack(gs, 'join-note', id)).note.id, id); await ack(os, 'join-note', id);
  const received = new Promise(resolve => gs.once('receive-changes', resolve));
  const writes = await Promise.all([request('PUT', `/notes/${id}`, owner, { title: 'A', content: '<p>A</p>', version: 0 }), request('PUT', `/notes/${id}`, guest, { title: 'B', content: '<p>B</p>', version: 0 })]);
  assert.deepEqual(writes.map(r => r.status).sort(), [200, 409]); assert.equal((await received).version, 1);
  const socketSave = await ack(gs, 'send-changes', { noteId: id, title: 'Socket title', content: '<p>Persisted</p>', version: 1 }); assert.equal(socketSave.note.version, 2);
  assert.equal((await request('GET', `/notes/${id}`, owner)).data.title, 'Socket title');
  const typing = new Promise(resolve => os.once('receive-typing', resolve)); gs.emit('user-typing', { noteId: id, email: 'spoof@example.com' }); assert.equal((await typing).user.email, guest.email);
  assert.equal((await request('DELETE', `/notes/${id}`, guest)).status, 404);
  await request('POST', `/collaborators/join/${token}`, stranger);
  const rejected = await prisma.accessRequest.findUnique({ where: { userId_noteId: { userId: stranger.id, noteId: id } } });
  assert.equal((await request('PATCH', `/collaborators/${id}/requests/${rejected.id}`, owner, { status: 'REJECTED' })).status, 200);
  assert.equal((await request('POST', `/collaborators/join/${token}`, stranger)).data.status, 'REJECTED');
  assert.equal((await request('GET', `/notes/${id}`, stranger)).status, 404);
  assert.equal((await request('DELETE', `/collaborators/${id}/link`, owner)).status, 204);
  assert.equal((await request('GET', `/collaborators/invite/${token}`, guest)).status, 404);
  assert.equal((await request('POST', `/collaborators/join/${token}`, stranger)).status, 404);
  assert.equal((await request('GET', `/notes/${id}`, guest)).status, 200);
  assert.equal((await request('DELETE', `/notes/${id}`, owner)).status, 204);
 } finally {
  sockets.forEach(s => s.disconnect());
  const ids = users.map(u => u.id);
  await prisma.invite.deleteMany({ where: { note: { ownerId: { in: ids } } } });
  await prisma.collaboration.deleteMany({ where: { userId: { in: ids } } });
  await prisma.note.deleteMany({ where: { ownerId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
  await new Promise(resolve => io.close(resolve));
 }
});
