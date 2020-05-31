import {ClassNames} from "../misc/classNames";
import Utils from "../utils/Utils";
import ELHandler from "../utils/ELHandler";
import {IEventListItem} from "../misc/interface";
import {Statuses} from "../misc/Statuses";

abstract class ACPopup {
    protected _popup: HTMLElement;
    protected _popupBody: HTMLElement;
    protected _closeButton: HTMLElement;
    protected _declineButton: HTMLElement;
    protected _acceptButton: HTMLElement;
    protected _elHandler: ELHandler;
    protected _externalEventHandler: ELHandler;

    protected _init(): void {};
    abstract show(): this;
    abstract hide(): this;
    abstract destroy(): void;
}

export default class Popup extends ACPopup {
    protected _popup: HTMLElement = document.querySelector(ClassNames.popup);
    protected _popupBody: HTMLElement = this._popup.querySelector(ClassNames.popupBody);
    protected _closeButton: HTMLElement = this._popup.querySelector(ClassNames.popupClose);
    protected _declineButton: HTMLElement = this._popup.querySelector(ClassNames.popupDecline);
    protected _acceptButton: HTMLElement = this._popup.querySelector(ClassNames.popupAccept);
    protected _elHandler: ELHandler;
    protected _externalEventHandler: ELHandler;

    constructor(
        acceptHandler: Function,
        private _externalHTML: string,
        private _externalEventList: IEventListItem[]
    ) {
        super();
        this._elHandler = new ELHandler([
            {
                elements: [this._closeButton, this._declineButton],
                actions: ['click'],
                statuses: [Statuses.init, Statuses.destroy],
                handler: this.hide.bind(this)
            },
            {
                elements: [this._acceptButton],
                actions: ['click'],
                statuses: [Statuses.init, Statuses.destroy],
                handler: evt => { acceptHandler(evt, this._popup); this.hide() }
            }
        ]);
        this._externalEventHandler = new ELHandler(
            this._externalEventList
        );
        this._init();
    }

    show() {
        this._popup.classList.add(Utils.getShortClassName(ClassNames.popupShow));
        this._elHandler.handle('add', Statuses.init);
        this._externalEventHandler.handle('add', Statuses.init);

        return this;
    }
    hide() {
        this._popup.classList.remove(Utils.getShortClassName(ClassNames.popupShow));
        this._elHandler.handle('remove', Statuses.destroy);
        this._externalEventHandler.handle('add', Statuses.destroy);

        return this;
    }
    destroy(): void {
        this.hide();
        this._popupBody.innerHTML = '';
    }

    protected _init(): void {
        this.destroy();
        this._popupBody.innerHTML = this._externalHTML;
    }
}