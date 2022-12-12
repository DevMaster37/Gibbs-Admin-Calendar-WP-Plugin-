import { Dropdown as DropdownComp } from '../../core/components/input/dropdown.common';
import { MbscInputOptions } from '../../core/components/input/input';
import { Input as InputComp } from '../../core/components/input/input.common';
import { Textarea as TextareaComp } from '../../core/components/input/textarea.common';
declare class Input extends InputComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
declare class Dropdown extends DropdownComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
declare class Textarea extends TextareaComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
export { Dropdown, Input, Textarea, MbscInputOptions, };
