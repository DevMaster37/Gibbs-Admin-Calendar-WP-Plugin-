import { DatepickerBase, MbscDatepickerOptions } from './datepicker';
import './datepicker.scss';
export { CalendarContext, CalendarNext, CalendarPrev, CalendarToday, CalendarNav } from '../../shared/calendar-view/calendar-header';
/**
 * The Calendar component.
 *
 * Usage:
 *
 * ```
 * <Datepicker />
 * ```
 */
export declare class Datepicker extends DatepickerBase {
    protected _template(s: MbscDatepickerOptions): any;
}
