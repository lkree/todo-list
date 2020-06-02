import {IEventListItem} from '../misc/interface';
import {Statuses} from '../misc/Statuses';

abstract class ACELHandler {
    protected _eventList: IEventListItem[];

    abstract handle(action: 'add' | 'remove', status: string): void;

    protected _handleListeners(type: 'addEventListener' | 'removeEventListener', status: string): void {};
}

export default class ELActionsHandler extends ACELHandler {
    constructor(protected _eventList: IEventListItem[]) {
        super();
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
                        element[type](action, e.handler);
                    })
                })
            })
    }
}