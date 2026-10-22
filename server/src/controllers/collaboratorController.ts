import { Request, Response } from 'express';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { accessWhere, ApiError } from '../services/notes';
import { realtime, userRoom } from '../socket/socket';
const param = (req: Request, key: string) => req.params[key] as string;
async function owner(req: Request) {
  const note = await prisma.note.findFirst({ where: { id: param(req, 'noteId'), ownerId: req.user.id } });
  if (!note) throw new ApiError(404, 'Note not found or no access.');
  return note;
}
async function invitation(req: Request) {
  const invite = await prisma.invite.findUnique({ where: { token: param(req, 'token') }, include: { note: { select: { id: true, title: true, ownerId: true, owner: { select: { email: true } } } } } });
  if (!invite || invite.revokedAt) throw new ApiError(404, 'This invitation is invalid or has been revoked.');
  return invite;
}
export async function inviteMetadata(req: Request, res: Response) {
  const { note } = await invitation(req);
  let status = 'NONE';
  if (req.user) {
    const access = await prisma.note.findFirst({ where: accessWhere(note.id, req.user.id), select: { id: true } });
    const request = await prisma.accessRequest.findUnique({ where: { userId_noteId: { userId: req.user.id, noteId: note.id } } });
    status = access ? 'APPROVED' : request?.status ?? 'NONE';
  }
  res.json({ noteId: note.id, title: note.title, owner: note.owner.email, status });
}
export async function requestAccess(req: Request, res: Response) {
  const { note } = await invitation(req);
  if (await prisma.note.findFirst({ where: accessWhere(note.id, req.user.id), select: { id: true } })) { res.json({ noteId: note.id, status: 'APPROVED' }); return; }
  const where = { userId_noteId: { userId: req.user.id, noteId: note.id } };
  const request = await prisma.accessRequest.upsert({ where, create: { userId: req.user.id, noteId: note.id }, update: {} }).catch(async error => {
    // Prisma may emulate an empty-update upsert; the unique constraint wins races.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return prisma.accessRequest.findUniqueOrThrow({ where });
    throw error;
  });
  realtime?.to(userRoom(note.ownerId)).emit('access-request', { noteId: note.id });
  res.status(request.status === 'PENDING' ? 202 : 200).json({ noteId: note.id, status: request.status });
}
export async function createLink(req: Request, res: Response) {
  const note = await owner(req);
  const invite = await prisma.invite.findFirst({ where: { noteId: note.id, revokedAt: null }, orderBy: { createdAt: 'desc' } }) ?? await prisma.invite.create({ data: { noteId: note.id, token: crypto.randomBytes(32).toString('hex') } });
  res.json({ link: `${(process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')}/join/${invite.token}` });
}
export async function revokeLinks(req: Request, res: Response) {
  const note = await owner(req);
  await prisma.invite.updateMany({ where: { noteId: note.id, revokedAt: null }, data: { revokedAt: new Date() } });
  res.sendStatus(204);
}
export async function requests(req: Request, res: Response) {
  const note = await owner(req);
  res.json(await prisma.accessRequest.findMany({ where: { noteId: note.id }, include: { user: { select: { id: true, email: true } } }, orderBy: { createdAt: 'desc' } }));
}
export async function decide(req: Request, res: Response) {
  const note = await owner(req);
  const status = req.body?.status;
  if (status !== 'APPROVED' && status !== 'REJECTED') throw new ApiError(400, 'Choose APPROVED or REJECTED.');
  const request = await prisma.$transaction(async tx => {
    const existing = await tx.accessRequest.findFirst({ where: { id: param(req, 'requestId'), noteId: note.id } });
    if (!existing) throw new ApiError(404, 'Request not found.');
    const changed = await tx.accessRequest.updateMany({ where: { id: existing.id, status: 'PENDING' }, data: { status, decidedAt: new Date() } });
    const current = await tx.accessRequest.findUniqueOrThrow({ where: { id: existing.id } });
    if (!changed.count && current.status !== status) throw new ApiError(409, 'This request has already been decided.');
    if (status === 'APPROVED') await tx.collaboration.upsert({ where: { userId_noteId: { userId: existing.userId, noteId: note.id } }, create: { userId: existing.userId, noteId: note.id }, update: {} });
    return current;
  });
  realtime?.to(userRoom(request.userId)).emit('access-decision', { noteId: note.id, status });
  res.json(request);
}
export async function collaborators(req: Request, res: Response) {
  const noteId = param(req, 'noteId');
  if (!await prisma.note.findFirst({ where: accessWhere(noteId, req.user.id) })) throw new ApiError(404, 'Note not found or no access.');
  res.json((await prisma.collaboration.findMany({ where: { noteId }, select: { user: { select: { id: true, email: true } } } })).map(c => c.user));
}
