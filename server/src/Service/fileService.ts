import { PDFParse } from "pdf-parse";
import OpenAI from "openai";
const openai = new OpenAI();
type embeddedChunkType = {
  chunk: string;
  embedding: number[];
};
const fileService = {
  async upload(file: Express.Multer.File) {
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

    // CHUNKING AND EMBEDDING CREDIBLE STUFF AND
    if (credible) {
      async function createChunk(word: string[], chunkLength: number = 500) {
        let chunks: string[] = [];
        for (let i = 0; i <= word.length; i += chunkLength) {
          const chunk = word.slice(i, i + chunkLength).join(" ");
          chunks.push(chunk);
        }
        return chunks;
      }
      const chunks = await createChunk(words);
      console.log(chunks.length);

      //   EMBEDDING
      async function embedChunks(chunk: string) {
        const embedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });
        return embedding;
      }
      async function getAllEmbedded(chunks: string[]) {
        const embeddings: embeddedChunkType[] = [];
        for (const chunk of chunks) {
          const embedding = await embedChunks(chunk);
          embeddings.push({
            chunk: chunk,
            embedding: embedding.data[0].embedding,
          });
        }
      }
    }
    // IF NOT CREDIBLE
    else {
    }

    console.log(words.length);
    console.log(credible);
  },
};

export default fileService;
