import { digestMessage, randomHash } from "./conversion";

export async function createTarget(numZeros: number): Promise<string> {
  const targetHash = await digestMessage(randomHash(20));

  // replace leading bits with zeros
  const re = new RegExp(`^.{0,${numZeros}}`, "g");
  const zerosStr = Array(numZeros).fill("0").join("");

  return targetHash.replace(re, zerosStr);
}
