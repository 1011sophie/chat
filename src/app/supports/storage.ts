import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";

@Injectable()
export class LocalStorage {

    public static set(key: string, value: any) {
        let data: any;
        data = {value};
        localStorage.setItem(key, JSON.stringify(data));
    }

    public static get(key: string, $default: any = null) {
        let json: string = localStorage.getItem(key);
        if (json) {
            let data: any = JSON.parse(json);
            if (data && data.value) {
                return data.value;
            }
        }
        return $default;
    }

    public static remove(key: string) {
        localStorage.removeItem(key);
    }
}

