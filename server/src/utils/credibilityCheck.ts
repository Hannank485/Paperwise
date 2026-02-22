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
export default credibilityCheck;
