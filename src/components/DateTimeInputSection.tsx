import { TextInput } from "flowbite-react";
import React, { useEffect, useRef } from "react";
import { format, parse } from "date-fns";

type DateTimeInputSectionProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export default function DateTimeInputSection({
  date,
  setDate,
}: DateTimeInputSectionProps) {
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateRef.current) {
      dateRef.current.value = format(date, "yyyy-MM-dd");
    }
  }, [date]);

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

  function onDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    event.stopPropagation();
    const dateString = event.target.value;

    const newDate = parse(dateString, "yyyy-MM-dd", new Date());
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    newDate.setSeconds(date.getSeconds());

    if (newDate.getFullYear() < 1000) {
      return;
    }

    if (isValidDate(newDate)) {
      setDate(newDate);
    }
  }

  function formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`;
  }

  const timeInputValue = `${formatTimeUnit(date.getHours())}:${formatTimeUnit(date.getMinutes())}:${formatTimeUnit(date.getSeconds())}`;

  return (
    <div className="flex flex-1 justify-between w-full space-x-4 items-center">
      <TextInput
        data-testid="date-input"
        sizing="md"
        type="date"
        onChange={onDateChange}
        defaultValue={format(date, "yyyy-MM-dd")}
        className="flex-grow"
        onClick={(e) => e.preventDefault()}
        onFocus={(e) => e.preventDefault()}
        ref={dateRef}
      />
      <TextInput
        data-testid="time-input"
        sizing="md"
        type="time"
        step="1"
        onChange={onTimeChange}
        value={timeInputValue}
        className="flex-grow"
      />
    </div>
  );
}
