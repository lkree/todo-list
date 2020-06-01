import {Routes} from "../../../server/misc/routes";
import Render from "../components/Render";
import {ITodoItem} from "../../../server/misc/interfaces";

abstract class ACClientServer {
    protected _data: ITodoItem[];

    abstract renderList(): void;
    abstract getData(): ITodoItem[] | ITodoItem;
    abstract addData(items: ITodoItem[]): void;
}

export default class ClientServer extends ACClientServer {
    protected _data: ITodoItem[];

    async renderList(): Promise<void> {
        this._data = await fetch(`/api/${Routes.todos}`).then(data => data.json());;

        new Render().renderList(this);
    }

    getData(key?: number): ITodoItem[] {
        return key
            ? [this._data.find(r => r.key === key)]
            : this._data;
    }
    addData(items: ITodoItem[]): void {
        this._data = [...this._data, ...items];
    }
    removeRecord(key: number): void {
        const record = this._data.find(r => r.key === key);
        const recordIndex = this._data.indexOf(record);

        if (record.deleted) {
            this._data.splice(recordIndex, 1);
        } else {
            record.deleted = true;
            this._data.splice(recordIndex, 1, record);
        }
    }
}