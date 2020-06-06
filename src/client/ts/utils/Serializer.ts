import {ICommonData, ITodoItem} from '../misc/interface';


export default class Serializer {
    static emptyData: ICommonData = {
        error: '',
        user: '',
        todos: {},
    };
    static emptyTodo: ITodoItem = {
        title: '',
        key: null,
        deleted: false,
        description: '',
        favourite: false
    };

    static _serialize(data: ICommonData): ICommonData {
        if (!data)
            data = { user: '', error: '', todos: {} };

        const dataKeys = Object.keys(data);
        const emptyDataKeys = Object.keys(Serializer.emptyData);

        emptyDataKeys.forEach((k: keyof ICommonData) => {
            if (!dataKeys.includes(k))
                data[k] = <string & ICommonData['todos']>Serializer.emptyData[k];
        });

        return data;
    }
    static serialize(data: ICommonData): string {
        return JSON.stringify(Serializer._serialize(data));
    }
    static unserialize(data: string): ICommonData {
        let tempData: ICommonData;

        try {
            tempData = JSON.parse(data);
        } catch (e) {
            tempData = <ICommonData><unknown>data;
        }

        return Serializer._serialize(tempData);
    }
}