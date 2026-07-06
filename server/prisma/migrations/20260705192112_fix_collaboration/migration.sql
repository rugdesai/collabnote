/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Collaboration` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Collaboration_userId_noteId_key";

-- AlterTable
ALTER TABLE "Collaboration" DROP COLUMN "createdAt";
