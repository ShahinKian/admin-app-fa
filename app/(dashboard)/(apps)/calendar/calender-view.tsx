"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PersianCalendar } from "persian-calendar-suite";
import EventSheet from "./event-sheet";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarEvent, CalendarCategory } from "@/app/api/calendars/data";

interface CalendarViewProps {
  events: CalendarEvent[];
  categories: CalendarCategory[];
}

const categoryColors: Record<string, string> = {
  business: "#6366f1",
  personal: "#22c55e",
  holiday: "#ef4444",
  family: "#06b6d4",
  meeting: "#f59e0b",
  etc: "#06b6d4",
};

const toCalendarEvent = (event: CalendarEvent) => {
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);

  return {
    id: String(event.id),
    date: start.toISOString().slice(0, 10),
    startTime: start.toTimeString().slice(0, 5),
    endTime: end.toTimeString().slice(0, 5),
    title: event.title,
    color: categoryColors[event.extendedProps.calendar] || "#6366f1",
    isAllDay: event.allDay,
    isMultiDay: start.toDateString() !== end.toDateString(),
    endDate: start.toDateString() !== end.toDateString()
      ? end.toISOString().slice(0, 10)
      : undefined,
  };
};

const CalendarView = ({ events, categories }: CalendarViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string[] | null>(null);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    setSelectedCategory(categories?.map((c) => c.value) ?? []);
  }, [categories]);

  const calendarEvents = useMemo(() => {
    return (events ?? [])
      .filter((event) =>
        selectedCategory?.includes(event.extendedProps.calendar)
      )
      .map(toCalendarEvent);
  }, [events, selectedCategory]);

  const handleOpenCreate = (selectedDate?: Date) => {
    setSelectedEvent(null);
    setSelectedEventDate(selectedDate ?? date);
    setSheetOpen(true);
  };

  const handleEventClick = (event: any) => {
    const start = new Date(event.date + "T" + (event.startTime || "00:00"));
    const end = new Date(event.date + "T" + (event.endTime || "01:00"));

    setSelectedEvent({
      event: {
        id: event.id,
        title: event.title,
        start,
        end,
        extendedProps: {
          calendar: event.calendar || event.category || "business",
        },
      },
    });
    setSelectedEventDate(null);
    setSheetOpen(true);
  };

  const handleCloseModal = () => {
    setSheetOpen(false);
    setSelectedEvent(null);
    setSelectedEventDate(null);
  };

  const handleCategorySelection = (category: string) => {
    setSelectedCategory((current) => {
      if (current?.includes(category)) {
        return current.filter((c) => c !== category);
      }
      return [...(current ?? []), category];
    });
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 divide-x divide-border">
        <Card className="col-span-12 lg:col-span-4 2xl:col-span-3 pb-5">
          <CardContent className="p-0">
            <CardHeader className="border-none mb-2 pt-5">
              <Button onClick={() => handleOpenCreate()}>
                <Plus className="w-4 h-4 text-primary-foreground ltr:mr-1 rtl:ml-1" />
                افزودن رویداد
              </Button>
            </CardHeader>

            <div className="px-3">
              <DatePicker
                value={date}
                onChange={(value) => {
                  const nextDate = value?.toDate?.();
                  if (nextDate) {
                    setDate(nextDate);
                    setSelectedEventDate(nextDate);
                  }
                }}
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                calendarPosition="bottom-right"
                className="w-full"
                containerClassName="w-full"
                inputClass="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="py-4 text-default-800 font-semibold text-xs uppercase mt-4 px-4">
              فیلتر
            </div>

            <ul className="space-y-2 px-4">
              <li className="flex gap-3">
                <Checkbox
                  checked={selectedCategory?.length === categories?.length}
                  onClick={() => {
                    if (selectedCategory?.length === categories?.length) {
                      setSelectedCategory([]);
                    } else {
                      setSelectedCategory(categories.map((c) => c.value));
                    }
                  }}
                />
                <Label>همه</Label>
              </li>

              {categories?.map((category) => (
                <li className="flex gap-3" key={category.value}>
                  <Checkbox
                    className={category.className}
                    id={category.label}
                    checked={selectedCategory?.includes(category.value)}
                    onClick={() => handleCategorySelection(category.value)}
                  />
                  <Label htmlFor={category.label}>{category.label}</Label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-8 2xl:col-span-9 pt-5">
          <CardContent className="dash-tail-calendar">
            <div dir="rtl" className="w-full">
              <PersianCalendar
                events={calendarEvents}
                initialView="month"
                editable={false}
                showWeekends={true}
                headerFormat="full"
                onEventClick={handleEventClick}
                onEventCreate={(event) => {
                  handleOpenCreate(
                    event?.date ? new Date(event.date) : undefined
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <EventSheet
        open={sheetOpen}
        onClose={handleCloseModal}
        categories={categories}
        event={selectedEvent}
        selectedDate={selectedEventDate ? { date: selectedEventDate } : null}
      />
    </>
  );
};

export default CalendarView;
