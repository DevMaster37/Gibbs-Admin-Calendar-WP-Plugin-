import { MbscCheckboxOptions } from '../../core/components/checkbox/checkbox';
import { Checkbox as CheckboxComp } from '../../core/components/checkbox/checkbox.common';
declare class Checkbox extends CheckboxComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
export { Checkbox, MbscCheckboxOptions, };
