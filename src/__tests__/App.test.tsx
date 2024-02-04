import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

describe("App Component", () => {
  const originalDateTimeFormat = Intl.DateTimeFormat;
  beforeAll(() => {
    const dateTimeFormatMock = function(locale?: string | string[], options?: Intl.DateTimeFormatOptions) {
      return new originalDateTimeFormat(locale, {
        ...options,
        timeZone: options?.timeZone === 'UTC' ? 'UTC' : "America/Chicago",
      });
    } as unknown as typeof Intl.DateTimeFormat; // Use 'typeof Intl.DateTimeFormat' for the mock type

    dateTimeFormatMock.supportedLocalesOf = jest.fn((locales: string | string[], options?: Intl.DateTimeFormatOptions) => {
      return originalDateTimeFormat.supportedLocalesOf(locales, options);
    });

    Intl.DateTimeFormat = dateTimeFormatMock;

    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: jest.fn(),
      },
      writable: true,
    });
  });

  afterAll(() => {
    Intl.DateTimeFormat = originalDateTimeFormat;
  });

  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("unix-input")).toBeInTheDocument();
    expect(screen.getByTestId("time-input")).toBeInTheDocument();
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
    expect(screen.getByTestId("local-time-string")).toBeInTheDocument();
    expect(screen.getByTestId("utc-time-string")).toBeInTheDocument();
    expect(screen.getByTestId("iso-time-string")).toBeInTheDocument();
  });

  test("time strings show correct date", () => {
    render(<App />);
    const unixTime = 1707005834;
    fireEvent.change(screen.getByTestId("unix-input"), {
      target: { value: unixTime },
    });

    expect(screen.getByTestId("local-time-string")).toHaveTextContent(
      "2024-02-03 06:17:14 PM CST",
    );
    expect(screen.getByTestId("utc-time-string")).toHaveTextContent(
      "2024-02-04 12:17:14 AM UTC",
    );
    expect(screen.getByTestId("iso-time-string")).toHaveTextContent(
      "2024-02-04T00:17:14.000Z",
    );
    expect(screen.getByTestId("time-input")).toHaveValue("18:17:14");
  });

  test("ISO string is copied to clipboard", async () => {
    render(<App />);
    const unixTime = 1707005834;

    fireEvent.change(screen.getByTestId("unix-input"), {
      target: { value: String(unixTime) },
    });

    const isoStringElement = screen.getByTestId("iso-time-string");
    const copyTextToClipboardSpy = jest.spyOn(navigator.clipboard, "writeText");

    userEvent.click(isoStringElement);

    await waitFor(() =>
      expect(copyTextToClipboardSpy).toHaveBeenCalledWith(
        "2024-02-04T00:17:14.000Z",
      ),
    );
  });

  test("times update when time input is changed", async () => {
    render(<App />);

    const unixTime = 1707005834;

    fireEvent.change(screen.getByTestId("unix-input"), {
      target: { value: String(unixTime) },
    });

    const timeInput = screen.getByTestId("time-input");

    fireEvent.change(timeInput, { target: { value: "12:00:00" } });

    await waitFor(() => {
      expect(screen.getByTestId("local-time-string")).toHaveTextContent(
        "2024-02-03 12:00:00 PM CST",
      );
      expect(screen.getByTestId("utc-time-string")).toHaveTextContent(
        "2024-02-03 06:00:00 PM UTC",
      );
      expect(screen.getByTestId("iso-time-string")).toHaveTextContent(
        "2024-02-03T18:00:00.000Z",
      );
    });
  });
});
