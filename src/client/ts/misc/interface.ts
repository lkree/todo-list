export interface ICommonData {
    user: string;
    todos: {
        [key: string]: ITodoItem
    };
    error: string;
}
export interface ITodoItem {
    key: number;
    title: string;
    description: string;
    favourite: boolean;
    deleted: boolean;
}

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