import { ITimelineOptions, ITimelineState, TimelineBase } from './timeline';
import '../shared/schedule-timeline-base.scss';
import './timeline.scss';
export declare class Timeline extends TimelineBase {
    protected _setStickyHeader: (el: HTMLElement) => void;
    protected _setStickyDay: (el: HTMLElement) => void;
    protected _setStickyMonth: (el: HTMLElement) => void;
    protected _setStickyWeek: (el: HTMLElement) => void;
    protected _setCont: (el: HTMLElement) => void;
    protected _setResCont: (el: HTMLElement) => void;
    protected _setGridCont: (el: HTMLElement) => void;
    protected _setHeaderCont: (el: HTMLElement) => void;
    protected _setCursorTimeCont: (el: HTMLElement) => void;
    protected _template(s: ITimelineOptions, state: ITimelineState): any;
}
