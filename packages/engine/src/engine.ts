import {Engine} from "@babylonjs/core";
import {Nullable} from "./types";

/** An interface defining options to be passed to the ArylEngine.*/
export interface ArylEngineOptions {

}

export class ArylEngine {

    private options;

    /** An instance of the underlying BabylonJS engine.*/
    private engine: Engine;

    /** Returns the current version of the engine.*/
    public static get version(): string {
        return "0.0.1"
    }

    public constructor(canvas: Nullable<HTMLCanvasElement>, options: ArylEngineOptions) {
        this.options = options;
        this.engine = new Engine(canvas, false, {});
    }

    /** */
    public render(): void {

    }

    /** */
    public update(): void {

    }

}
