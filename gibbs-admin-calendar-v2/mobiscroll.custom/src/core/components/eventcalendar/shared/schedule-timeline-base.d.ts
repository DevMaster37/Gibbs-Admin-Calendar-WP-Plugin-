import { BaseComponent, IBaseProps } from '../../../base';
import { MbscCalendarNavService } from '../../../shared/calendar-nav/calendar-nav';
import { DateType, ITimezonePlugin } from '../../../util/datetime';
import { MbscCalendarEvent, MbscCalendarEventData, MbscResource } from '../eventcalendar';
import { MbscEventConnection, MbscNewEventData, MbscSlot } from '../eventcalendar.types';
export declare const DEF_ID = "mbsc-def";
export interface ISTOptions extends IBaseProps {
    allDayText?: string;
    amText?: string;
    clickToCreate?: boolean | 'single' | 'double';
    connections?: MbscEventConnection[];
    colorsMap?: {
        [key: number]: MbscCalendarEvent[];
    };
    dayNames?: string[];
    dayNamesMin?: string[];
    dayNamesShort?: string[];
    dataTimezone?: string;
    dateFormat?: string;
    dateFormatLong?: string;
    displayTimezone?: string;
    dragTimeStep?: number;
    dragToCreate?: boolean;
    dragToMove?: boolean;
    dragToResize?: boolean;
    endDay: number;
    endTime?: string;
    eventMap?: {
        [key: string]: MbscCalendarEvent[];
    };
    eventOrder?: (event1: MbscCalendarEvent, event2: MbscCalendarEvent) => number;
    exclusiveEndDates?: boolean;
    extendDefaultEvent?: (args: MbscNewEventData) => MbscCalendarEvent;
    externalDrop?: boolean;
    firstDay?: number;
    getDay?: (d: Date) => number;
    getDate?: (y: number, m: number, d: number, h?: number, i?: number, s?: number, u?: number) => Date;
    getMonth?: (d: Date) => number;
    getWeekNumber?: (d: Date) => number;
    getYear?: (d: Date) => number;
    groupBy?: 'date' | 'resource';
    height?: number;
    invalidateEvent?: 'start-end' | 'strict';
    invalidsMap?: {
        [key: number]: MbscCalendarEvent[];
    };
    eventList?: boolean;
    maxDate: number;
    minDate: number;
    monthNames?: string[];
    monthNamesShort?: string[];
    navigateToEvent?: MbscCalendarEvent;
    navigationService: MbscCalendarNavService;
    nextIcon?: string;
    nextIconRtl?: string;
    downIcon?: string;
    newEventText?: string;
    pmText?: string;
    refDate?: DateType;
    resources?: MbscResource[] | null | undefined;
    rowHeight?: 'variable' | 'equal';
    scroll: number;
    selected: number;
    selectedEventsMap: {
        [key: number]: MbscCalendarEvent;
    };
    showAllDay?: boolean;
    showDays?: boolean;
    showEventTooltip?: boolean;
    weekNumbers?: boolean;
    size?: number;
    slots?: MbscSlot[] | null | undefined;
    startDay: number;
    startTime?: string;
    timeCellStep: number;
    timeFormat?: string;
    timeLabelStep: number;
    timezonePlugin?: ITimezonePlugin;
    type: 'week' | 'day' | 'month' | 'year';
    virtualScroll?: boolean;
    weekText?: string;
    width?: number;
    eventDragEnd(args: any): boolean;
    onCellClick(args: any): void;
    onCellDoubleClick(args: any): void;
    onCellRightClick(args: any): void;
    onEventClick(args: any): void;
    onEventDoubleClick(args: any): void;
    onEventRightClick(args: any): void;
    onEventDelete(args: any): void;
    onEventHoverIn(args: any): void;
    onEventHoverOut(args: any): void;
    onEventDragEnd?(args: any, inst: any): void;
    onEventDragStart?(args: any, inst: any): void;
    renderEventContent?(event: MbscCalendarEventData): any;
    renderEvent?(event: MbscCalendarEventData): any;
    renderResource?(resource: MbscResource): any;
    renderResourceHeader?(): any;
}
export interface ISTState {
    batchIndexX?: number;
    batchIndexY?: number;
    cellHeight?: number;
    cellWidth?: number;
    dayNameWidth?: number;
    dayWidth?: number;
    dragData?: IDragData;
    eventHeight?: number;
    gridWidth?: number;
    hasScrollX?: boolean;
    hasScrollY?: boolean;
    headerHeight?: number;
    isTouchDrag?: boolean;
    rowHeight?: number;
    scrollContHeight?: number;
    update?: number;
}
export interface IDailyColors {
    allDay?: MbscCalendarEventData;
    colors: MbscCalendarEventData[];
}
export interface IDailyEvents {
    allDay: MbscCalendarEventData[];
    events: MbscCalendarEventData[];
}
export interface IDailyInvalids {
    allDay?: MbscCalendarEventData;
    invalids: MbscCalendarEventData[];
}
export interface IEventPosData {
    cssClass?: string;
    start?: string;
    startDate: Date;
    end?: string;
    endDate: Date;
    position?: {
        height?: string;
        left?: string;
        right?: string;
        top?: string;
        width?: string;
    };
}
export interface IDragData {
    /**
     * The dates of the event which is dragged.
     * We need to display the event boxes in case of touch drag, when we enter drag mode,
     * and continue to display during drag, but invisible, otherwise, if we loose the
     * element on which the touch started, the touch events will stop firing.
     */
    originDates?: {
        [key: string]: MbscCalendarEventData;
    };
    /** The dates of the dragged event. */
    draggedDates?: {
        [key: string]: MbscCalendarEventData;
    };
    /** The dragged event, displayed during drßag. */
    draggedEvent?: MbscCalendarEventData;
    resource?: number | string;
    slot?: number | string;
}
interface IDayData {
    date: Date;
    dateIndex: number;
    dateKey: string;
    dateText: string;
    day: number;
    label: string;
    lastOfMonth?: boolean;
    lastOfWeek?: boolean;
    monthIndex: number;
    monthText: string;
    monthTitle: string;
    timestamp: number;
    weekIndex: number;
    weekText: string;
    weekTitle: string;
}
interface IVirtualPage {
    top: number;
    startIndex: number;
}
/** @hidden */
export declare function getResourceMap(eventsMap: {
    [key: string]: MbscCalendarEvent[];
}, resources: MbscResource[], slots: MbscSlot[], hasResources: boolean, hasSlots: boolean): {
    [key: string]: {
        [key: string]: {
            [key: string]: MbscCalendarEvent[];
        };
    };
};
/** @hidden */
export declare function getCellDate(timestamp: number, ms: number): Date;
/** @hidden */
export declare class STBase<PropType extends ISTOptions, StateType extends ISTState> extends BaseComponent<PropType, StateType> {
    _batchEnd: Date;
    _batchStart: Date;
    _batchRowNr: number;
    _colors: {
        [key: string]: {
            [key: string]: {
                [key: string]: IDailyColors;
            };
        };
    };
    /** Map containing the day index for each day; timestamp ->  dayIndex */
    _dayIndexMap: {
        [key: string]: number;
    };
    _dayNames: string[];
    /** Array containing the days to display */
    _days: IDayData[];
    _daysBatch: IDayData[];
    _daysBatchNr: number;
    /** Number of displayed days */
    _daysNr: number;
    _dayWidth: number;
    _displayTime: boolean;
    _endCellStyle: {
        height?: string;
        width?: string;
    } | undefined;
    /** Displayed end time as milliseconds since midnight */
    _endTime: number;
    _eventHeight: number;
    _eventMap: {
        [key: string]: MbscCalendarEventData;
    };
    /** Number of event rows for a resource, used for row height calculation */
    _eventRows: {
        [key: number]: number;
    };
    _events: {
        [key: string]: {
            [key: string]: {
                [key: string]: IDailyEvents;
            };
        };
    };
    _firstDay: Date;
    _firstDayTz: Date;
    _gridWidth: number;
    _groupByResource: boolean;
    _gridHeight: number;
    _hasHierarchy: boolean;
    _hasSlots: boolean;
    _hasSideSticky: boolean;
    _hasSticky: boolean;
    _headerClass: string;
    _headerDays: IDayData[];
    _invalids: {
        [key: string]: {
            [key: string]: {
                [key: string]: IDailyInvalids;
            };
        };
    };
    _isMulti: boolean;
    _isSingleResource: boolean;
    _isTimeline: boolean;
    _lastDay: Date;
    _lastDayTz: Date;
    _placeholderSizeX: number;
    _placeholderSizeY: number;
    /** Contains the resources flatten out into one level */
    _resources: MbscResource[];
    _resourcesBatch: MbscResource[];
    _selectedDay: number;
    _setRowHeight: boolean;
    _showTimeIndicator: boolean;
    _showCursorTime: boolean;
    _slots: MbscSlot[];
    _startCellStyle: {
        height?: string;
        width?: string;
    } | undefined;
    /** Displayed start time as milliseconds since midnight */
    _startTime: number;
    _stepCell: number;
    _stepLabel: number;
    /** Displayed time as milliseconds */
    _time: number;
    /** Array containing the hours to display */
    _timeLabels: {
        [key: number]: string;
    };
    _times: number[];
    _timesBetween: number[];
    protected _calcConnections: boolean;
    protected _cursorTimeCont: HTMLElement | null;
    protected _gridCont: HTMLElement | null;
    protected _headerCont: HTMLElement | null;
    protected _isParentClick: boolean;
    protected _resCont: HTMLElement | null;
    protected _resourceTops: {
        [key: string]: number;
    };
    protected _scrollCont: HTMLElement | null;
    protected _shouldAnimateScroll: boolean | undefined;
    protected _shouldCheckSize: boolean;
    protected _shouldScroll: boolean;
    protected _visibleResources: MbscResource[];
    protected _virtualPagesY: IVirtualPage[];
    private _allDayTop;
    private _cursorX;
    private _cursorY;
    private _colHeight;
    private _colWidth;
    private _gridContBottom;
    private _gridContLeft;
    private _gridContRight;
    private _gridContTop;
    private _gridLeft;
    private _gridRight;
    private _gridTop;
    private _isCursorTimeVisible;
    private _isTouch;
    private _onCalendar;
    private _resWidth;
    private _scrollTimer;
    private _scrollX;
    private _scrollY;
    private _tempAllDay;
    private _tempEnd;
    private _tempEvent;
    private _tempResource;
    private _tempSlot;
    private _tempStart;
    private _touchTimer;
    private _unlisten;
    private _unsubscribe;
    _isToday(d: number): boolean;
    _formatTime(v: number, timezone?: string): string;
    _onScroll: () => void;
    _onTouchStart: () => void;
    _onMouseLeave: () => void;
    _onMouseMove: (ev?: any, delta?: number) => void;
    _onEventDragModeOn: (args: any) => void;
    _onEventDragModeOff: (args: any) => void;
    _onEventDragStart: (args: any) => void;
    _onEventDragMove: (args: any) => void;
    _onEventDragEnd: (args: any) => void;
    _onExternalDrag: (args: any) => void;
    protected _getEventPos(event: MbscCalendarEventData, day: Date, dateKey: string, displayedMap: Map<MbscCalendarEvent, boolean>): IEventPosData | undefined;
    protected _getEventData(event: MbscCalendarEvent, d: Date, resource?: MbscResource, skipLabels?: boolean): MbscCalendarEventData;
    protected _getEvents(eventMap: {
        [key: string]: MbscCalendarEvent[];
    }): {
        [key: string]: {
            [key: string]: {
                [key: string]: IDailyEvents;
            };
        };
    };
    protected _getInvalids(invalidMap: {
        [key: string]: MbscCalendarEvent[];
    }): {
        [key: string]: {
            [key: string]: {
                [key: string]: IDailyInvalids;
            };
        };
    };
    protected _getColors(colorMap: {
        [key: string]: MbscCalendarEvent[];
    }): {
        [key: string]: {
            [key: string]: {
                [key: string]: IDailyColors;
            };
        };
    };
    protected _flattenResources(resources: MbscResource[] | null | undefined, flat: MbscResource[], depth: number, all?: boolean): MbscResource[];
    protected _render(s: ISTOptions, state: ISTState): void;
    protected _mounted(): void;
    protected _updated(): void;
    protected _destroy(): void;
    private _calcGridSizes;
    private _getDragDates;
    /**
     * Returns a date with the time based on the coordinates on the grid.
     * @param day We're on this day.
     * @param posX X coord - for timeline.
     * @param posY Y coord - for schedule.
     * @param dayIndex Index of the day on the timeline.
     * @param timeStep Time step in minutes.
     */
    private _getGridTime;
    private _scrollToTime;
}
export {};
