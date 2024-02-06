import { Tooltip } from "flowbite-react";
import { useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

type TimeStringSectionProps = {
  date: Date;
};

export default function TimeStringSection({ date }: TimeStringSectionProps) {
  const [timeZone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [tooltipText, setTooltipText] = useState("Click to copy");

  function getDateStringInLocalTimeZone() {
    return formatInTimeZone(date, timeZone, "MM/dd/yyyy hh:mm:ss a zzz");
  }

  function getDateStringInUTC() {
    const result = formatInTimeZone(date, "UTC", "MM/dd/yyyy hh:mm:ss a zzz");
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
  return (
    <>
      <div>
        <p data-testid="local-time-string" className="text-white">
          {getDateStringInLocalTimeZone()}
        </p>
      </div>
      <div>
        <p data-testid="utc-time-string" className="text-white">
          {getDateStringInUTC()}
        </p>
      </div>
      <div className="">
        <Tooltip content={tooltipText} placement="right">
          <p
            data-testid="iso-time-string"
            className="text-white cursor-pointer"
            onClick={() => copyTextToClipboard(getDateISOString())}
          >
            {getDateISOString()}
          </p>
        </Tooltip>
      </div>
    </>
  );
}
