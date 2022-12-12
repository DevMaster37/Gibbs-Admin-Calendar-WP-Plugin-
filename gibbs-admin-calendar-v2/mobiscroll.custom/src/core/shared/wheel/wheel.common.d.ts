import { IWheelProps, WheelBase } from './wheel';
/** @hidden */
export declare class Wheel extends WheelBase {
    protected renderer: (item: any, offset: number, is3d: boolean) => any;
    protected _template(s: IWheelProps, state: any): any;
}
