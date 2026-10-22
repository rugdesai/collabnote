import prisma from '../lib/prisma';
export const accessWhere = (id: string, userId: string) => ({ id, OR: [{ ownerId: userId }, { collaborations: { some: { userId } } }] });
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function saveNote(id: string, userId: string, data: unknown) {
  const { title, content, version } = (data ?? {}) as Record<string, unknown>;
  if (typeof title !== 'string' || title.length > 500 || typeof content !== 'string' || Buffer.byteLength(content) > 900000 || !Number.isSafeInteger(version) || (version as number) < 0) throw new ApiError(400, 'Valid title, content and version are required.');
  return prisma.$transaction(async tx => {
    const changed = await tx.note.updateMany({ where: { ...accessWhere(id, userId), version: version as number }, data: { title, content, version: { increment: 1 } } });
    const note = await tx.note.findFirst({ where: accessWhere(id, userId) });
    if (!note) throw new ApiError(404, 'Note not found or no access.');
    return { conflict: changed.count === 0, note };
  });
}
