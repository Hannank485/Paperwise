import { PDFParse } from "pdf-parse";
import OpenAI from "openai";
const openai = new OpenAI();
import sessionModel from "../Model/sessionModel";
import fileModel from "../Model/fileModel";
import prisma from "../prismaClient";

type embeddedChunkType = {
  chunk: string;
  embedding: string;
};

const fileService = {
  async upload(file: Express.Multer.File, sessionId: number, userId: number) {
    // verify ownership
    const session = await sessionModel.getSingleSession(sessionId);
    if (session?.userId !== userId) {
      throw new Error("UNAUTHORISED");
    }
    // Parse PDF
    async function parsePDF(data: Express.Multer.File["buffer"]) {
      const pdf = new PDFParse({ data: data });
      const result = await pdf.getText();
      await pdf.destroy();
      const text = result.text.replace(/\s+/g, " ");
      return text;
    }
    const content = await parsePDF(file.buffer);
    const words = content.split(/\s+/);
    // CHECK CREDIBILITY OF THE PDF
    const toneKeywords = [
      "kinda",
      "sort of",
      "super",
      "really",
      "stuff",
      "things",
      "basically",
      "literally",
    ];

    // FUNCTION TO CHECK CREDIBILITY
    function credibilityCheck(
      tone: string[],
      textLength: number,
      content: string,
    ): boolean {
      const compact = content.toLowerCase().replace(/\s+/g, "");

      let credibilityScore = 0;

      // CHECKING PRESENCE OF ABSTRACT
      if (compact.includes("abstract")) {
        credibilityScore += 2;
      }
      //   CHECKING TONE OF RESEARCH PAPERs
      let informalPenalty = 0;
      tone.forEach((word) => {
        if (compact.includes(word)) {
          informalPenalty += 0.5;
        }
      });
      const totalPenalty = Math.min(informalPenalty, 1);
      credibilityScore -= totalPenalty;
      //   CHECKING LENGTH
      if (textLength >= 2000) {
        credibilityScore += 2;
      }
      let isValid = false;
      if (credibilityScore >= 3) {
        isValid = true;
      }
      console.log(credibilityScore);
      return isValid;
    }
    const credible: boolean = credibilityCheck(
      toneKeywords,
      words.length,
      content,
    );
    // CHUNKING
    async function createChunk(word: string[], chunkLength: number = 500) {
      let chunks: string[] = [];
      for (let i = 0; i <= word.length; i += chunkLength) {
        const chunk = word.slice(i, i + chunkLength).join(" ");
        chunks.push(chunk);
      }
      return chunks;
    }
    //   EMBEDDING
    async function embedChunks(chunk: string) {
      // TEST EMBEDDING
      const embedding = new Array(1536).fill(0);

      // OPEN AI EMBEDDING
      // const embedding = await openai.embeddings.create({
      //   model: "text-embedding-3-small",
      //   input: chunk,
      // });
      return embedding;
    }
    async function getAllEmbedded(chunks: string[]) {
      const embeddings: embeddedChunkType[] = [];
      for (const chunk of chunks) {
        const embedding = await embedChunks(chunk);
        // const vectorString = `[${embedding.data[0].embedding.join(",")}]`;
        const vectorString = `[${embedding.join(",")}]`;
        embeddings.push({
          chunk: chunk,
          embedding: vectorString,
        });
      }
      return embeddings;
    }
    const chunks = await createChunk(words);
    console.log(chunks.length);

    const embeddings = await getAllEmbedded(chunks);
    await prisma.$transaction(
      async (tx) => {
        // STORING DOCUMENT
        const document = await fileModel.createDocument(
          tx,
          content,
          session.id,
          credible,
        );
        if (credible) {
          for (const item of embeddings) {
            await fileModel.createEmbedding(
              tx,
              item.chunk,
              item.embedding,
              document.id,
            );
          }
        }
      },
      { timeout: 30000 },
    );
  },
};

export default fileService;
