import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import type { EventInput, EventClickArg } from "@fullcalendar/core";

type Props = {
  events: EventInput[];
  onDateClick: (date: Date) => void;
  onEventClick: (id: string) => void;
};

export default function AppointmentCalendar({ events, onDateClick, onEventClick }: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      height="auto"
      events={events}
      dateClick={(info: DateClickArg) => onDateClick(info.date)}
      eventClick={(info: EventClickArg) => {
        info.jsEvent.preventDefault();
        onEventClick(info.event.id);
      }}
      nowIndicator
      dayMaxEvents={3}
    />
  );
}
