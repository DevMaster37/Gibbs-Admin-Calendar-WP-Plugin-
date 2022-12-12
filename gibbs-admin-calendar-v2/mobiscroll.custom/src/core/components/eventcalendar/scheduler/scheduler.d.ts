import { MbscCalendarDayData } from '../../../shared/calendar-view/calendar-day';
import { IScheduleTimezone } from '../eventcalendar.types';
import { ISTOptions, ISTState, STBase } from '../shared/schedule-timeline-base';
export interface ISchedulerOptions extends ISTOptions {
    groupBy?: 'date' | 'resource';
    timezones?: Array<IScheduleTimezone | string> | undefined;
    type: 'month' | 'week' | 'day';
    renderDay?(args: MbscCalendarDayData): any;
    renderDayContent?(args: MbscCalendarDayData): any;
    onWeekDayClick(arg: any): void;
}
export interface ISchedulerState extends ISTState {
    showShadow?: boolean;
}
/** @hidden */
export declare class SchedulerBase extends STBase<ISchedulerOptions, ISchedulerState> {
    _largeDayNames: boolean;
    _timeWidth: {
        width: string;
    } | undefined;
    _timezones: IScheduleTimezone[] | undefined;
    protected _allDayCont: HTMLElement | null;
    protected _timeCont: HTMLElement | null;
    _onScroll: () => void;
    protected _render(s: ISchedulerOptions, state: ISchedulerState): void;
}
