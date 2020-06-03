// @ts-ignore
import {Request, Server as Backend} from 'miragejs';
import Database from './components/Database';
import {Routes} from './misc/routes';
// @ts-ignore
import Schema from 'miragejs/orm/schema';

export default class Server {
    static init(): void {
        // tslint:disable-next-line:no-unused-expression
        new Backend({
            routes(): void {
                this.namespace = 'api';

                this.get('/:route', (_: Schema<unknown>, fakeRequest: Request) => {
                    const request: Routes = fakeRequest.params.route;

                    return new Database(request).getResponse();
                });

                this.post('/:route', (_: Schema<unknown>, fakeRequest: Request) => {
                    const request: Routes = fakeRequest.params.route;

                    return new Database(request).setResponse(fakeRequest.requestBody);
                })
            },
        })
    }
}