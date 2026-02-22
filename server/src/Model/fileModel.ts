import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";
type Transaction = Prisma.TransactionClient;
const fileModel = {
  async createDocument(
    tx: Transaction,
    text: string,
    sessionId: number,
    valid: boolean,
  ) {
    const document = await tx.document.create({
      data: {
        sessionId: sessionId,
        content: text,
        isValid: valid,
      },
    });
    return document;
  },
  async findDocument(sessionId: number) {
    const document = prisma.document.findUnique({
      where: {
        sessionId: sessionId,
      },
    });
    return document;
  },

  // CHUNKS
  async createEmbedding(
    tx: Transaction,
    text: string,
    embedding: string,
    documentId: number,
  ) {
    await tx.$queryRaw`INSERT INTO "Chunks" (text,embedding,"documentId") VALUES (${text},${embedding}::vector, ${documentId})`;
  },

  async getContext(documentId: number, questionEmbed: string) {
    const context =
      await prisma.$queryRaw`SELECT text FROM "Chunks" WHERE "documentId"=${documentId} ORDER BY embedding <=> ${questionEmbed}::vector LIMIT 3`;
    return context;
  },
};

export default fileModel;
