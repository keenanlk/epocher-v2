import React, { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Button, Datepicker, TextInput, Tooltip } from "flowbite-react";
import { MdRefresh } from "react-icons/md";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [datepickerKey, setDatepickerKey] = useState<number>(0);
  const [tooltipText, setTooltipText] = useState("Click to copy");

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

  function onTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    debugger;
    const time = event.target.value;
    const [hours, minutes, seconds] = time.split(":");
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    newDate.setSeconds(parseInt(seconds));
    setDate(newDate);
  }

  const [timeZone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  function getDateStringInLocalTimeZone() {
    return formatInTimeZone(date, timeZone, "yyyy-MM-dd hh:mm:ss a zzz");
  }

  function getDateStringInUTC() {
    return formatInTimeZone(date, "UTC", "yyyy-MM-dd hh:mm:ss a zzz");
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

  return (
    <div className="w-screen h-screen bg-black bg-opacity-50">
      <div className="grid gap-4 grid-cols-1 p-8">
        <div className="flex justify-between space-x-2">
          <TextInput
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
          <p className="text-white">{getDateStringInLocalTimeZone()}</p>
        </div>
        <div>
          <p className="text-white">{getDateStringInUTC()}</p>
        </div>
        <div className="">
          <Tooltip content={tooltipText} placement="right">
            <p
              className="text-white cursor-pointer"
              onClick={() => copyTextToClipboard(getDateISOString())}
            >
              {getDateISOString()}
            </p>
          </Tooltip>
        </div>
        <div>
          <Datepicker
            key={datepickerKey}
            id="datepicker"
            className="w-full"
            showClearButton={false}
            showTodayButton={false}
            onSelectedDateChanged={calendarDayChange}
            defaultDate={date}
            inline
          />
        </div>
        <div>
          <TextInput
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
