export interface IConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}
export interface ITodoItem {
    key: number;
    title: string;
    description: string;
    favourite?: boolean;
}