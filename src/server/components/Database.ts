// @ts-ignore
import * as firebase from 'firebase/app';
import 'firebase/database';
import {Routes} from '../misc/routes';
import {IConfig} from '../misc/interfaces';
import {ICommonData, ITodoItem} from '../../client/ts/misc/interface';
import Serializer from '../../client/ts/utils/Serializer';

interface IPostProps {
    key?: number;
    record?: ITodoItem;
}

abstract class ACDatabase {
    protected async [Routes.getTodos](): Promise<ICommonData>;
    protected async [Routes.addTodo](todos: string): Promise<void>;
    protected async [Routes.updateTodo](postProps: string): Promise<void>;
    protected async [Routes.deleteTodo](postProps: string): Promise<void>;
    abstract [Routes.default](): string;
}

// const todos = [
//     { key: 1590990726569, title: 'first', description: 'first description', favourite: true, deleted: false },
//     { key: 1590990726570, title: 'second', description: 'second description', favourite: false, deleted: false  },
//     { key: 1590990726571, title: 'third', description: 'third description', favourite: false, deleted: false  },
// ];

export default class Database extends ACDatabase {
    private readonly _config: IConfig;
    private _database: firebase.database.Database;

    constructor() {
        super();
        this._config = {
            apiKey: 'AIzaSyBiac6pxapIUjw6FOtnIHzsXshu5xbVNoE',
            authDomain: 'test-todo-list-5d472.firebaseapp.com',
            databaseURL: 'https://test-todo-list-5d472.firebaseio.com',
            projectId: 'test-todo-list-5d472',
            storageBucket: 'test-todo-list-5d472.appspot.com',
            messagingSenderId: '862145425796',
            appId: '1:862145425796:web:52109959020c5cf56aadd1'
        };
        firebase.initializeApp(this._config);
        this._database = firebase.database();
    }

    getResponse(request: Routes): unknown {
        return (
            this[request]
                ? this[request]
                : this[Routes.default]
        ).call(this);
    }
    setResponse(request: Routes, response: string): void {
        return (
            this[request]
                ? this[request]
                : this[Routes.default]
        ).call(this, response);
    }

    protected async [Routes.getTodos](): Promise<ICommonData> {
        // TODO сделать разделение на юзеров
        return this._database
                .ref('/')
                .once('value')
                .then((data: { val: Function }): ICommonData => Serializer.unserialize(data.val()));
    }
    protected async [Routes.addTodo](todos: string): Promise<void> {
        return firebase.database().ref('/todos/').set(JSON.parse(todos));
    }
    protected async [Routes.updateTodo](postProps: string): Promise<void> {
        // TODO сделать нормальную генерацию путей для записи / обновления в базе
        const { record, key }: IPostProps = JSON.parse(postProps);

        return firebase.database().ref(`/todos/${key}`).update(record);
    }
    protected async [Routes.deleteTodo](postProps: string): Promise<void> {
        // TODO сделать нормальную генерацию путей для записи / обновления в базе
        // TODO сделать единообразный способ обмена данными с абстракцией базы
        const { key }: IPostProps = JSON.parse(postProps);

        return firebase.database().ref(`/todos/${key}`).remove();
    }
    [Routes.default](): string {
        return Serializer.serialize(<ICommonData>{ error: 'route didnt found' });
    }
}