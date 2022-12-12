import { CalendarContext, CalendarNav, CalendarNext, CalendarPrev, CalendarToday } from '../../shared/calendar-view/calendar-header';
import { CalendarView } from '../../shared/calendar-view/calendar-view.common';
import { InstanceServiceBase } from '../../shared/instance-service';
import { CalendarBase, MbscCalendarOptions } from './calendar';
import './calendar.scss';
export { CalendarContext, CalendarNext, CalendarPrev, CalendarToday, CalendarNav };
/**
 * The Calendar component.
 *
 * Usage:
 *
 * ```
 * <Calendar />
 * ```
 */
export declare class Calendar extends CalendarBase {
    _instanceService: InstanceServiceBase;
    protected _setCal: (cal: CalendarView) => void;
    protected _template(s: MbscCalendarOptions): any;
}
