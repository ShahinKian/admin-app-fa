"use client";

import * as React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

type DateRangeValue = any[] | null;

export default function DatePickerWithRange({
  className,
}: {
  className?: string;
}) {
  const [date, setDate] = React.useState<DateRangeValue>(null);
  const { theme: mode } = useTheme();

  const formatDate = (value: any) => {
    if (!value) return "";

    if (Array.isArray(value)) {
      return value.map((item) => item?.format?.("YYYY/MM/DD HH:mm") ?? "").join(" - ");
    }

    return value?.format?.("YYYY/MM/DD HH:mm") ?? "";
  };

  const label = formatDate(date);

  return (
    <div className={cn("grid gap-2", className)} dir="rtl">
      <DatePicker
        range
        rangeHover
        value={date ?? undefined}
        onChange={(value) => setDate(value as DateRangeValue)}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/MM/DD HH:mm"
        calendarPosition="bottom-right"
        plugins={[
          <TimePicker key="time-picker" position="bottom" hideSeconds />,
        ]}
        render={(value, openCalendar) => (
          <Button
            type="button"
            onClick={openCalendar}
            color={mode === "dark" ? "secondary" : "default"}
            className={cn("font-normal", {
              "bg-white text-default-600": mode !== "dark",
            })}
          >
            <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {label || "انتخاب بازه زمانی"}
          </Button>
        )}
      />
    </div>
  );
}
