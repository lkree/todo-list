// @ts-ignore
import { Server as Backend } from 'miragejs';
import Database from "./components/Database";

export default class Server {
    static init(): void {
        new Backend({
            routes() {
                this.namespace = 'api';

                this.get('/todos', () => {
                    return (
                        [
                            { id: 0, title: 'first title', description: 'first description' },
                            { id: 1, title: 'second title', description: 'second description' }
                        ]
                    )
                });
                this.get('/todos1', () => {
                    return new Database().getSomething();
                });
            },
        })
    }
}