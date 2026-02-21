/*
  Warnings:

  - You are about to drop the column `chunks` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Document` table. All the data in the column will be lost.
  - Added the required column `isValid` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- GENERATE EXTENSION
CREATE EXTENSION IF NOT EXISTS vector;

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "chunks",
DROP COLUMN "userId",
ADD COLUMN     "isValid" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Chunks" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" VECTOR(1536),
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Chunks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chunks" ADD CONSTRAINT "Chunks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
