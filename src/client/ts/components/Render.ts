import {ClassNames} from '../misc/classNames';
import Utils from '../utils/Utils';
import ClientServer from '../utils/ClientServer';
import {ICommonData, IListOfAction, ITodoItem} from '../misc/interface';

abstract class ACRender {
    protected _template: HTMLTemplateElement;

    abstract renderList(data: ICommonData['todos']): void;
    abstract renderItem(wrapper: Element, template: HTMLElement, data: ITodoItem): void;
    abstract removeItem(clientServer: ClientServer, wrapper: Element, key: number): void;
    abstract updateItem(
        { record, todoList, key, target, className }
        : { record: ITodoItem, todoList: HTMLElement, key: number, target: HTMLElement, className: ClassNames }
    ): void;
}

export default class Render extends ACRender {
    protected _template: HTMLTemplateElement = document.querySelector('template');

    renderList(data: ICommonData['todos']): void {
        const listItemTemplate = this._template.content.querySelector(ClassNames.todoItem).cloneNode(true);
        const fragment = document.createDocumentFragment();
        const listWrapper = document.querySelector(ClassNames.todoWrapper);
        const renderItem = this.renderItem.bind(this, fragment, <HTMLElement>listItemTemplate);

        Object.keys(data).forEach(k => renderItem(data[k]));

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

        if (data.deleted)
            element.classList.add(Utils.getShortClassName(ClassNames.todoItemDeleted))

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
    updateItem(
        { record, todoList, key, target, className }
        : { record?: ITodoItem, todoList?: HTMLElement, key?: number, target?: HTMLElement, className?: ClassNames }
    ): void {
        if (todoList)
            this._updateOnTodoList({ record, todoList, key });
        if (target)
            this._updateTarget({ target, className });
    }

    private _updateOnTodoList(
        { record, todoList, key }: { record: ITodoItem, todoList: HTMLElement, key: number }
    ): void {
        const recordElement = todoList.querySelector(`[key="${key}"]`);

        recordElement.querySelector(ClassNames.todoItemHeader).textContent = record.title;
        recordElement
            .querySelector(ClassNames.todoItemFavouriteButton)
            .classList[record.favourite ? 'add' : 'remove']
                (Utils.getShortClassName(ClassNames.todoItemFavouriteButtonFilled));
    }

    private _updateTarget(
        { target, className }: { target: HTMLElement, className: ClassNames }
    ): void {
        target.classList.toggle(Utils.getShortClassName(className));
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