import { createTarget } from "../../../src/utils/mine";

test("createTarget", async () => {
  const { digestMock, getRandomValuesMock } = global;

  Object.defineProperty(window, "crypto", {
    value: { subtle: { digest: digestMock }, getRandomValues: getRandomValuesMock }
  });
  const numZeros = 5;
  const targetHash = await createTarget(numZeros);
  const re = new RegExp(`0{0,${numZeros}}`, "g");
  expect(targetHash.slice(0, numZeros)).toMatch(re);
  expect(targetHash.slice(numZeros)).toMatch(/^\w+$/);
  expect(targetHash).toHaveLength(128);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  delete window.crypto;
});

// test("mine", async () => {
//   Math.random = jest.fn().mockImplementationOnce(() => 0);
//   jest
//     .spyOn(MineUtil, "createTarget")
//     .mockImplementationOnce(() => new Promise((resolve) => resolve("00ZABCDEFGHIJKLMNOPQRSTUVWXY")));

//   const solution = await MineUtil.mine(1000, jest.fn(), jest.fn(), jest.fn(), jest.fn());
//   console.log(solution);
//   expect(solution.slice(0, 2)).toBe("00");
//   expect(solution.slice(2)).toMatch(/^\w+$/);
// });
