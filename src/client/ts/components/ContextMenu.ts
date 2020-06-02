import ELHandler from "../utils/ELHandler";

abstract class ACContextMenu {
    protected _contextMenu: HTMLElement;
    protected _contextMenuBody: HTMLElement;
    protected _elHandler: ELHandler;
    protected _externalEventHandler: ELHandler;

    protected _init(): void {};
    abstract show(): ContextMenu;
    abstract hide(): ContextMenu;
}

export default class ContextMenu extends ACContextMenu {
    protected _contextMenu: HTMLElement;
    protected _contextMenuBody: HTMLElement;
    protected _elHandler: ELHandler;
    protected _externalEventHandler: ELHandler;

    show(): ContextMenu {
        return this;
    };
    hide(): ContextMenu {
        return this;
    }

    protected _init(): void {};
}