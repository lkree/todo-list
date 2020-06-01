import Popup from "./Popup";
import {ClassNames} from "../misc/classNames";
import Render from "./Render";
import ClientServer from "../utils/ClientServer";

abstract class ACEventListeners {
    static onAddButtonClick(clientServer: ClientServer, evt: Event): void {};
    static onRecordClick(clientServer: ClientServer, evt: Event): void {};
}

export default class EventListeners extends ACEventListeners {
    static onAddButtonClick(clientServer: ClientServer, evt: Event): void {
        function addRecordHandler(evt: Event, popup: HTMLElement) {
            const title = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupTitleInput)).value;
            const description = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupDescriptionInput)).value;
            const data = {
                key: Date.now(),
                favourite: false,
                title,
                description
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
        function removeRecordHandler(evt: Event, popup: HTMLElement) {
            const key = +popup.querySelector(ClassNames.todoFull).getAttribute('key');
            clientServer.removeRecord(key);

            new Render().removeItem(document.querySelector(ClassNames.todoList), key);
        }

        const key = +(<HTMLElement>evt.target).closest(ClassNames.todoItem).getAttribute('key');
        const record = clientServer.getData(key)[0];

        const popupHTML = document
            .querySelector('template')
            .content
            .querySelector(ClassNames.todoFull)
            .cloneNode(true);

        (<HTMLElement>popupHTML).querySelector(ClassNames.todoFullTitle).textContent = record.title;
        (<HTMLElement>popupHTML).querySelector(ClassNames.todoFullDescription).textContent = record.description;
        (<HTMLElement>popupHTML).setAttribute('key', key.toString());

        new Popup(
            removeRecordHandler,
            (<HTMLElement>popupHTML).outerHTML,
            [],
            'Удалить'
        ).show();
    };
}