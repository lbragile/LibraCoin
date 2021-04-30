import { digestMessage, randomHash } from "./conversion";

async function createTarget(numZeros: number): Promise<string> {
  const targetHash = await digestMessage(randomHash(20));

  // replace leading bits with zeros
  const re = new RegExp(`^.{0,${numZeros}}`, "g");
  const zerosStr = Array(numZeros).fill("0").join("");

  return targetHash.replace(re, zerosStr);
}

export async function mine(
  nonce: number,
  setHeader: (arg: number) => void,
  setTarget: (arg: string) => void,
  setSolution: (arg: string) => void,
  setIsValid: (arg: boolean) => void
): Promise<void> {
  // make target
  const numZeros = Math.round(Math.random()) + 2;
  const targetHash = await createTarget(numZeros);
  setTarget(targetHash);

  // mine
  let candidateSolution = "";
  let header = nonce; // re-assigning for clarity
  while (header <= Number.MAX_SAFE_INTEGER) {
    candidateSolution = await digestMessage(header.toString());
    setSolution(candidateSolution);
    setHeader(header++);

    const leadingBits = candidateSolution.substr(0, numZeros).split("");
    if (leadingBits.every((bit) => bit === "0")) {
      break;
    }
  }

  setIsValid(candidateSolution <= targetHash);
}
