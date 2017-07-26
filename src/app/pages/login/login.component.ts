import {Component} from '@angular/core';
import {StoreService} from '../../services/store.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    public username: string = '';

    constructor(private store: StoreService) {
    }

    login() {
        if (this.username.length >= 3) {
            this.store.login(this.username);
        }
    }
}
