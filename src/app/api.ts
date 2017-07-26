import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Resource} from './supports/resource';
import {StoreService} from './services/store.service';

@Injectable()
export class Api {


    constructor(public http: Http) {
    }


    resource(url: string): Resource {

        let resource = new Resource(this.http);

        resource.urlParts = ['http://localhost:8001', url];
        //
        // if (this.store.user) {
        //     resource.query['token'] = this.store.user.token;
        // }

        return resource;
    }
}