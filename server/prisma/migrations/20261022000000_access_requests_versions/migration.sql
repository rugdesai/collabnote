ALTER TABLE "Note" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Invite" ADD COLUMN "revokedAt" TIMESTAMP(3);
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TABLE "AccessRequest" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "noteId" TEXT NOT NULL REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 "decidedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX "AccessRequest_userId_noteId_key" ON "AccessRequest"("userId", "noteId");
CREATE INDEX "AccessRequest_noteId_status_idx" ON "AccessRequest"("noteId", "status");
