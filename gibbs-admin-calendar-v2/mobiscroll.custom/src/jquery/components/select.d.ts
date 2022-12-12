import { MbscSelectOptions } from '../../core/components/select/select';
import { Select as SelectComp } from '../../core/components/select/select.common';
declare class Select extends SelectComp {
    static _fname: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
export { MbscPopupButton, MbscPopupDisplay, MbscPopupPredefinedButton } from '../../core/components/popup/popup';
export { getJson } from '../../core/util/http';
export { Select, MbscSelectOptions, };
