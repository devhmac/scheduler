import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, findByAltText, queryByAltText, getByDisplayValue, waitForElementToBeRemoved } from "@testing-library/react";

import Application from "components/Application";
import axios from 'axios'

afterEach(cleanup);

describe("Application", () => {

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


  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1 - render Application
    const { container } = render(<Application />);

    // 2 - wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3 - click the delete button on the first booked appointment

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Delete"))

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete")).toBeInTheDocument()

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, 'Confirm'))
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument()
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find(day => getByText(day, "Monday"));

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1 - render app
    const { container } = render(<Application />);
    //2 - wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));
    //3 - click edit button
    fireEvent.click(queryByAltText(appointment, "Edit"))
    //4 - check if archie cohen is on the screen
    expect(getByDisplayValue(appointment, 'Archie Cohen')).toBeInTheDocument();
    //5 - edit name, change to something else
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    //6 - click interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    //7 - click save
    fireEvent.click(getByText(appointment, 'Save'));
    //8 - check saving state
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();
    //9 - wait for new name to appear
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    //10 - check that monday has text 1 spot remaining  
    const day = getAllByTestId(container, 'day').find(day => getByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(getByText(appointment, "We were unable to schedule your appointment"))

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(queryByText(appointment, "We were unable to schedule your appointment")).not.toBeInTheDocument()

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1 - render Application
    const { container } = render(<Application />);

    // 2 - wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3 - click the delete button on the first booked appointment

    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Delete"))

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete")).toBeInTheDocument()

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, 'Confirm'))
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument()

    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(getByText(appointment, "We were unable to delete your appointment"))

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(queryByText(appointment, "We were unable to schedule your appointment")).not.toBeInTheDocument()

    const day = getAllByTestId(container, 'day').find(day => getByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});

