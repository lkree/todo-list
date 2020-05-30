/* App */
export abstract class ACApp {
    abstract async init(): Promise<void>;
}

/* Loader */
export abstract class ACLoader {
    static _spinner: HTMLElement;

    static show(): void {};
    static hide(): void {};
}

/* ClientServer */
export abstract class ACClientServer {
    static renderList(): void {};
}