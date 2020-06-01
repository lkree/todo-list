import {ITodoItem} from "../../../server/misc/interfaces";
import {ClassNames} from "../misc/classNames";
import Utils from "../utils/Utils";

abstract class ACRender {
    protected _template: HTMLTemplateElement;

    abstract renderList(data: ITodoItem[]): void;
    abstract renderItem(wrapper: Element, template: HTMLElement, data: ITodoItem): void;
    abstract removeItem(wrapper: Element, key: number): void;
}

export default class Render extends ACRender {
    protected _template: HTMLTemplateElement = document.querySelector('template');

    renderList(data: ITodoItem[]): void {
        const listItemTemplate = this._template.content.querySelector(ClassNames.todoItem).cloneNode(true);
        const fragment = document.createDocumentFragment();
        const listWrapper = document.querySelector(ClassNames.todoWrapper);
        const renderItem = this.renderItem.bind(this, fragment, <HTMLElement>listItemTemplate);

        data.forEach(renderItem);

        listWrapper.append(fragment);
    }
    renderItem(
        wrapper = document.querySelector(ClassNames.todoWrapper),
        template = this._template.content.querySelector(ClassNames.todoItem).cloneNode(true),
        data: ITodoItem,
    ): void {
        const element = template.cloneNode(true);

        (<HTMLElement>element).querySelector(ClassNames.todoItemHeader).textContent = data.title;
        (<HTMLElement>element).setAttribute('key', data.key.toString());

        if (data.favourite)
            (<HTMLElement>element)
                .querySelector(ClassNames.todoItemFavouriteButton)
                .classList
                .add(Utils.getShortClassName(ClassNames.todoItemFavouriteButtonFilled));

        wrapper.append(element);
    }
    removeItem(wrapper: Element, key: number) {
        const removeRecord = wrapper.querySelector(`[key="${key}"]`);

        if (removeRecord)
            wrapper.removeChild(removeRecord);
    }
}