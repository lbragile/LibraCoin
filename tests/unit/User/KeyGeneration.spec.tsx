import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import KeyGeneration from "../../../src/components/User/KeyGeneration";
import { AppContext } from "../../../src/context/AppContext";

const { state, dispatch } = global;

it("renders correctly", () => {
  const { getByLabelText, getByRole } = render(
    <AppContext.Provider value={{ state, dispatch }}>
      <KeyGeneration />
    </AppContext.Provider>
  );

  const publicTitle = getByLabelText("Public:");
  const privateTitle = getByLabelText("Private:");
  const publicField = screen.getByText("Private:", { selector: "heading" });
  const privateField = screen.getByText("Public:", { selector: "heading" });

  [publicTitle, privateTitle, publicField, privateField].forEach((elem) => {
    expect(elem).toBeInTheDocument();
  });

  expect(screen).toMatchSnapshot();
});

// describe("input field text", () => {
//   const privateKey = "308187020100301306072a8648ce3d020106082a8648ce3";

//   it("has no user in localStorage", () => {
//     localStorage.removeItem("user");

//     const { container } = render(
//       <AppContext.Provider value={{ state, dispatch }}>
//         <KeyGeneration />
//       </AppContext.Provider>
//     );

//     const publicField = container.querySelector("#publicKey") as HTMLTextAreaElement;
//     const privateField = container.querySelector("#privateKey") as HTMLTextAreaElement;
//     const eyes = container.querySelector("#private-reveal-eyes");

//     expect(publicField.value).toBe("");
//     expect(privateField.value).toBe("");
//     expect(eyes).toBeFalsy();
//   });

//   it("has user in localStorage", () => {
//     localStorage.setItem("user", JSON.stringify({ ...state.users[0], privateKey }));

//     const { container } = render(
//       <AppContext.Provider value={{ state, dispatch }}>
//         <KeyGeneration />
//       </AppContext.Provider>
//     );

//     const publicField = container.querySelector("#publicKey") as HTMLTextAreaElement;
//     const privateField = container.querySelector("#privateKey") as HTMLTextAreaElement;
//     const eyes = container.querySelector("#private-reveal-eyes");

//     expect(publicField.value).toBe(state.users[0].publicKey);
//     expect(privateField.value).toBe(new Array(privateKey.length).fill("◦").join(""));
//     expect(eyes).toBeTruthy();
//   });

//   it("reveals private key on eye click", () => {
//     localStorage.setItem("user", JSON.stringify({ ...state.users[0], privateKey }));

//     const { container } = render(
//       <AppContext.Provider value={{ state, dispatch }}>
//         <KeyGeneration />
//       </AppContext.Provider>
//     );

//     const privateField = container.querySelector("#privateKey") as HTMLTextAreaElement;
//     const originalValue = privateField.value;
//     const eyes = container.querySelector("#private-reveal-eyes") as HTMLSpanElement;
//     fireEvent.click(eyes);

//     expect(originalValue).toBe(new Array(privateKey.length).fill("◦").join(""));
//     expect(privateField.value).toBe(privateKey);
//   });
// });
