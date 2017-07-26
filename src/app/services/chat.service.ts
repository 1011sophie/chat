import { User } from '../pages/models/user';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
declare var io: any;

@Injectable()
export class ChatService {

    private socket: any;

    constructor() {
        this.socket = io('http://localhost:8001');
    }

    send(msg: string) {
        this.socket.emit('message', msg);
    }

    channel(name: string): Observable<any> {
        return Observable.create((subscriber: Subscriber<any>) => {
            this.socket.on(name, (data: any) => {
                subscriber.next(data);
            });
        });
    }
}
