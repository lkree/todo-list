import 'bootstrap/dist/css/bootstrap.min.css';
import './../css/index.sass';

import {ACApp} from "./misc/interface";
import Loader from "./components/Loader";
import ClientServer from "./utils/ClientServer";
// @ts-ignore
import Server from "../../server";

class App extends ACApp {
    async init(): Promise<void> {
        Server.init();
        Loader.show();
        ClientServer.renderList();
    }
}

new App()
    .init()