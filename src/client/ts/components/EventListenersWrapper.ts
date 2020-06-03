import {ClassNames} from '../misc/classNames';
import ClientServer from '../utils/ClientServer';
import Utils from '../utils/Utils';
import {ITodoItem} from '../../../server/misc/interfaces';
import {addRecord, contextMenuOpen, openFullInfo} from '../misc/EventListeners';

abstract class ACEventListeners {
    static onAddButtonClick({ clientServer }: { clientServer: ClientServer }, evt: Event): void {};
    static onRecordClick({ clientServer }: { clientServer: ClientServer }, evt: Event): void {};
}

export default class EventListenersWrapper extends ACEventListeners {
    static onAddButtonClick({ clientServer }: { clientServer: ClientServer }, evt: Event): void {
        addRecord({ clientServer }, {} as Event);
    }
    static onRecordClick({ clientServer }: { clientServer: ClientServer }, evt: Event): void {
        evt.stopPropagation();

        const target = Utils.getEventTarget(evt);
        const key = +target.closest(ClassNames.todoItem).getAttribute('key');
        const record = <ITodoItem>clientServer.getData(key);

        if (target.matches(ClassNames.todoItemFavouriteButton)) {
            target.classList.toggle(Utils.getShortClassName(ClassNames.todoItemFavouriteButtonFilled));
        } else if (target.matches(ClassNames.todoItemOptionsOpenButton)) {
            contextMenuOpen({ clientServer, target, record, key }, {} as Event);
        } else {
            openFullInfo({ clientServer, record, key }, {} as Event);
        }
    };
}