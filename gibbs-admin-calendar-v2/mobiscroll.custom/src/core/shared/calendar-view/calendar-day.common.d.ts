import { CalendarDayBase, ICalendarDayProps } from './calendar-day';
import { ICalendarProcessedLabel } from './calendar-view.types';
/** @hidden */
export declare class CalendarDay extends CalendarDayBase {
    protected _renderEvent(s: ICalendarDayProps, label: ICalendarProcessedLabel, showText?: boolean, hidden?: boolean, isUpdate?: boolean, key?: string | number): any;
    protected _renderLabel(s: ICalendarDayProps, label: ICalendarProcessedLabel): any;
    protected _template(s: ICalendarDayProps): any;
}
