import {Routes} from '../../../server/misc/routes';
import Render from '../components/Render';
import {ICommonData, ITodoItem} from '../misc/interface';

abstract class ACClientServer {
    protected _data: ICommonData;

    abstract renderList(): void;
    abstract getData(key?: number): ITodoItem | ICommonData['todos'];
    abstract addData(item: ITodoItem): void;
    abstract updateRecord(record: ITodoItem): void;
    abstract removeRecord(key: number): void;
}

export default class ClientServer extends ACClientServer {
    protected _data: ICommonData;

    async renderList(): Promise<void> {
        this._data = await fetch(`/api/${Routes.getTodos}`).then(data => data.json());

        new Render().renderList(this._data.todos);
    }

    getData(key?: number): ITodoItem | ICommonData['todos'] {
        return key
            ? this._data.todos[key]
            : this._data.todos;
    }
    addData(item: ITodoItem): void {
        this._data = {
            ...this._data,
            todos: { ...this._data.todos , [item.key]: item },
        };

        fetch(`/api/${Routes.addTodo}`, {
            method: 'POST',
            body: JSON.stringify(this._data.todos)
        });
    }
    updateRecord(record: ITodoItem): void {
        this._data.todos[record.key] = record;

        fetch(`/api/${Routes.updateTodo}`, {
            method: 'POST',
            body: JSON.stringify({ key: record.key, record })
        });
    }
    removeRecord(key: number): void {
        const record = this._data.todos[key];

        if (record.deleted)
            delete this._data.todos[key];
        else
            this._data.todos[key].deleted = true;

        fetch(`/api/${this._data.todos[key] ? Routes.updateTodo : Routes.deleteTodo}`, {
            method: 'POST',
            body: JSON.stringify({ key, record })
        });
    }
}