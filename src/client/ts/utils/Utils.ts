export default class Utils {
    static getShortClassName(className: string): string {
        return className.split('.')[1];
    }
}
