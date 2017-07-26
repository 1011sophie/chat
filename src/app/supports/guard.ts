import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {StoreService} from '../services/store.service';


@Injectable()
export class Guard implements CanActivate {

    constructor(private store: StoreService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.store.user) {
            this.router.navigate(['/login']);
        }

        return true;

    }
}
