import { Eventcalendar, MbscEventcalendarOptions } from '../presets/eventcalendar';
export { Eventcalendar, MbscEventcalendarOptions };
import { Popup, MbscPopupOptions, Widget, MbscWidgetOptions } from '../classes/popup';
export { Popup, MbscPopupOptions, Widget, MbscWidgetOptions };
export { IMobiscroll } from '../core/core';
export { mobiscroll as default } from '../core/core';
declare global {
    interface MobiscrollBundle {
        [index: number]: JQuery;
               eventcalendar(options?: MbscEventcalendarOptions): JQuery;
               popup(options?: MbscPopupOptions): JQuery;
               widget(options?: MbscWidgetOptions): JQuery;
    }
    interface JQuery {
        mobiscroll(): MobiscrollBundle;
        mobiscroll(option: string): any;
    }
}
