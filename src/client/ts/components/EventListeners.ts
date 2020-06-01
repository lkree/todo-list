import Popup from "./Popup";
import {ClassNames} from "../misc/classNames";
import Render from "./Render";
import ClientServer from "../utils/ClientServer";
import {ITodoItem} from "../../../server/misc/interfaces";

abstract class ACEventListeners {
    static onAddButtonClick(evt: Event): void {};
    static onRecordClick(evt: Event): void {};
}

export default class EventListeners extends ACEventListeners {
    static onAddButtonClick(evt: Event): void {
        function addRecordHandler(evt: Event, popup: HTMLElement) {
            const title = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupTitleInput)).value;
            const description = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupDescriptionInput)).value;
            const data = {
                key: Date.now(),
                favourite: false,
                title,
                description
            };

            this.addData([data]);
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
    static onRecordClick<T extends ClientServer>(evt: Event): void {
        const self: T = this;
        function removeRecordHandler(evt: Event, popup: HTMLElement) {
            const key = +popup.querySelector(ClassNames.todoFull).getAttribute('key');
            self.removeRecord(key);

            new Render().removeItem(document.querySelector(ClassNames.todoList), key);
        }

        const key = +(<HTMLElement>evt.target).closest(ClassNames.todoItem).getAttribute('key');
        const record = self.getData(key)[0];

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