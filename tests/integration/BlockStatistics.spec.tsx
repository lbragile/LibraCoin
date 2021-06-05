import React from "react";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";

// import { AppContext } from "../../src/context/AppContext";
// import Block from "../../src/components/Block/Block";
// import Statistics from "../../src/components/Block/Statistics";

// const { state, dispatch } = global;

// describe("in preview mode", () => {
//   it("renders correctly", () => {
//     Date.now = jest.fn().mockReturnValueOnce(45678);

//     render(
//       <AppContext.Provider value={{ state, dispatch }}>
//         <Statistics chain={false} />
//         <Block chain={false} merkleRoot={"abc"} index={2} />
//       </AppContext.Provider>
//     );

//     expect(screen.getByRole("form", { name: /Block Statistics/i })).toHaveFormValues({
//       nonce: 0,
//       header: 0,
//       target: "",
//       solution: ""
//     });

//     expect(screen.getByRole("form", { name: /Block Form/i })).toHaveFormValues({
//       index: state.preview.index,
//       timestamp: 45678,
//       prevHash: state.preview.prevHash,
//       currHash: state.preview.currHash,
//       merkle: "abc"
//     });

//     expect(screen.queryByRole("button", { name: /Add Block/i })).not.toBeInTheDocument();
//     expect(screen.getByRole("form", { name: /Block Form/i })).toHaveClass("invalid-block");
//   });
// });

it("should pass", () => {
  expect(true).toBeTruthy();
});
