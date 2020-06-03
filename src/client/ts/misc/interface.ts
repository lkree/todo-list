/* ELHandler */
import {Statuses} from './Statuses';

export interface IEventListItem {
    elements: HTMLElement[];
    handler: Function;
    args: {};
    actions: string[];
    statuses: Statuses[];
}

/* ContextMenu */
export interface IListOfAction {
    title: string;
    className: string;
}