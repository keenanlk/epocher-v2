import React, { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Calendar } from "primereact/calendar";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";

function App() {
  const [date, setDate] = useState<Date>(new Date());

  const ref = React.useRef(null);

  function getUnixTimeFromDate() {
    return Math.floor(date.getTime() / 1000);
  }

  function onUnixTimeChange(event: InputNumberValueChangeEvent) {
    const unixTime = Number(event.value);
    if (isNaN(unixTime)) {
      return;
    }
    setDate(new Date(unixTime * 1000));
  }

  useEffect(() => {
    debugger;
    if (date.getMonth() && ref.current) {
      (ref.current as Calendar).updateViewDate(null, date);
    }
  }, [date, ref]);

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

  return (
    <div className="w-screen h-screen bg-black bg-opacity-40">
      <div className="grid gap-4 grid-cols-1 p-8">
        <div>
          <InputNumber
            value={getUnixTimeFromDate()}
            onValueChange={onUnixTimeChange}
            className=" unix-input"
            useGrouping={false}
          />
        </div>
        <div>
          <p className="text-white">{getDateStringInLocalTimeZone()}</p>
        </div>
        <div>
          <p className="text-white">{getDateStringInUTC()}</p>
        </div>
        <div>
          <p className="text-white">{getDateISOString()}</p>
        </div>
        <div>
          <Calendar
            ref={ref}
            value={date}
            onChange={(e) => e.value && setDate(e.value)}
            inline
            hourFormat="12"
            showTime={true}
          />{" "}
        </div>
      </div>
    </div>
  );
}

export default App;
