import Popup from "./Popup";
import {ClassNames} from "../misc/classNames";
import Render from "./Render";

abstract class ACEventListeners {
    static onAddButtonClick(_updateData: Function): void {};
}

export default class EventListeners extends ACEventListeners {
    static onAddButtonClick(_updateData: Function): void {
        function addRecordHandler(evt: Event, popup: HTMLElement) {
            const title = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupTitleInput)).value;
            const description = (<HTMLInputElement>popup.querySelector(ClassNames.todoAddPopupDescriptionInput)).value;
            const data = {
                favourite: false,
                title,
                description
            };

            _updateData([data]);
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
}