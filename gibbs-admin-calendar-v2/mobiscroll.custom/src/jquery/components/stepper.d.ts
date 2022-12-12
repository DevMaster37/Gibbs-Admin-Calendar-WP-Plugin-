import { MbscStepperOptions } from '../../core/components/stepper/stepper';
import { Stepper as StepperComp } from '../../core/components/stepper/stepper.common';
declare class Stepper extends StepperComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
export { MbscStepperOptions, Stepper, };
