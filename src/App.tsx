import { useEffect, useState } from "react";
import { Datepicker } from "flowbite-react";
import { invoke } from "@tauri-apps/api/tauri";
import UnixSection from "./components/UnixSection.tsx";
import TimeStringSection from "./components/TimeStringSection.tsx";
import DateTimeInputSection from "./components/DateTimeInputSection.tsx";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [datepickerKey, setDatepickerKey] = useState<number>(0);

  const [focusDate, setFocusDate] = useState(false);

  useEffect(() => {
    setDatepickerKey((prev) => prev + 1);
  }, [date]);

  useEffect(() => {
    setFocusDate(true);
  }, []);

  function calendarDayChange(calendarDate: Date) {
    calendarDate.setHours(date.getHours());
    calendarDate.setMinutes(date.getMinutes());
    calendarDate.setSeconds(date.getSeconds());
    setDate(calendarDate);
  }

  return (
    <div className="w-screen h-screen bg-black bg-opacity-50">
      <button
        className="absolute top-0 right-0 p-2 text-gray-300  rounded-full hover:text-white"
        onClick={() => invoke("quit_app")}
        data-tooltip="Quit"
      >
        x
      </button>
      <div className="grid gap-4 grid-cols-1 p-8">
        <UnixSection
          date={date}
          setDate={setDate}
          focusDate={focusDate}
          setFocusDate={setFocusDate}
        />
        <TimeStringSection date={date} />

        <div data-testid="date-picker">
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
        <DateTimeInputSection date={date} setDate={setDate} />
      </div>
    </div>
  );
}

export default App;
