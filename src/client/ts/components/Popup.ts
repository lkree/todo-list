import {ClassNames} from '../misc/classNames';
import Utils from '../utils/Utils';
import ELActionsHandler from '../utils/ELActionsHandler';
import {IEventListItem} from '../misc/interface';
import {Statuses} from '../misc/Statuses';

abstract class ACPopup {
    protected _popup: HTMLElement;
    protected _popupBody: HTMLElement;
    protected _closeButton: HTMLElement;
    protected _declineButton: HTMLElement;
    protected _acceptButton: HTMLElement;
    protected _elHandler: ELActionsHandler;
    protected _externalEventHandler: ELActionsHandler;
    protected _acceptButtonText: string;
    protected _acceptHandler: Function;

    protected _init(): void {};
    abstract show(): Popup;
    abstract hide(): Popup;
    abstract destroy(): void;
}

export default class Popup extends ACPopup {
    protected _popup: HTMLElement = document.querySelector(ClassNames.popup);
    protected _popupBody: HTMLElement = this._popup.querySelector(ClassNames.popupBody);
    protected _closeButton: HTMLElement = this._popup.querySelector(ClassNames.popupClose);
    protected _declineButton: HTMLElement = this._popup.querySelector(ClassNames.popupDecline);
    protected _acceptButton: HTMLElement = this._popup.querySelector(ClassNames.popupAccept);
    protected _elHandler: ELActionsHandler;
    protected _externalEventHandler: ELActionsHandler;


    constructor(
        protected _acceptHandler: Function,
        private _externalHTML: string,
        private _externalEventList: IEventListItem[],
        protected _acceptButtonText: string = 'Ок'
    ) {
        super();
        this._init();
    }

    show(): Popup {
        this._popup.classList.add(Utils.getShortClassName(ClassNames.popupShow));
        this._elHandler.handle('add', Statuses.init);
        this._externalEventHandler.handle('add', Statuses.init);

        return this;
    }
    hide(): Popup {
        this._popup.classList.remove(Utils.getShortClassName(ClassNames.popupShow));
        this._elHandler.handle('remove', Statuses.destroy);
        this._externalEventHandler.handle('remove', Statuses.destroy);

        return this;
    }
    destroy(): void {
        this._popupBody.innerHTML = '';
    }

    protected _init(): void {
        this.destroy();

        this._elHandler = new ELActionsHandler([
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
                handler: evt => { this._acceptHandler(evt, this._popup); this.hide() }
            }
        ]);
        this._externalEventHandler = new ELActionsHandler(
            this._externalEventList
        );
        this._acceptButton.textContent = this._acceptButtonText;

        this._popupBody.innerHTML = this._externalHTML;
    }
}
