import { BaseComponent } from '../../base';
import { MbscPrintConfig } from '../../print';
import { MbscCalendarNavService } from '../../shared/calendar-nav/calendar-nav';
import { CalendarViewBase } from '../../shared/calendar-view/calendar-view';
import { ILabelDragDataSet, IPageChangeEvent, IPageLoadedEvent, IPageLoadingEvent, MbscCalendarEvent, MbscCalendarEventData, MbscResource } from '../../shared/calendar-view/calendar-view.types';
import { DateType } from '../../util/datetime';
import { IScheduleTimezone, MbscEventcalendarOptions, MbscEventcalendarState, MbscEventList } from './eventcalendar.types';
export { formatDatePublic as formatDate, parseDate } from '../../util/datetime';
export { getJson } from '../../util/http';
export { updateRecurringEvent } from '../../util/recurrence';
export * from '../../util/luxon';
export * from '../../util/moment';
export * from '../../util/recurrence.types';
export * from '../../shared/calendar-view/calendar-view.types';
export * from './eventcalendar.types';
/** @hidden */
export declare class EventcalendarBase extends BaseComponent<MbscEventcalendarOptions, MbscEventcalendarState> {
    /** @hidden */
    static defaults: MbscEventcalendarOptions;
    protected static _name: string;
    state: MbscEventcalendarState;
    eventList: MbscEventList[] | undefined;
    print: (config?: MbscPrintConfig) => void;
    /** @hidden */
    _active: number;
    /** @hidden */
    _anchor: HTMLDivElement;
    /** @hidden */
    _calendarScroll: 'horizontal' | 'vertical' | undefined;
    /** @hidden */
    _calendarSize: number;
    /** @hidden */
    _calendarLabelList: 'all' | number | boolean | undefined;
    /** @hidden */
    _calendarType: 'year' | 'month' | 'week';
    /** @hidden */
    _calendarView: CalendarViewBase;
    /** @hidden */
    _colorEventList: boolean;
    /** @hidden */
    _colorsMap: {
        [key: number]: MbscCalendarEvent[];
    } | undefined;
    /** @hidden */
    _cssClass: string;
    /** @hidden */
    _eventListType: 'year' | 'month' | 'week' | 'day';
    /** @hidden */
    _eventListSize: number;
    /** @hidden */
    _eventMap: {
        [key: string]: MbscCalendarEvent[];
    };
    /** @hidden */
    _invalidsMap: {
        [key: number]: MbscCalendarEvent[];
    } | undefined;
    /** @hidden */
    _labelsMap: {
        [key: string]: MbscCalendarEvent[];
    } | undefined;
    /** @hidden */
    _list: HTMLElement | null;
    /** @hidden */
    _listDays: {
        [key: number]: HTMLElement | null;
    } | null;
    /** @hidden */
    _marksMap: {
        [key: string]: MbscCalendarEvent[];
    } | undefined;
    /** @hidden */
    _maxDate: number;
    /** @hidden */
    _minDate: number;
    /** @hidden */
    _navigateToEvent: MbscCalendarEvent | undefined;
    /** @hidden */
    _navService: MbscCalendarNavService;
    /** @hidden */
    _pageLoad: number;
    /** @hidden */
    _popoverClass: string;
    /** @hidden Flag for the print method to turn off virtual scrolling */
    _print: boolean;
    /** @hidden */
    _rangeEndDay: number | undefined;
    /** @hidden */
    _rangeStartDay: number | undefined;
    /** @hidden */
    _rangeType: 'year' | 'month' | 'week' | 'day';
    /** @hidden */
    _refDate: Date;
    /** @hidden */
    _resourcesMap: {
        [key: number]: MbscResource;
    };
    /** @hidden */
    _scheduleType: 'month' | 'week' | 'day';
    /** @hidden */
    _scheduleEndDay: number;
    /** @hidden */
    _scheduleStartDay: number;
    /** @hidden */
    _scheduleEndTime: string | undefined;
    /** @hidden */
    _scheduleSize: number;
    /** @hidden */
    _scheduleStartTime: string | undefined;
    /** @hidden */
    _scheduleTimeCellStep: number;
    /** @hidden */
    _scheduleTimeLabelStep: number;
    /** @hidden */
    _scheduleTimezones: Array<IScheduleTimezone | string> | undefined;
    /** @hidden */
    _timelineSize: number;
    /** @hidden */
    _timelineType: 'year' | 'month' | 'week' | 'day';
    /** @hidden */
    _timelineEndDay: number;
    /** @hidden */
    _timelineStartDay: number;
    /** @hidden */
    _timelineEndTime: string | undefined;
    /** @hidden */
    _timelineStartTime: string | undefined;
    /** @hidden */
    _timelineRowHeight: 'variable' | 'equal' | undefined;
    /** @hidden */
    _timelineTimeCellStep: number;
    /** @hidden */
    _timelineTimeLabelStep: number;
    /** @hidden */
    _timelineListing: boolean | undefined;
    /** @hidden */
    _selected: number;
    /** @hidden */
    _selectedDateHeader: string;
    /** @hidden */
    _selectedDates: {
        [key: number]: boolean;
    };
    /** @hidden */
    _selectedEventsMap: {
        [key: number]: MbscCalendarEvent;
    };
    /** @hidden */
    _selectedDateTime: number;
    /** @hidden */
    _shouldScrollSchedule: number;
    /** @hidden */
    _showCalendar: boolean | undefined;
    /** @hidden */
    _showDate: boolean | undefined;
    /** @hidden */
    _showEventCount: boolean | undefined;
    /** @hidden */
    _showEventLabels: boolean | undefined;
    /** @hidden */
    _showEventList: boolean | undefined;
    /** @hidden */
    _showEventPopover: boolean | undefined;
    /** @hidden */
    _showOuterDays: boolean | undefined;
    /** @hidden */
    _showSchedule: boolean | undefined;
    /** @hidden */
    _showScheduleAllDay: boolean | undefined;
    /** @hidden */
    _showScheduleDays: boolean | undefined;
    /** @hidden */
    _showTimeline: boolean | undefined;
    /** @hidden */
    _showTimelineWeekNumbers: boolean | undefined;
    /** @hidden */
    _showWeekNumbers: boolean | undefined;
    /** @hidden */
    _rowTops: number[];
    /** @hidden */
    _update: number;
    /** @hidden */
    _validsMap: {
        [key: number]: MbscCalendarEvent[];
    } | undefined;
    _firstDay: Date;
    _firstWeekDay: number;
    _lastDay: Date;
    /** @hidden */
    _onScroll: (...args: any[]) => void;
    protected _eventListHTML: any;
    protected _popoverList?: HTMLElement;
    protected _shouldLoadDays: boolean;
    private _tempDay;
    private _tempWeek;
    private _tempEvent;
    private _calCellWidth;
    private _areaTop;
    private _areaLeft;
    private _areaBottom;
    private _areaRight;
    private _onCalendar;
    private _triggerCreated;
    private _triggerUpdated;
    private _triggerDeleted;
    private _defaultDate;
    private _events;
    private _hoverTimer;
    private _isHover;
    private _isEventClick;
    private _isListScrolling;
    private _isPageChange;
    private _moreLabelClicked;
    private _refresh;
    private _shouldAnimateScroll;
    private _shouldScroll;
    private _shouldSkipScroll;
    private _skipScheduleScroll;
    private _unsubscribe;
    private _viewChanged;
    /**
     * Sets the events for the calendar.
     * @param events Array containing the events.
     */
    addEvent(events: MbscCalendarEvent | MbscCalendarEvent[]): string[];
    /**
     * Returns the events between start/end.
     */
    getEvents(start?: DateType, end?: DateType): MbscCalendarEvent[];
    /**
     * Returns the invalids between start/end.
     */
    getInvalids(start?: DateType, end?: DateType): MbscCalendarEvent[];
    /**
     * Returns the selected events.
     */
    getSelectedEvents(): MbscCalendarEvent[];
    /**
     * Sets the events for the calendar.
     * @param events Array containing the events.
     */
    setEvents(events: MbscCalendarEvent[]): string[];
    /**
     * Set the selected events.
     */
    setSelectedEvents(selectedEvents: MbscCalendarEvent[]): void;
    /**
     * Removes one or more events from the calendar.
     * @param events
     */
    removeEvent(events: string | number | MbscCalendarEvent | string[] | number[] | MbscCalendarEvent[]): void;
    /**
     * Navigates the calendar to the specified event.
     * @param event
     */
    navigateToEvent(event: MbscCalendarEvent): void;
    /**
     * Navigates the calendar to the specified date.
     * @param date
     */
    navigate(date: DateType, animate?: boolean): void;
    /**
     * Updates one or more events in the calendar.
     * @param events
     */
    updateEvent(events: MbscCalendarEvent | MbscCalendarEvent[]): void;
    /**
     * Refreshes the view.
     */
    refresh(): void;
    /** @hidden */
    _onWeekDayClick: (d: number) => void;
    /** @hidden */
    _onDayClick: (args: any) => void;
    /** @hidden */
    _onActiveChange: (args: any) => void;
    /** @hidden */
    _onGestureStart: (args: any) => void;
    /** @hidden */
    _onDayDoubleClick: (args: any) => void;
    /** @hidden */
    _onDayRightClick: (args: any) => void;
    /** @hidden */
    _onCellHoverIn: (args: any) => void;
    /** @hidden */
    _onCellHoverOut: (args: any) => void;
    /** @hidden */
    _onEventHoverIn: (args: any) => void;
    /** @hidden */
    _onEventHoverOut: (args: any) => void;
    /** @hidden */
    _onEventClick: (args: any) => void;
    /** @hidden */
    _onEventDoubleClick: (args: any) => void;
    /** @hidden */
    _onEventRightClick: (args: any) => void;
    /** @hidden */
    _onEventDragEnd: (args: any) => void;
    /** @hidden */
    _onEventDragStart: (args: any) => void;
    /** @hidden */
    _onLabelHoverIn: (args: any) => void;
    /** @hidden */
    _onLabelHoverOut: (args: any) => void;
    /** @hidden */
    _onLabelClick: (args: any) => void;
    /** @hidden */
    _onLabelDoubleClick: (args: any) => void;
    /** @hidden */
    _onLabelRightClick: (args: any) => void;
    /** @hidden */
    _onCellClick: (args: any) => void;
    /** @hidden */
    _onCellDoubleClick: (args: any) => void;
    /** @hidden */
    _onCellRightClick: (args: any) => void;
    /** @hidden */
    _onPageChange: (args: IPageChangeEvent) => void;
    /** @hidden */
    _onPageLoading: (args: IPageLoadingEvent) => void;
    /** @hidden */
    _onPageLoaded: (args: IPageLoadedEvent) => void;
    /** @hidden */
    _onPopoverClose: () => void;
    /** @hidden */
    _onResize: (ev: any) => void;
    /** @hidden */
    _onSelectedEventsChange: (events: any) => void;
    /** @hidden */
    _getDragDates: (start: Date, end: Date, event: MbscCalendarEventData) => {
        [key: number]: ILabelDragDataSet;
    };
    _onLabelUpdateModeOn: (args: any) => void;
    _onLabelUpdateModeOff: (args: any) => void;
    _onLabelUpdateStart: (args: any) => void;
    _onLabelUpdateMove: (args: any) => void;
    _onLabelUpdateEnd: (args: any) => void;
    _onEventDragStop: (args: any) => boolean;
    _onExternalDrag: (args: any) => void;
    /** @hidden */
    _onEventDelete: (args: any) => void;
    protected _render(s: MbscEventcalendarOptions, state: MbscEventcalendarState): void;
    protected _mounted(): void;
    protected _updated(): void;
    protected _destroy(): void;
    private _onKeyDown;
    private _resetSelection;
    private _getAgendaEvents;
    private _getEventData;
    /**
     * Returns the timestamp of the closest day which falls between the specified start and end weekdays.
     * @param timestamp The timestamp of the date to validate.
     * @param dir Navigation direction. If not specified, it will return the next valid day, otherwise the next or prev, based on direction.
     */
    private _getValidDay;
    private _setEventList;
    private _hidePopover;
    private _scrollToDay;
    private _selectedChange;
    private _cellClick;
    private _dayClick;
    private _labelClick;
    private _eventClick;
    /**
     * Handles multiple event selection on label/event click.
     */
    private _handleMultipleSelect;
}
