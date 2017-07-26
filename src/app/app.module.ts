import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ChatService} from './services/chat.service';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {StoreService} from './services/store.service';
import {Resource} from './supports/resource';
import {RouterModule, Routes} from '@angular/router';
import {Guard} from './supports/guard';
import {Api} from './api';
import {HttpModule} from '@angular/http';

const routes: Routes = [
    {
        path: '',
        canActivate: [Guard],
        component: DashboardComponent
    }, {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        FormsModule,
        HttpModule
    ],
    providers: [
        Api,
        Resource,
        ChatService,
        StoreService,
        Guard,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}


