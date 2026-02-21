/*
  Warnings:

  - The `embedding` column on the `Chunks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `embedding` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chunks" DROP COLUMN "embedding",
ADD COLUMN     "embedding" DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "embedding";
