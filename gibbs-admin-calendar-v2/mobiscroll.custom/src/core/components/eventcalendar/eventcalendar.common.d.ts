import { CalendarContext, CalendarNav, CalendarNext, CalendarPrev, CalendarToday } from '../../shared/calendar-view/calendar-header';
import { ICalendarViewHost } from '../../shared/calendar-view/calendar-view.types';
import { InstanceServiceBase } from '../../shared/instance-service';
import { List } from '../list/list.common';
import { EventcalendarBase, MbscCalendarEventData } from './eventcalendar';
import { MbscEventcalendarOptions, MbscEventcalendarState } from './eventcalendar.types';
import './eventcalendar.scss';
export { CalendarContext, CalendarNext, CalendarPrev, CalendarToday, CalendarNav };
/**
 * The Eventcalendar component.
 *
 * Usage:
 *
 * ```
 * <Eventcalendar />
 * ```
 */
export declare class Eventcalendar extends EventcalendarBase implements ICalendarViewHost {
    _instanceService: InstanceServiceBase;
    protected _setList: (el: HTMLElement) => void;
    protected _setPopoverList: (list: List) => void;
    protected _eventRenderer(data: MbscCalendarEventData, key: number, date: number, s: MbscEventcalendarOptions, isPopup?: boolean): any;
    protected _listRenderer(): any;
    protected _setEl: (el: any) => void;
    protected _template(s: MbscEventcalendarOptions, state: MbscEventcalendarState): any;
}
