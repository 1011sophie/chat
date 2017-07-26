import {Http, URLSearchParams, Headers, RequestMethod, Request} from "@angular/http";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";

@Injectable()
export class Resource {

    public urlParts: any[] = [];

    public headers: any = {};

    public query: any = {};

    constructor(private http: Http) {
    }

    private buildUrl(): string {
        return this.urlParts.join("/");
    }

    private buildQuery() {
        let query = new URLSearchParams();
        for (let key in this.query) {
            if (this.query.hasOwnProperty(key)) {
                let value = this.query[key];
                if (value == null) continue;
                if (value == 'undefined') continue;
                if (value instanceof Array) {
                    for (let i in value) {
                        if (value.hasOwnProperty(i)) {
                            query.append(key + '[]', value[i]);
                        }
                    }
                } else {
                    query.set(key, value);
                }
            }
        }
        return query;
    }

    private buildHeaders() {
        let headers = new Headers;
        for (let key in this.headers) {
            if (this.headers.hasOwnProperty(key)) {
                headers.append(key, this.headers[key]);
            }
        }
        return headers;
    }

    request(options: any) {
        let defaultOptions: any = {
            url: this.buildUrl(),
            search: this.buildQuery(),
            headers: this.buildHeaders(),
        };
        options = Object.assign(defaultOptions, options);
        let request = new Request(options);
        return this.http.request(request).map((res) => {
            try {
                return res.json();
            } catch (e) {
                return res;
            }
        });
    }

    get(query: any = {}) {
        this.query = Object.assign(this.query, query);
        return this.request({
            method: RequestMethod.Get,
        });
    }

    post(body: any = {}) {
        return this.request({
            method: RequestMethod.Post,
            body: body
        });
    }

    put(body: any = {}) {
        return this.request({
            method: RequestMethod.Put,
            body: body
        });
    }


    /** *****/

    find(id: any, query: any = {}) {
        this.urlParts.push(id);
        return this.get(query);
    }

    store(body: any = {}) {
        return this.post(body);
    }

    update(id: any, body: any = {}) {
        this.urlParts.push(id);
        return this.put(body);
    }

    destroy(id: any) {
        this.urlParts.push(id);
        return this.request({
            method: RequestMethod.Delete,
        });
    }
}

