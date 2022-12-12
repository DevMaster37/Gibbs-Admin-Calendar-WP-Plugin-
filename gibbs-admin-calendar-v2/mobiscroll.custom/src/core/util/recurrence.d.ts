import { MbscCalendarEvent } from '../shared/calendar-view/calendar-view.types';
import { IDatetimeProps } from './datetime';
import { IOccurrence, MbscRecurrenceRule } from './recurrence.types';
/** @hidden */
export declare function parseRule(ruleStr: string): MbscRecurrenceRule;
/** @hidden */
export declare function getRule(rule: string | MbscRecurrenceRule | undefined): MbscRecurrenceRule;
/**
 * Updates a recurring rule, based on a new start date and old start date.
 * @param recurringRule
 * @param newStart
 * @param oldStart
 */
export declare function updateRecurringRule(recurringRule: MbscRecurrenceRule | string, newStart: Date | string | {}, oldStart: Date | string | {}): MbscRecurrenceRule;
/**
 * Updates a recurring event, returns the updated and the new event.
 * @param originalRecurringEvent The original event to update.
 * @param oldEventOccurrence The original event occurrence in case of d&d (what is dragged).
 * @param newEvent The created even in case of d&d (where is dragged).
 * @param updatedEvent The updated event from popup.
 * @param updateMode The update type.
 */
export declare function updateRecurringEvent(originalRecurringEvent: MbscCalendarEvent, oldEventOccurrence: MbscCalendarEvent | null, newEvent: MbscCalendarEvent | null, updatedEvent: MbscCalendarEvent | null, updateMode: 'current' | 'following' | 'all', timezone?: string, timezonePlugin?: any): {
    updatedEvent: MbscCalendarEvent;
    newEvent: MbscCalendarEvent | null;
};
/**
 * @hidden
 * Returns the first date on which occurs something from the list of rules/dates
 * For example it returns the next invalid date from the list of invalid and a given start date
 */
export declare function getNextOccurrence(list: any[], from: Date, s: IDatetimeProps, displayFormat?: string): Date | null;
/**
 * @hidden
 * Returns the latest possible date from a list without braking a consecutive day sequence.
 */
export declare function getLatestOccurrence(list: any[], from: Date, s: IDatetimeProps, displayFormat?: string): Date;
/** @hidden */
export declare function getExceptionList(exception?: string | {} | Date): Array<string | {} | Date>;
/** @hidden */
export declare function getOccurrences(rule: MbscRecurrenceRule | string, dtStart: Date, start: Date, end: Date | undefined, s: IDatetimeProps, exception?: string | Date, exceptionRule?: MbscRecurrenceRule | string, returnOccurrence?: 'first' | 'last' | 'all'): IOccurrence[] | Date | null;
/** @hidden */
export declare function getEventMap(list: any[], start: Date, end: Date, s: IDatetimeProps, overwrite?: boolean): {} | undefined;
