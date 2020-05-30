// @ts-ignore
import * as firebase from "firebase/app";
// @ts-ignore
import "firebase/firestore";

interface IConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}

export default class Database {
    private readonly _config: IConfig;
    private _firebase: any;

    constructor() {
        this._config = {
            apiKey: "AIzaSyBiac6pxapIUjw6FOtnIHzsXshu5xbVNoE",
            authDomain: "test-todo-list-5d472.firebaseapp.com",
            databaseURL: "https://test-todo-list-5d472.firebaseio.com",
            projectId: "test-todo-list-5d472",
            storageBucket: "test-todo-list-5d472.appspot.com",
            messagingSenderId: "862145425796",
            appId: "1:862145425796:web:52109959020c5cf56aadd1"
        };
        firebase.initializeApp(this._config);
        this._firebase = firebase.firestore();
    }

    async getSomething() {
        await this._firebase.collection("users").get()
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef);
        }).catch(e => console.log(e, 123));
        return;
    }
}