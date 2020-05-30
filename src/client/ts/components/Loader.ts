import {ACLoader} from "../misc/interface";

export default class Loader extends ACLoader {
    static _spinner: HTMLElement = document.querySelector('.spinner');
    static _hideClass = '.spinner--hide';

    static show(): void {
        this._spinner.classList.remove(this._hideClass.split('.')[1]);
    }
    static hide(): void {
        this._spinner.classList.add(this._hideClass.split('.')[1]);
    }
}