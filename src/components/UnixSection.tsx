import { Button, TextInput } from "flowbite-react";
import { MdRefresh } from "react-icons/md";
import React, { useEffect, useRef } from "react";

type UnixSectionProps = {
  date: Date;
  setDate: (date: Date) => void;
  focusDate: boolean;
  setFocusDate: (focus: boolean) => void;
};

export default function UnixSection({
  date,
  setDate,
  focusDate,
  setFocusDate,
}: UnixSectionProps) {
  const unixRef = useRef<HTMLInputElement>(null);
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

  function refreshDate() {
    setDate(new Date());
    setFocusDate(true);
  }

  useEffect(() => {
    if (focusDate && unixRef.current) {
      unixRef.current.focus();
      unixRef.current.select();
      setFocusDate(false);
    }
  }, [focusDate]);

  return (
    <div className="flex justify-between space-x-2">
      <TextInput
        data-testid="unix-input"
        type="number"
        value={getUnixTimeFromDate()}
        onChange={onUnixTimeChange}
        className="unix-input flex-grow"
        autoFocus
        ref={unixRef}
      />
      <Button className="flex-shrink-0" onClick={refreshDate}>
        <MdRefresh />
      </Button>
    </div>
  );
}
