export default class Utils {
    static getShortClassName(className: string): string {
        return className.split('.')[1];
    }
    static getTemplateClone(className: string, deep: boolean = true): HTMLElement {
        return <HTMLElement>document
            .querySelector('template')
            .content
            .querySelector(className)
            .cloneNode(deep)
    }
    static getEventTarget(evt: Event): HTMLElement {
        return <HTMLElement>evt.target;
    }
    static getEventCurrentTarget(evt: Event): HTMLElement {
        return <HTMLElement>evt.currentTarget;
    }
}
