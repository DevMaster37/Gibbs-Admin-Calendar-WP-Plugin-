import { MbscCalendarDayData } from '../../shared/calendar-view/calendar-day';
import { ICalendarProps, ILabelDragData, MbscCalendarEvent, MbscCalendarEventData, MbscCalendarLabel, MbscCalendarMarked, MbscResource } from '../../shared/calendar-view/calendar-view.types';
import { DateType } from '../../util/datetime';
import { EventcalendarBase } from './eventcalendar';
export interface IScheduleTimezone {
    cssClass?: string;
    label: string;
    timezone: string;
}
export interface MbscSelectedDateChangeEvent {
    date: DateType;
}
export interface MbscSelectedEventsChangeEvent {
    events: MbscCalendarEvent[];
    inst: EventcalendarBase;
}
export interface MbscCellClickEvent {
    date: Date;
    domEvent: any;
    events: MbscCalendarEvent[];
    resource: number | string;
    selected: boolean;
    source: 'calendar' | 'schedule' | 'timeline';
    target: HTMLElement;
}
export interface MbscCellHoverEvent {
    date: Date;
    domEvent: any;
    events: MbscCalendarEvent[];
    labels: MbscCalendarLabel[];
    marked: MbscCalendarMarked[];
    selected: boolean;
    target: HTMLElement;
}
export interface MbscEventClickEvent {
    date: Date;
    domEvent: any;
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
    resource: number | string;
    source: 'agenda' | 'calendar' | 'popover' | 'schedule' | 'timeline';
}
export interface MbscEventDeleteEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    events?: MbscCalendarEvent[];
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
    target?: HTMLElement;
}
export interface MbscEventDeletedEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    events?: MbscCalendarEvent[];
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventCreateEvent {
    action: 'click' | 'drag' | 'externalDrop';
    domEvent: any;
    event: MbscCalendarEvent;
    originEvent: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventCreatedEvent {
    action: 'click' | 'drag' | 'externalDrop';
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
    target?: HTMLElement;
}
export interface MbscEventUpdateEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    events?: MbscCalendarEvent[];
    newEvent: MbscCalendarEvent;
    oldEvent: MbscCalendarEvent;
    oldEvents?: MbscCalendarEvent[];
    oldEventOccurrence?: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventUpdatedEvent {
    event: MbscCalendarEvent;
    events?: MbscCalendarEvent[];
    oldEvent: MbscCalendarEvent;
    oldEvents?: MbscCalendarEvent[];
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
    target?: HTMLElement;
}
export interface MbscLabelClickEvent {
    date: Date;
    domEvent: any;
    label: MbscCalendarLabel;
    labels: MbscCalendarLabel[];
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
}
export interface MbscNewEventData {
    resource?: string | number;
    slot?: string | number;
    start: Date;
}
export interface MbscPageChangeEvent {
    firstDay: Date;
    lastDay: Date;
    month?: Date;
    inst: EventcalendarBase;
}
export interface MbscPageLoadingEvent {
    firstDay: Date;
    lastDay: Date;
    month?: Date;
    inst: EventcalendarBase;
}
export interface MbscPageLoadedEvent {
    firstDay: Date;
    lastDay: Date;
    month?: Date;
    inst: EventcalendarBase;
}
export interface MbscEventUpdateFailedEvent {
    event: MbscCalendarEvent;
    newEvent: MbscCalendarEvent;
    oldEvent: MbscCalendarEvent;
    oldEventOccurrence: MbscCalendarEvent;
    inst: EventcalendarBase;
    invalid: MbscCalendarEvent;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventCreateFailedEvent {
    action: 'click' | 'drag' | 'externalDrop';
    event: MbscCalendarEvent;
    originEvent: MbscCalendarEvent;
    inst: EventcalendarBase;
    invalid: MbscCalendarEvent;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventDragEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    resource?: number | string;
    slot?: number | string;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventcalendarView {
    agenda?: {
        type?: 'day' | 'week' | 'month' | 'year';
        scrollable?: boolean;
        size?: number;
    };
    calendar?: {
        count?: boolean;
        labels?: boolean | 'all' | number;
        outerDays?: boolean;
        popover?: boolean;
        popoverClass?: string;
        scroll?: 'horizontal' | 'vertical';
        size?: number;
        type?: 'year' | 'month' | 'week';
        weekNumbers?: boolean;
    };
    schedule?: {
        endDay?: number;
        endTime?: string;
        size?: number;
        startDay?: number;
        startTime?: string;
        type?: 'day' | 'week' | 'month';
        days?: boolean;
        allDay?: boolean;
        timeCellStep?: number;
        timeLabelStep?: number;
        timezones?: Array<IScheduleTimezone | string>;
    };
    timeline?: {
        endDay?: number;
        endTime?: string;
        eventList?: boolean;
        rowHeight?: 'variable' | 'equal';
        size?: number;
        startDay?: number;
        startTime?: string;
        type?: 'day' | 'week' | 'month' | 'year';
        timeCellStep?: number;
        timeLabelStep?: number;
        days?: boolean;
        allDay?: boolean;
        weekNumbers?: boolean;
    };
}
export interface MbscEventConnection {
    from: string | number;
    to: string | number;
    color?: string;
    cssClass?: string;
    arrow?: 'from' | 'to' | 'bidirectional' | boolean;
}
export interface MbscEventcalendarOptions extends ICalendarProps {
    actionableEvents?: boolean;
    chevronIconDown?: string;
    clickToCreate?: boolean | 'double' | 'single';
    colorEventList?: boolean;
    connections?: MbscEventConnection[];
    data?: MbscCalendarEvent[];
    dragTimeStep?: number;
    dragToCreate?: boolean;
    dragToMove?: boolean;
    dragToResize?: boolean;
    defaultSelectedDate?: DateType;
    eventDelete?: boolean;
    eventOrder?: (event1: MbscCalendarEvent, event2: MbscCalendarEvent) => number;
    /** @hidden */
    eventTemplate?: any;
    extendDefaultEvent?: (args: MbscNewEventData) => MbscCalendarEvent;
    externalDrop?: boolean;
    groupBy?: 'date' | 'resource';
    invalidateEvent?: 'start-end' | 'strict';
    refDate?: DateType;
    resources?: MbscResource[] | null | undefined;
    selectedDate?: DateType;
    selectedEvents?: MbscCalendarEvent[];
    selectMultipleEvents?: boolean;
    slots?: MbscSlot[] | null | undefined;
    showEventTooltip?: boolean;
    view?: MbscEventcalendarView;
    allDayText?: string;
    newEventText?: string;
    noEventsText?: string;
    renderAgenda?(events: MbscEventList[], options: MbscEventcalendarOptions, dayRefs: {
        [key: number]: HTMLElement | null;
    }): any;
    renderDay?(args: MbscCalendarDayData): any;
    renderDayContent?(args: MbscCalendarDayData): any;
    renderEvent?(data: MbscCalendarEventData): any;
    renderEventContent?(data: MbscCalendarEventData): any;
    renderHeader?(): any;
    renderLabel?(event: MbscCalendarEventData): any;
    renderLabelContent?(event: MbscCalendarEventData): any;
    renderResource?(resource: MbscResource): any;
    renderResourceHeader?(): any;
    renderSlot?(args: MbscSlotData): any;
    renderScheduleEvent?(event: MbscCalendarEventData): any;
    renderScheduleEventContent?(event: MbscCalendarEventData): any;
    onCellClick?(args: MbscCellClickEvent, inst: EventcalendarBase): void;
    onCellDoubleClick?(args: MbscCellClickEvent, inst: EventcalendarBase): void;
    onCellHoverIn?(args: MbscCellHoverEvent, inst: EventcalendarBase): void;
    onCellHoverOut?(args: MbscCellHoverEvent, inst: EventcalendarBase): void;
    onCellRightClick?(args: MbscCellClickEvent, inst: EventcalendarBase): void;
    onEventClick?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventCreate?(args: MbscEventCreateEvent, inst: EventcalendarBase): void;
    onEventCreated?(args: MbscEventCreatedEvent, inst: EventcalendarBase): void;
    onEventDelete?(args: MbscEventDeleteEvent, inst: EventcalendarBase): void;
    onEventDeleted?(args: MbscEventDeletedEvent, inst: EventcalendarBase): void;
    onEventDoubleClick?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventDragEnd?(args: MbscEventDragEvent, inst: EventcalendarBase): void;
    onEventDragStart?(args: MbscEventDragEvent, inst: EventcalendarBase): void;
    onEventRightClick?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventHoverIn?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventHoverOut?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventUpdate?(args: MbscEventUpdateEvent, inst: EventcalendarBase): void;
    onEventUpdated?(args: MbscEventUpdatedEvent, inst: EventcalendarBase): void;
    onEventUpdateFailed?(args: MbscEventUpdateFailedEvent, inst: EventcalendarBase): void;
    onEventCreateFailed?(args: MbscEventCreateFailedEvent, inst: EventcalendarBase): void;
    onLabelClick?(args: MbscLabelClickEvent, inst: EventcalendarBase): void;
    onPageChange?(args: MbscPageChangeEvent, inst: EventcalendarBase): void;
    onPageLoading?(args: MbscPageLoadingEvent, inst: EventcalendarBase): void;
    onPageLoaded?(args: MbscPageLoadedEvent, inst: EventcalendarBase): void;
    onSelectedDateChange?(args: MbscSelectedDateChangeEvent, inst: EventcalendarBase): void;
    onSelectedEventsChange?(args: MbscSelectedEventsChangeEvent, inst: EventcalendarBase): void;
}
/** @hidden */
export interface MbscEventcalendarState {
    activeDate?: number;
    eventList?: MbscEventList[];
    height?: number;
    isListScrollable?: boolean;
    isTouchDrag?: boolean;
    popoverDate?: number | undefined;
    popoverList?: MbscCalendarEventData[];
    selectedDate?: number;
    showPopover?: boolean;
    labelDragData?: ILabelDragData;
    width?: number;
}
export interface MbscEventList {
    date: string;
    events: MbscCalendarEventData[];
    timestamp: number;
}
export interface MbscSlot {
    id: number | string;
    name?: string;
    color?: string;
    [x: string]: any;
}
export interface MbscSlotData {
    date: Date;
    slot: MbscSlot;
}
