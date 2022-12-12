import { CalendarViewBase } from './calendar-view';
import { ICalendarViewProps, ICalendarViewState } from './calendar-view.types';
import '../../base.scss';
import './calendar-view.scss';
/** @hidden */
export declare class CalendarView extends CalendarViewBase {
    private _headerElement;
    private _headerHTML;
    private _shouldEnhanceHeader;
    protected _setHeader: (el: HTMLDivElement) => void;
    protected _setBody: (el: any) => void;
    protected _setPickerCont: (el: any) => void;
    protected _renderMonthView: (timestamp: number, props: any) => any;
    protected _renderMonth: (item: any, offset: number) => any;
    protected _renderYears: (item: any, offset: number) => any;
    protected _renderYear: (item: any, offset: number) => any;
    protected _template(s: ICalendarViewProps, state: ICalendarViewState): any;
    protected _updated(): void;
}
