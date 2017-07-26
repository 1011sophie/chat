import {Injectable} from '@angular/core';
import {ChatService} from './chat.service';
import {Api} from '../api';
import {Router} from '@angular/router';
import {User} from '../pages/models/user';
import {LocalStorage} from '../supports/storage';

@Injectable()
export class StoreService {

    private data: any = {};

    constructor(private chat: ChatService,
                private api: Api,
                private router: Router) {
        // this.set('user', LocalStorage.get('user'));
    }

    set(property: string, value: any, save: boolean = false): void {
        this.data[property] = value;
        if (save) {
            LocalStorage.set(property, value);
        }
    }

    get(property: string, $default: any = null) {
        if (this.data.hasOwnProperty(property)) {
            return this.data[property];
        }
        return $default;
    }

    public login(username: string) {
        this.api.resource('login').post({
            username: username
        }).subscribe((user: User) => {
            this.set('user', user, true);
            this.router.navigate(['/']);
        });
    }

    public logout() {
        this.set('user', null, true);
        this.router.navigate(['/login']);
    }

    get user(): User {
        return this.get('user');
    }
}
