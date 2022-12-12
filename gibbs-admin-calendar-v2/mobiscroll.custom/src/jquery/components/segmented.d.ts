import { SegmentedGroup as SegmentedGroupComp } from '../../core/components/segmented/segmented-group.common';
import { MbscSegmentedOptions } from '../../core/components/segmented/segmented-item';
import { Segmented as SegmentedComp } from '../../core/components/segmented/segmented-item.common';
declare class Segmented extends SegmentedComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
declare class SegmentedGroup extends SegmentedGroupComp {
    static _fname: string;
    static _selector: string;
    static _renderOpt: import("../../preact/renderer").IRenderOptions;
}
export { Segmented, SegmentedGroup, MbscSegmentedOptions, };
