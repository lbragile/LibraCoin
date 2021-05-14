import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import KeyGeneration from "../../../src/components/User/KeyGeneration";
import { AppContext } from "../../../src/context/AppContext";

const { state, dispatch } = global;

it("renders correctly", () => {
  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <KeyGeneration />
    </AppContext.Provider>
  );

  const publicTitle = screen.getByRole("heading", { name: /Public:/i, level: 4 });
  const privateTitle = screen.getByRole("heading", { name: /Private:/i, level: 4 });
  const publicField = screen.getByRole("textbox", { name: /publicKey/i });
  const privateField = screen.getByRole("textbox", { name: /privateKey/i });

  [publicTitle, privateTitle, publicField, privateField].forEach((elem) => {
    expect(elem).toBeInTheDocument();
  });

  expect(screen).toMatchSnapshot();
});

describe("input field text", () => {
  const privateKey = "308187020100301306072a8648ce3d020106082a8648ce3";
  const privateKeyHidden = new Array(privateKey.length).fill("◦").join("");

  it("has no user in localStorage", () => {
    localStorage.removeItem("user");

    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <KeyGeneration />
      </AppContext.Provider>
    );

    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue("");
    expect(screen.queryByText("👀")).not.toBeInTheDocument();
  });

  it("has user in localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ ...state.users[0], privateKey }));

    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <KeyGeneration />
      </AppContext.Provider>
    );

    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(state.users[0].publicKey);
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);
    expect(screen.getByText("👀")).toBeInTheDocument();
  });

  it("reveals private key on eye click", () => {
    localStorage.setItem("user", JSON.stringify({ ...state.users[0], privateKey }));

    render(
      <AppContext.Provider value={{ state, dispatch }}>
        <KeyGeneration />
      </AppContext.Provider>
    );

    expect(screen.getByRole("textbox", { name: /publicKey/i })).toHaveValue(state.users[0].publicKey);
    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKeyHidden);

    fireEvent.click(screen.getByText("👀"));

    expect(screen.getByRole("textbox", { name: /privateKey/i })).toHaveValue(privateKey);
  });
});
