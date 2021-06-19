import React, { ComponentType, ReactElement, useReducer } from "react";
import { render, RenderResult } from "@testing-library/react";
import { AppContext } from "../../src/context/AppContext";
import { IAction, IState } from "../../src/typings/AppTypes";
import { AppReducer } from "../../src/reducers/AppReducer";

interface IReducerMocks {
  stateMock?: IState;
  dispatchMock?: React.Dispatch<IAction>;
}

interface IComponentWrapperProps {
  children: ReactElement;
}

export function customRender(ui: ReactElement, mocks?: IReducerMocks): RenderResult {
  const ComponentWrapper = ({ children }: IComponentWrapperProps): ReactElement => {
    const [state, dispatch] = useReducer(AppReducer, mocks?.stateMock ?? global.initialState);
    return (
      <AppContext.Provider value={{ state, dispatch: mocks?.dispatchMock ?? dispatch }}>{children}</AppContext.Provider>
    );
  };

  return render(ui, { wrapper: ComponentWrapper as ComponentType });
}
