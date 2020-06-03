import ELActionsHandler from '../utils/ELActionsHandler';
import {IEventListItem, IListOfAction} from '../misc/interface';
import {Statuses} from '../misc/Statuses';
import Render from './Render';
import Utils from '../utils/Utils';
import {ClassNames} from '../misc/classNames';
import ClientServer from '../utils/ClientServer';

abstract class ACContextMenu {
    protected _contextMenu: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _contextMenuBody: HTMLElement;
    protected _elHandler: ELActionsHandler;
    protected _externalEventHandler: ELActionsHandler;
    protected _externalEventList: IEventListItem[];
    protected _alreadyOpened: boolean;

    protected _init(): void {};
    abstract show(): ContextMenu;
    abstract hide(): ContextMenu;
}

interface IExternalEventListItem {
    listOfActions: IListOfAction;
    args: {};
    handler: Function;
    actions: string[];
    statuses: Statuses[];
}


export default class ContextMenu extends ACContextMenu {
    protected _contextMenu: HTMLElement;
    protected _contextMenuBody: HTMLElement;
    protected _elHandler: ELActionsHandler;
    protected _externalEventHandler: ELActionsHandler;
    protected _externalEventList: IEventListItem[];
    protected _alreadyOpened: boolean;

    constructor(
        protected _wrapper: HTMLElement,
        private _contextMenuPropsList: IExternalEventListItem[],
        private _clientServer: ClientServer
    ) {
        super();
        this._init();
    }

    show(): ContextMenu {
        if (this._alreadyOpened) {
            this.hide();
            return this;
        }

        this._wrapper.classList.add(Utils.getShortClassName(ClassNames.contextMenuShow));
        this._elHandler.handle('add', Statuses.init);
        this._externalEventHandler.handle('add', Statuses.init);

        return this;
    }
    hide(): ContextMenu {
        this._wrapper.classList.remove(Utils.getShortClassName(ClassNames.contextMenuShow));
        this._elHandler.handle('remove', Statuses.destroy);
        this._externalEventHandler.handle('remove', Statuses.destroy);

        return this;
    }

    private _transformList(element: IExternalEventListItem): IEventListItem {
        return {
            ...element,
            elements: [this._wrapper.querySelector(element.listOfActions.className)],
            handler: (args: {}, evt: Event) => { evt.stopPropagation(); element.handler(args, evt); this.hide() }
        }
    }
    private _checkForAlreadyOpened(): void {
        this._alreadyOpened = this._wrapper.classList.contains(Utils.getShortClassName(ClassNames.contextMenuShow));
    }

    protected _init(): void {
        this.destroy();

        this._checkForAlreadyOpened();

        Render.renderContextMenu(this._contextMenuPropsList.map(e => e.listOfActions), this._wrapper);
        this._externalEventList = this._contextMenuPropsList.map(this._transformList.bind(this));

        this._elHandler = new ELActionsHandler([
            {
                elements: [document.body],
                actions: ['click'],
                args: {},
                statuses: [Statuses.init, Statuses.destroy],
                handler: this.hide.bind(this)
            }
        ], this._clientServer);
        this._externalEventHandler = new ELActionsHandler(
            this._externalEventList, this._clientServer
        );
    };

    destroy(): void {
        this._wrapper.innerHTML = '';
    }
}
