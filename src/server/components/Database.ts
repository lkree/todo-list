// @ts-ignore
// import * as firebase from "firebase/app";
// @ts-ignore
// import "firebase/firestore";
import {Routes} from "../misc/routes";
import {IConfig, ITodoItem} from "../misc/interfaces";

abstract class ACDatabase {
    abstract [Routes.todos](): Promise<ITodoItem[]>;
    abstract [Routes.default](): Promise<{error: string}>;
}

const todos = [
    { key: 1590990726569, title: 'first', description: 'first description', favourite: true, deleted: false },
    { key: 1590990726570, title: 'second', description: 'second description', favourite: false, deleted: false  },
    { key: 1590990726571, title: 'third', description: 'third description', favourite: false, deleted: false  },
];

export default class Database extends ACDatabase {
    private readonly _config: IConfig;
    private _firebase: any;

    constructor(private _request: Routes) {
        super();
        // this._config = {
        //     apiKey: "AIzaSyBiac6pxapIUjw6FOtnIHzsXshu5xbVNoE",
        //     authDomain: "test-todo-list-5d472.firebaseapp.com",
        //     databaseURL: "https://test-todo-list-5d472.firebaseio.com",
        //     projectId: "test-todo-list-5d472",
        //     storageBucket: "test-todo-list-5d472.appspot.com",
        //     messagingSenderId: "862145425796",
        //     appId: "1:862145425796:web:52109959020c5cf56aadd1"
        // };
        // firebase.initializeApp(this._config);
        // firebase.firestore().settings({ experimentalForceLongPolling: true });
        // this._firebase = firebase.firestore();
        // firebase.firestore.setLogLevel('debug');
    }

    getResponse() {
        return (
            this[this._request]
                ? this[this._request]
                : this[Routes.default]
        ).call(this);
    }

    async [Routes.todos]() {
        // this._firebase.collection("users").add({
        //     first: "Ada",
        //     last: "Lovelace",
        //     born: 1815
        // })
        //     .then(function(docRef: any) {
        //         console.log("Document written with ID: ", docRef.id);
        //     })
        //     .catch(function(error: any) {
        //         console.error("Error adding document: ", error);
        //     });
        // this._firebase.collection('users').get({})
        //     .then((data: any) => console.log(data));
        // return;
        return todos;
    }
    async [Routes.default]() {
        return {error: 'route didnt found'};
    }
}