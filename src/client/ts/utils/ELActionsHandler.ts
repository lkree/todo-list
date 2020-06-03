import {IEventListItem} from '../misc/interface';
import {Statuses} from '../misc/Statuses';
import ClientServer from './ClientServer';

abstract class ACELHandler {
    protected _eventList: IEventListItem[];

    abstract handle(action: 'add' | 'remove', status: string): void;

    protected _handleListeners(type: 'addEventListener' | 'removeEventListener', status: string): void {};
    protected _init(): void {};
}

export default class ELActionsHandler extends ACELHandler {
    constructor(
        protected _eventList: IEventListItem[],
        protected _clientServer: ClientServer
    ) {
        super();
        this._init();
    }

    handle(action: 'add' | 'remove', status: Statuses): void {
        this._handleListeners(
            action === 'add' ? 'addEventListener' : 'removeEventListener',
            status
        );
    }

    protected _handleListeners(type: 'addEventListener' | 'removeEventListener', status: Statuses): void {
        this._eventList
            .filter(e => e.statuses.includes(status))
            .forEach(e => {
                e.actions.forEach(action => {
                    e.elements.forEach(element => {
                        element[type](action, <EventListenerOrEventListenerObject>e.handler);
                    })
                })
            })
    }

    protected _init(): void {
        this._eventList = this._eventList.map(e => {
            return {
                ...e,
                handler: e.handler.bind(null, {
                    ...e.args,
                    clientServer: this._clientServer
                })
            }
        })
    }
}