import 'bootstrap/dist/css/bootstrap.min.css';
import './../css/index.sass';

import Loader from './components/Loader';
import ClientServer from './utils/ClientServer';
// @ts-ignore
import Server from '../../server';
import ELActionsHandler from './utils/ELActionsHandler';
import {Statuses} from './misc/Statuses';
import {ClassNames} from './misc/classNames';
import EventListenersWrapper from './components/EventListenersWrapper';

abstract class ACApp {
    abstract async init(): Promise<void>;
}

class App extends ACApp {
    async init(): Promise<void> {
        const clientServerHandler = new ClientServer();

        new Server().init();
        Loader.show();
        await clientServerHandler.renderList();
        new ELActionsHandler([
            {
                elements: [document.querySelector(ClassNames.todoAddButton)],
                actions: ['click'],
                args: {},
                handler: EventListenersWrapper.onAddButtonClick,
                statuses: [Statuses.init, Statuses.destroy]
            },
            {
                elements: [document.querySelector(ClassNames.todoList)],
                actions: ['click'],
                args: {},
                handler: EventListenersWrapper.onRecordClick,
                statuses: [Statuses.init, Statuses.destroy]
            }
        ], clientServerHandler).handle('add', Statuses.init);
        Loader.hide();
    }
}

new App()
    .init()