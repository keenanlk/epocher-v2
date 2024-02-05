import { createContext, useContext, useEffect, useState } from "react";

type TimezoneContextType = {
  timezone: string;
  timezones: string[];
  setSelectedTimezone: (timezone: string) => void;
  search: (search: string) => void;
  searchFilter: string;
};

export const timezoneContext = createContext<TimezoneContextType>({
  timezone: "UTC",
  timezones: [],
  setSelectedTimezone: () => {},
  search: () => {},
  searchFilter: "",
});

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const tzList = Intl.supportedValuesOf("timeZone");
  const [timezone, setTimezone] = useState<string>("UTC");
  const [timezones, setTimezones] = useState<string[]>(tzList);
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    const filteredTimezones = tzList.filter((timezone) =>
      timezone.toLowerCase().includes(searchFilter.toLowerCase()),
    );
    setTimezones(filteredTimezones);
  }, [searchFilter]);

  function setSelectedTimezone(timezone: string) {
    setSearchFilter("");
    setTimezone(timezone);
  }

  function search(search: string) {
    setSearchFilter(search);
  }

  return (
    <timezoneContext.Provider
      value={{ timezone, timezones, setSelectedTimezone, search, searchFilter }}
    >
      {children}
    </timezoneContext.Provider>
  );
}

export function useTimezone() {
  return useContext(timezoneContext);
}
