// @ts-ignore
import * as firebase from 'firebase/app';
import 'firebase/database';
import {Routes} from '../misc/routes';
import {IConfig, ITodoItem} from '../misc/interfaces';

abstract class ACDatabase {
    protected async [Routes.getTodos](): Promise<ITodoItem[]>;
    protected async [Routes.addTodo](todos: string): Promise<void>;
    abstract [Routes.default](): { error: string };
}

// const todos = [
//     { key: 1590990726569, title: 'first', description: 'first description', favourite: true, deleted: false },
//     { key: 1590990726570, title: 'second', description: 'second description', favourite: false, deleted: false  },
//     { key: 1590990726571, title: 'third', description: 'third description', favourite: false, deleted: false  },
// ];

export default class Database extends ACDatabase {
    private readonly _config: IConfig;
    // tslint:disable-next-line:no-any
    private _database: any;

    constructor(private _request: Routes) {
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

    getResponse(): unknown {
        return (
            this[this._request]
                ? this[this._request]
                : this[Routes.default]
        ).call(this);
    }
    setResponse(response: string): void {
        return (
            this[this._request]
                ? this[this._request]
                : this[Routes.default]
        ).call(this, response);
    }

    protected async [Routes.getTodos](): Promise<ITodoItem[]> {
        // TODO сделать разделение на юзеров
        return this._database
            .ref('todos')
            .once('value')
            .then((data: { val: Function }): ITodoItem[] => data.val());
    }
    protected async [Routes.addTodo](todos: string): Promise<void> {
        return firebase.database().ref().update(todos);
    }
    [Routes.default](): { error: string } {
        return {error: 'route didnt found'};
    }
}