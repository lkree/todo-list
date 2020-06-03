import {Routes} from '../../../server/misc/routes';
import Render from '../components/Render';
import {ITodoItem} from '../../../server/misc/interfaces';

abstract class ACClientServer {
    protected _data: ITodoItem[];

    abstract renderList(): void;
    abstract getData(key?: number): ITodoItem[] | ITodoItem;
    abstract addData(items: ITodoItem[]): void;
    abstract updateRecord(record: ITodoItem): void;
    abstract removeRecord(key: number): void;
}

export default class ClientServer extends ACClientServer {
    protected _data: ITodoItem[];

    async renderList(): Promise<void> {
        this._data = await fetch(`/api/${Routes.getTodos}`).then(data => data.json());

        new Render().renderList(this);
    }

    getData(key?: number): ITodoItem | ITodoItem[] {
        return key
            ? this._data.find(r => r.key === key)
            : this._data;
    }
    addData(items: ITodoItem[]): void {
        this._data = [...this._data, ...items];

        fetch(`/api/${Routes.addTodo}`, {
            method: 'POST',
            body: JSON.stringify(this._data)
        });
    }
    updateRecord(record: ITodoItem): void {
        this._data = this._data.map(r => {
            if (r.key === record.key) {
                return record;
            }

            return r;
        })
    }
    removeRecord(key: number): void {
        const record = this._data.find(r => r.key === key);
        const recordIndex = this._data.indexOf(record);

        if (record.deleted)
            this._data.splice(recordIndex, 1);
        else
            this._data[recordIndex].deleted = true;
    }
}