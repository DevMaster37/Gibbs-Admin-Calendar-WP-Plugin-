import { Eventcalendar as EventcalendarComponent } from '../../core/components/eventcalendar/eventcalendar.common';
export { formatDate, getJson, MbscCalendarColor, MbscCalendarEvent, MbscCalendarEventData, MbscCalendarLabel, MbscCalendarMarked, MbscCellClickEvent, MbscCellHoverEvent, MbscEventcalendarOptions, MbscEventcalendarView, MbscEventClickEvent, MbscEventConnection, MbscEventCreateEvent, MbscEventCreateFailedEvent, MbscEventCreatedEvent, MbscEventDeleteEvent, MbscEventDeletedEvent, MbscEventUpdateEvent, MbscEventUpdateFailedEvent, MbscEventUpdatedEvent, MbscLabelClickEvent, MbscPageChangeEvent, MbscPageLoadingEvent, MbscPageLoadedEvent, MbscRecurrenceRule, MbscResource, MbscSelectedDateChangeEvent, momentTimezone, luxonTimezone, parseDate, updateRecurringEvent, } from '../../core/components/eventcalendar/eventcalendar';
export * from '../shared/calendar-header';
export * from './draggable';
declare class Eventcalendar extends EventcalendarComponent {
    static _fname: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
export { Eventcalendar, };
