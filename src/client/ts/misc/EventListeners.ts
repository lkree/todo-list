import ClientServer from '../utils/ClientServer';
import {ClassNames} from './classNames';
import Render from '../components/Render';
import Utils from '../utils/Utils';
import Popup from '../components/Popup';
import ContextMenu from '../components/ContextMenu';
import {Statuses} from './Statuses';
import {ITodoItem} from './interface';

interface IListenersProps {
    clientServer?: ClientServer;
    target?: HTMLElement;
    popup?: HTMLElement;
    record?: ITodoItem;
    key?: number;
}

export function openFullInfo({ clientServer, record, key }: IListenersProps, _: Event): void {
    const popupHTML = Utils.getTemplateClone(ClassNames.todoFull);

    popupHTML.querySelector(ClassNames.todoFullTitle).textContent = record.title;
    popupHTML.querySelector(ClassNames.todoFullDescription).textContent = record.description;
    popupHTML.querySelector(ClassNames.todoFullFavourite).textContent = record.favourite ? 'Да' : 'Нет';
    popupHTML.setAttribute('key', key.toString());

    new Popup(
        {
            title: 'Ок',
            handler: () => {},
            args: {},
        },
        popupHTML,
        [],
        clientServer
    ).show();
}
export function contextMenuOpen({ clientServer, target, record, key }: IListenersProps, _: Event,): void {
    new ContextMenu(
        <HTMLElement>target.nextElementSibling,
        [
            {
                actions: ['click'],
                listOfActions: {
                    title: 'Открыть',
                    className: '.todo-open-item'
                },
                args: { record, key },
                handler: openFullInfo,
                statuses: [Statuses.init, Statuses.destroy]
            },
            {
                actions: ['click'],
                listOfActions: {
                    title: 'Редактировать',
                    className: '.todo-edit-item'
                },
                args: { record, key },
                handler: editRecord,
                statuses: [Statuses.init, Statuses.destroy]
            },
            (record.deleted && {
                actions: ['click'],
                listOfActions: {
                    title: 'Восстановить',
                    className: '.todo-restore-item'
                },
                args: { key, target, record },
                handler: restoreRecord,
                statuses: [Statuses.init, Statuses.destroy]
            }),
            {
                actions: ['click'],
                listOfActions: {
                    title: 'Удалить',
                    className: '.todo-delete-item'
                },
                args: { key },
                handler: removeRecordHandler,
                statuses: [Statuses.init, Statuses.destroy]
            },
        ].filter(Boolean), clientServer
    ).show();
}
export function editRecord({ clientServer, record, key }: IListenersProps, _: Event): void {
    const popupHTML = Utils.getTemplateClone(ClassNames.todoEdit);
    const favouriteCheckbox: HTMLInputElement = popupHTML.querySelector(ClassNames.todoEditFavourite);

    popupHTML.querySelector(ClassNames.todoEditTitle).textContent = record.title;
    popupHTML.querySelector(ClassNames.todoEditDescription).textContent = record.description;
    favouriteCheckbox.checked = record.favourite;
    popupHTML.setAttribute('key', key.toString());

    new Popup(
        {
            title: 'Редактировать',
            args: { record, key },
            handler: editRecordHandler
        },
        popupHTML,
        [],
        clientServer
    ).show();
}
export function addRecord({ clientServer }: IListenersProps, _: Event): void {
    const popupHTML = Utils.getTemplateClone(ClassNames.todoAddPopupTemplate);

    new Popup(
        {
            title: 'Ок',
            args: {},
            handler: addRecordHandler
        },
        popupHTML,
        [],
        clientServer
    ).show();
}
export function restoreRecord({ clientServer, record, target }: IListenersProps, _: Event): void {
    const updatedRecord = {
        ...record,
        deleted: !record.deleted
    }

    new Render().updateItem({
        target: target.closest(ClassNames.todoItem),
        className: ClassNames.todoItemDeleted
    });
    clientServer.updateRecord(updatedRecord);
}
export function favouriteEdit({ clientServer, record }: IListenersProps, _: Event): void {
    const todoItem: HTMLElement = document
        .querySelector(ClassNames.todoList)
        .querySelector(`[key="${record.key}"]`)
        .querySelector(ClassNames.todoItemFavouriteButton);

    new Render().updateItem({ target: todoItem, className: ClassNames.todoItemFavouriteButtonFilled });

    const newRecord = {
        ...record,
        favourite: !record.favourite
    };

    clientServer.updateRecord(newRecord);
}


export function removeRecordHandler({ clientServer, key }: IListenersProps, _: Event): void {
    clientServer.removeRecord(key);
    new Render().removeItem(clientServer, document.querySelector(ClassNames.todoList), key);
}
export function addRecordHandler({ clientServer, popup }: IListenersProps, _: Event): void {
    const title = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupTitleInput)).value;
    const description = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupDescriptionInput)).value;
    const favourite = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupFavourite)).checked;
    const data = {
        key: Date.now(),
        favourite,
        title,
        description,
        deleted: false
    };

    clientServer.addData(data);
    new Render()
        .renderItem(undefined, undefined, data);
}
export function editRecordHandler({ clientServer, record, key, popup }: IListenersProps, _: Event): void {
    const oldData = <ITodoItem>clientServer.getData(key);

    const newData: ITodoItem = {
        ...oldData,
        title: (<HTMLInputElement>popup.querySelector(ClassNames.todoEditTitle)).value,
        description: (<HTMLInputElement>popup.querySelector(ClassNames.todoEditDescription)).value,
        favourite: (<HTMLInputElement>popup.querySelector(ClassNames.todoEditFavourite)).checked
    }

    clientServer.updateRecord(newData);
    new Render().updateItem({ record: newData, todoList: document.querySelector(ClassNames.todoList), key });
}