/*
  Warnings:

  - Changed the type of `embedding` on the `Chunks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Chunks" DROP COLUMN "embedding",
ADD COLUMN     "embedding" vector(1536) NOT NULL;
