import { digestMessage, randomHash } from "./conversion";

export async function createTarget(numZeros: number): Promise<string> {
  const targetHash = await digestMessage(randomHash(20));

  // replace leading bits with zeros
  const re = new RegExp(`^.{0,${numZeros}}`, "g");
  const zerosStr = Array(numZeros).fill("0").join("");

  return targetHash.replace(re, zerosStr);
}

export async function mine(
  header: number,
  index: number,
  setHeader: (arg: number) => void,
  setTarget: (arg: string) => void,
  solution: string[],
  setSolution: (arg: string[]) => void
): Promise<{ currHash: string; targetHash: string }> {
  // make target with 2 or 3 leading zeros
  const numZeros = Math.round(Math.random()) + 2;
  const targetHash = await createTarget(numZeros);
  setTarget(targetHash);

  // mine block for a new current hash (solution)
  let candidateSolution = "";
  while (header <= Number.MAX_SAFE_INTEGER) {
    candidateSolution = await digestMessage(header.toString());

    solution[index] = candidateSolution;
    setSolution(JSON.parse(JSON.stringify(solution)));

    // stopping condition if first numZero characters are all 0
    if (candidateSolution.substr(0, numZeros).match(/^0+$/)) break;

    setHeader(header++);
  }

  return { currHash: candidateSolution, targetHash };
}
