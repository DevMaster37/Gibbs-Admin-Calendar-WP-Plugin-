import { ICalendarViewProps } from '../../components/eventcalendar/eventcalendar';
export declare class MbscCalendarNavService {
    pageIndex: number;
    firstDay: Date;
    lastDay: Date;
    firstPageDay: Date;
    lastPageDay: Date;
    viewStart: Date;
    viewEnd: Date;
    forcePageChange: boolean;
    pageSize: number;
    preventPageChange: boolean;
    private _prevS;
    private _s;
    options(news: ICalendarViewProps, forcePageLoading?: boolean): void;
    private pageChange;
    private pageLoading;
}
