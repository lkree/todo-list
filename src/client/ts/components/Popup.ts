import {ClassNames} from '../misc/classNames';
import Utils from '../utils/Utils';
import ELActionsHandler from '../utils/ELActionsHandler';
import {IEventListItem} from '../misc/interface';
import {Statuses} from '../misc/Statuses';
import ClientServer from '../utils/ClientServer';

interface IAcceptProps {
    handler: Function;
    title: string;
    args: {};
}

abstract class ACPopup {
    protected _popup: HTMLElement;
    protected _popupBody: HTMLElement;
    protected _closeButton: HTMLElement;
    protected _declineButton: HTMLElement;
    protected _acceptButton: HTMLElement;
    protected _elHandler: ELActionsHandler;
    protected _externalEventHandler: ELActionsHandler;
    protected _acceptButtonText: string;
    protected _acceptProps: IAcceptProps;

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
        protected _acceptProps: IAcceptProps,
        private _externalHTML: string,
        private _externalEventList: IEventListItem[],
        private _clientServer: ClientServer
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
                args: {},
                actions: ['click'],
                statuses: [Statuses.init, Statuses.destroy],
                handler: this.hide.bind(this)
            },
            {
                elements: [this._acceptButton],
                actions: ['click'],
                statuses: [Statuses.init, Statuses.destroy],
                args: { ...this._acceptProps.args },
                handler: (args: {}, evt: Event) => {
                    this._acceptProps.handler({
                        popup: this._popup,
                        ...args
                    }, evt);
                    this.hide();
                }
            }
        ], this._clientServer);
        this._externalEventHandler = new ELActionsHandler(
            this._externalEventList, this._clientServer
        );

        if (this._acceptProps.title)
            this._acceptButton.textContent = this._acceptProps.title;

        this._popupBody.innerHTML = this._externalHTML;
    }
}
