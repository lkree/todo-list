// @ts-ignore
import {Request, Server as Backend} from 'miragejs';
import Database from "./components/Database";
import {Routes} from "./misc/routes";
// @ts-ignore
import Schema from "miragejs/orm/schema";

export default class Server {
    static init(): void {
        new Backend({
            routes() {
                this.namespace = 'api';

                this.get('/:route', (_: Schema<unknown>, FakeRequest: Request) => {
                    const request: Routes = FakeRequest.params.route;

                    return new Database(request).getResponse();
                });
            },
        })
    }
}