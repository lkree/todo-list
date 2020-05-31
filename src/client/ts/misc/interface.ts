/* ELHandler */
import {Statuses} from "./Statuses";

export interface IEventListItem {
    elements: HTMLElement[];
    handler: EventListenerOrEventListenerObject;
    actions: string[];
    statuses: Statuses[];
}


const a: IEventListItem[] = [
    {
        elements: [document.createElement('div')],
        handler: () => {},
        actions: ['click'],
        statuses: [Statuses.init]
    },
    {
        elements: [document.createElement('div')],
        handler: () => {},
        actions: ['click'],
        statuses: [Statuses.init]
    },
];

a.filter(e => e.statuses.includes(Statuses.destroy));

