interface TheRoom {
  name: string,
  code: string
}

interface CalendarView {
  name: string,
  code: 'resourceTimeGridDay' | 'timeGridWeek',
  smallCalCode: 'date' | 'week' | 'month'
}

interface Building {
  name: string,
}
