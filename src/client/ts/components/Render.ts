import {ITodoItem} from '../../../server/misc/interfaces';
import {ClassNames} from '../misc/classNames';
import Utils from '../utils/Utils';
import ClientServer from '../utils/ClientServer';
import {IListOfAction} from '../misc/interface';

abstract class ACRender {
    protected _template: HTMLTemplateElement;

    abstract renderList(clientServer: ClientServer): void;
    abstract renderItem(wrapper: Element, template: HTMLElement, data: ITodoItem): void;
    abstract removeItem(clientServer: ClientServer, wrapper: Element, key: number): void;
    abstract updateItem(record: ITodoItem, wrapper: HTMLElement, key: number): void;
}

export default class Render extends ACRender {
    protected _template: HTMLTemplateElement = document.querySelector('template');

    renderList(clientServer: ClientServer): void {
        const data = <ITodoItem[]>clientServer.getData();
        const listItemTemplate = this._template.content.querySelector(ClassNames.todoItem).cloneNode(true);
        const fragment = document.createDocumentFragment();
        const listWrapper = document.querySelector(ClassNames.todoWrapper);
        const renderItem = this.renderItem.bind(this, fragment, <HTMLElement>listItemTemplate);

        data.forEach(renderItem);

        listWrapper.append(fragment);
    }
    renderItem(
        wrapper: HTMLElement = document.querySelector(ClassNames.todoWrapper),
        template: Node = this._template.content.querySelector(ClassNames.todoItem).cloneNode(true),
        data: ITodoItem
    ): void {
        const element = <HTMLElement>template.cloneNode(true);

        element.querySelector(ClassNames.todoItemHeader).textContent = data.title;
        element.setAttribute('key', data.key.toString());

        if (data.favourite)
            element
                .querySelector(ClassNames.todoItemFavouriteButton)
                .classList
                .add(Utils.getShortClassName(ClassNames.todoItemFavouriteButtonFilled));

        wrapper.append(element);
    }
    removeItem(clientServer: ClientServer, wrapper: Element, key: number): void {
        const removeRecordNode = wrapper.querySelector(`[key="${key}"]`);
        const removeRecord = <ITodoItem>clientServer.getData(key);

        if (!removeRecord)
            wrapper.removeChild(removeRecordNode);
        else
            removeRecordNode.classList.add(Utils.getShortClassName(ClassNames.todoItemDeleted));
    }
    updateItem(record: ITodoItem, wrapper: HTMLElement, key: number): void {
        const recordElement = wrapper.querySelector(`[key="${key}"]`);

        recordElement.querySelector(ClassNames.todoItemHeader).textContent = record.title;
    }

    static renderContextMenu(items: IListOfAction[], wrapper: HTMLElement): void {
        const listItemTemplate = Utils.getTemplateClone(ClassNames.contextMenuItem);
        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const element = <HTMLElement>listItemTemplate.cloneNode(true);

            element.textContent = item.title;
            element.classList.add(Utils.getShortClassName(item.className));

            fragment.append(element);
        });

        wrapper.append(fragment);
    }
}