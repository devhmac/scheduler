import React from "react";
import { render } from "@testing-library/react";

import Form from "components/Appointment/Form";

describe("Form", () => {

  //renders component
  it("renders without crashing", () => {
    render(<Form />);
  });
});