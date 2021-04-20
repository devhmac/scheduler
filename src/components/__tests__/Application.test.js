import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";
import axios from '__mocks__/axios'

afterEach(cleanup);

describe("Form", () => {

  it("Defaults to monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'))

    fireEvent.click(getByText('Tuesday'))

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it('Loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, 'day').find(day => getByText(day, "Monday"));

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument()
  });
});

