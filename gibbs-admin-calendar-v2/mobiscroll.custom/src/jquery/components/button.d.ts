import { MbscButtonOptions } from '../../core/components/button/button';
import { Button as ButtonComp } from '../../core/components/button/button.common';
declare class Button extends ButtonComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
export { Button, MbscButtonOptions, };
