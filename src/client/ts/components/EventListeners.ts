import Popup from './Popup';
import {ClassNames} from '../misc/classNames';
import Render from './Render';
import ClientServer from '../utils/ClientServer';
import Utils from '../utils/Utils';
import {ITodoItem} from '../../../server/misc/interfaces';
import ContextMenu from './ContextMenu';
import {Statuses} from '../misc/Statuses';

abstract class ACEventListeners {
    static onAddButtonClick(clientServer: ClientServer, evt: Event): void {};
    static onRecordClick(clientServer: ClientServer, evt: Event): void {};
}

function editRecordHandler(
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
function removeRecordHandler(clientServer: ClientServer, key: number): void {
    clientServer.removeRecord(key);
    new Render().removeItem(clientServer, document.querySelector(ClassNames.todoList), key);
}
function openFullInfo(clientServer: ClientServer, record: ITodoItem, key: number): void {
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
function contextMenuOpen(clientServer: ClientServer, target: HTMLElement, record: ITodoItem, key: number): void {
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
function editRecord(clientServer: ClientServer, record: ITodoItem, key: number): void {
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

export default class EventListeners extends ACEventListeners {
    static onAddButtonClick(clientServer: ClientServer, evt: Event): void {
        function addRecordHandler(evt: Event, popup: HTMLElement): void {
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

        const popupHTML = document
            .querySelector('template')
            .content
            .querySelector(ClassNames.todoAddPopupTemplate)
            .innerHTML;

        new Popup(
            addRecordHandler,
            popupHTML,
            []
        ).show();
    }
    static onRecordClick(clientServer: ClientServer, evt: Event): void {
        evt.stopPropagation();

        const target = Utils.getEventTarget(evt);
        const key = +target.closest(ClassNames.todoItem).getAttribute('key');
        const record = <ITodoItem>clientServer.getData(key);

        if (target.matches(ClassNames.todoItemFavouriteButton)) {
            target.classList.toggle(Utils.getShortClassName(ClassNames.todoItemFavouriteButtonFilled));
        } else if (target.matches(ClassNames.todoItemOptionsOpenButton)) {
            contextMenuOpen(clientServer, target, record, key);
        } else {
            openFullInfo(clientServer, record, key);
        }
    };
}