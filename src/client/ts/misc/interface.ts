/* ELHandler */
import {Statuses} from "./Statuses";

export interface IEventListItem {
    elements: HTMLElement[];
    handler: EventListenerOrEventListenerObject;
    actions: string[];
    statuses: Statuses[];
}

