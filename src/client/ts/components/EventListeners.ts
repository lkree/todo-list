import Popup from "./Popup";
import {ClassNames} from "../misc/classNames";
import Render from "./Render";
import ClientServer from "../utils/ClientServer";
import Utils from "../utils/Utils";
import {ITodoItem} from "../../../server/misc/interfaces";

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
                description,
                deleted: false,
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
        const target = Utils.getEventTarget(evt);
        const key = +target.closest(ClassNames.todoItem).getAttribute('key');
        const record = <ITodoItem>clientServer.getData(key);

        if (target.matches(ClassNames.todoItemFavouriteButton)) {
            target.classList.toggle(Utils.getShortClassName(ClassNames.todoItemFavouriteButtonFilled));
        } else if (target.matches(ClassNames.todoItemOptionsOpenButton)) {

        } else {
            function removeRecordHandler() {
                clientServer.removeRecord(key);
                new Render().removeItem(clientServer, document.querySelector(ClassNames.todoList), key);
            }

            const popupHTML = Utils.getTemplateClone(ClassNames.todoFull);

            popupHTML.querySelector(ClassNames.todoFullTitle).textContent = record.title;
            popupHTML.querySelector(ClassNames.todoFullDescription).textContent = record.description;
            popupHTML.setAttribute('key', key.toString());

            new Popup(
                removeRecordHandler,
                popupHTML.outerHTML,
                [],
                'Удалить'
            ).show();
        }
    };
}