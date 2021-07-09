import React from "react";
import { StyledSpinner } from "../../styles/LoadingStyles";

export default function Loading(): JSX.Element {
  return (
    <StyledSpinner animation="border" variant="secondary" role="status">
      <span className="sr-only">Loading...</span>
    </StyledSpinner>
  );
}
