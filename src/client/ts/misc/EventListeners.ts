import ClientServer from '../utils/ClientServer';
import {ITodoItem} from '../../../server/misc/interfaces';
import {ClassNames} from './classNames';
import Render from '../components/Render';
import Utils from '../utils/Utils';
import Popup from '../components/Popup';
import ContextMenu from '../components/ContextMenu';
import {Statuses} from './Statuses';

export function editRecordHandler(
    clientServer: ClientServer,
    record: ITodoItem,
    key: number,
    _: Event,
    popup: HTMLElement
): void {
    const oldData = <ITodoItem>clientServer.getData(key);

    const newData: ITodoItem = {
        ...oldData,
        title: (<HTMLInputElement>popup.querySelector(ClassNames.todoEditTitle)).value,
        description: (<HTMLInputElement>popup.querySelector(ClassNames.todoEditDescription)).value,
    }

    clientServer.updateRecord(newData);
    new Render().updateItem(newData, document.querySelector(ClassNames.todoList), key);
}
export function removeRecordHandler(clientServer: ClientServer, key: number): void {
    clientServer.removeRecord(key);
    new Render().removeItem(clientServer, document.querySelector(ClassNames.todoList), key);
}
export function openFullInfo(clientServer: ClientServer, record: ITodoItem, key: number): void {
    const popupHTML = Utils.getTemplateClone(ClassNames.todoFull);

    popupHTML.querySelector(ClassNames.todoFullTitle).textContent = record.title;
    popupHTML.querySelector(ClassNames.todoFullDescription).textContent = record.description;
    popupHTML.setAttribute('key', key.toString());

    new Popup(
        removeRecordHandler.bind(null, clientServer, key),
        popupHTML.outerHTML,
        [],
        'Удалить'
    ).show();
}
export function contextMenuOpen(clientServer: ClientServer, target: HTMLElement, record: ITodoItem, key: number): void {
    new ContextMenu(
        <HTMLElement>target.nextElementSibling,
        [
            {
                actions: ['click'],
                listOfActions: {
                    title: 'Открыть',
                    className: '.todo-open-item'
                },
                handler: openFullInfo.bind(null, clientServer, record, key),
                statuses: [Statuses.init, Statuses.destroy]
            },
            {
                actions: ['click'],
                listOfActions: {
                    title: 'Редактировать',
                    className: '.todo-edit-item'
                },
                handler: editRecord.bind(null, clientServer, record, key),
                statuses: [Statuses.init, Statuses.destroy]
            },
            {
                actions: ['click'],
                listOfActions: {
                    title: 'Удалить',
                    className: '.todo-delete-item'
                },
                handler: removeRecordHandler.bind(null, clientServer, key),
                statuses: [Statuses.init, Statuses.destroy]
            },
        ]
    ).show();
}
export function editRecord(clientServer: ClientServer, record: ITodoItem, key: number): void {
    const popupHTML = Utils.getTemplateClone(ClassNames.todoEdit);

    popupHTML.querySelector(ClassNames.todoEditTitle).textContent = record.title;
    popupHTML.querySelector(ClassNames.todoEditDescription).textContent = record.description;
    popupHTML.setAttribute('key', key.toString());

    new Popup(
        editRecordHandler.bind(null, clientServer, record, key),
        popupHTML.outerHTML,
        [],
        'Редактировать'
    ).show();
}
export function addRecordHandler(clientServer: ClientServer, evt: Event, popup: HTMLElement): void {
    const title = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupTitleInput)).value;
    const description = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupDescriptionInput)).value;
    const data = {
        key: Date.now(),
        favourite: false,
        title,
        description,
        deleted: false
    };

    clientServer.addData([data]);
    new Render()
        .renderItem(undefined, undefined, data)
}
export function addRecord(clientServer: ClientServer): void {
    const popupHTML = Utils.getTemplateClone(ClassNames.todoAddPopupTemplate).innerHTML;

    new Popup(
        addRecordHandler.bind(null, clientServer),
        popupHTML,
        []
    ).show();
}