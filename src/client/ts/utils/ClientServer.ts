import {Routes} from "../../../server/misc/routes";
import Render from "../components/Render";
import {ITodoItem} from "../../../server/misc/interfaces";

abstract class ACClientServer {
    protected _data: ITodoItem[];

    abstract renderList(): void;
    abstract getData(): ITodoItem[];
    abstract addData(items: ITodoItem[]): void;
}

export default class ClientServer extends ACClientServer {
    protected _data: ITodoItem[];

    async renderList(): Promise<void> {
        const data: ITodoItem[] = await fetch(`/api/${Routes.todos}`).then(data => data.json());
        this._data = data;

        new Render().renderList(data);
    }

    getData(): ITodoItem[] {
        return this._data;
    }
    addData(items: ITodoItem[]): void {
        this._data = [...this._data, ...items];
        console.log(this._data);
    }
}