import React, { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import {
  Button,
  Card,
  Datepicker,
  Dropdown,
  Select,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { MdRefresh } from "react-icons/md";
import { useTimezone } from "./context/timezone.tsx";
function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [datepickerKey, setDatepickerKey] = useState<number>(0);
  const [tooltipText, setTooltipText] = useState("Click to copy");

  const {
    timezones,
    timezone: selectedTimezone,
    setSelectedTimezone,
    setSearchFilter,
    search,
    searchFilter,
  } = useTimezone();

  useEffect(() => {
    setDatepickerKey((prev) => prev + 1);
  }, [date]);

  function getUnixTimeFromDate() {
    return Math.floor(date.getTime() / 1000);
  }

  function onUnixTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const unixTime = parseInt(value);
    if (isNaN(unixTime)) {
      return;
    }
    setDate(new Date(unixTime * 1000));
  }

  function isValidDate(d: unknown) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  function onTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const time = event.target.value;

    const [hours, minutes, seconds] = time.split(":");
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    newDate.setSeconds(parseInt(seconds));

    if (isValidDate(newDate)) {
      setDate(newDate);
    }
  }

  const [timeZone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  function getDateStringInLocalTimeZone() {
    return formatInTimeZone(date, timeZone, "yyyy-MM-dd hh:mm:ss a zzz");
  }

  function getDateStringInSelectedTimezone() {
    const result = formatInTimeZone(
      date,
      selectedTimezone,
      "yyyy-MM-dd hh:mm:ss a zzz",
    );
    return result;
  }

  function getDateISOString() {
    return date.toISOString();
  }

  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setTooltipText("Copied!"); // Update tooltip text on successful copy
      setTimeout(() => setTooltipText("Click to copy"), 2000); // Reset tooltip text after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  function calendarDayChange(calendarDate: Date) {
    calendarDate.setHours(date.getHours());
    calendarDate.setMinutes(date.getMinutes());
    calendarDate.setSeconds(date.getSeconds());
    setDate(calendarDate);
  }

  function formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`;
  }

  function testOnClick(e) {
    debugger;
  }

  return (
    <div className="w-screen h-screen bg-black bg-opacity-50">
      <div className="grid gap-2 grid-cols-1 px-6 py-6 mx-2">
        <div className="flex justify-between space-x-2">
          <TextInput
            data-testid="unix-input"
            type="number"
            value={getUnixTimeFromDate()}
            onChange={onUnixTimeChange}
            className="unix-input flex-grow"
          />
          <Button className="flex-shrink-0" onClick={() => setDate(new Date())}>
            <MdRefresh />
          </Button>
        </div>
        <div>
          <Card className="p-0 m-0">
            <p data-testid="local-time-string" className="text-white text-sm">
              {getDateStringInLocalTimeZone()}
            </p>
            <Tooltip content={tooltipText} placement="right">
              <p
                data-testid="iso-time-string"
                className="text-white cursor-pointer text-sm"
                onClick={() => copyTextToClipboard(getDateISOString())}
              >
                {getDateISOString()}
              </p>
            </Tooltip>
            <p data-testid="utc-time-string" className="text-white text-sm">
              {getDateStringInSelectedTimezone()}
            </p>
            <Dropdown
              label={selectedTimezone}
              value={selectedTimezone}
              onClick={testOnClick}
            >
              <Dropdown.Item as="div" className="focus:bg-gray-700">
                <TextInput
                  autoFocus
                  type={"text"}
                  placeholder={"Search timezones"}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onChange={(e) => search(e.target.value)}
                  onMouseLeave={(e) => e.stopPropagation()}
                />
              </Dropdown.Item>
              <div className="max-h-[300px] overflow-y-scroll">
                {timezones.map((tz) => (
                  <Dropdown.Item
                    key={tz}
                    value={tz}
                    onClick={() => setSelectedTimezone(tz)}
                    className={
                      tz === selectedTimezone ? "bg-gray-800 font-bold" : ""
                    }
                  >
                    <p className="text-sm">{tz}</p>
                  </Dropdown.Item>
                ))}
              </div>
            </Dropdown>
          </Card>
          <div data-testid="date-picker">
            <Datepicker
              key={datepickerKey}
              id="datepicker"
              showClearButton={false}
              showTodayButton={false}
              onSelectedDateChanged={calendarDayChange}
              defaultDate={date}
              inline
            />
          </div>
        </div>

        <div>
          <TextInput
            data-testid="time-input"
            sizing="md"
            type="time"
            step="1"
            onChange={onTimeChange}
            value={`${formatTimeUnit(date.getHours())}:${formatTimeUnit(date.getMinutes())}:${formatTimeUnit(date.getSeconds())}`}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
