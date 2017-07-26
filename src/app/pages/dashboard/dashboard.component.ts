import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { observable } from 'rxjs/symbol/observable';
import { Subscription } from "rxjs/Subscription";
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { StoreService } from '../../services/store.service';
import { Api } from '../../api';
import { User } from '../models/user';
import { Message } from '../models/message';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    private userMap: { [id: string]: User; } = {};

    public users: User[] = [];

    public recipient: User;

    public messageText: string = '';

    public openChatChannel: string = '';
    public openChatSub: Subscription;
    public openChatSeen: Subscription;

    constructor(private chatService: ChatService,
        private store: StoreService,
        private api: Api) {
    }

    ngOnInit() {
        this.loadUsers();

        let messagesChannelName = 'messages' + this.store.user.id;
        let usersChannelName = 'users';

        this.chatService.channel(messagesChannelName).subscribe((message: Message) => {
            console.log('message was received', messagesChannelName);
            this.getMessagesCount();
        });

        this.chatService.channel(usersChannelName).subscribe(() => {
            this.loadUsers();
        });
    }

    loadUsers() {
        this.api.resource('users').get({ userId: this.store.user.id }).subscribe((response: User[]) => {
            let userMap: { [id: string]: User; } = {};
            response.forEach((user: User) => {
                user.unreadMessageCount = 0;
                user.messages = [];
                userMap[user.id] = user;
            });
            this.userMap = userMap;
            this.users = response;
        });
    }

    openChat(user: User) {
        if (this.openChatSub)
            this.openChatSub.unsubscribe();

        if (this.openChatSeen)
            this.openChatSeen.unsubscribe();

        if (this.recipient != user) {
            this.getPrivateMessages(user);

            this.openChatChannel = 'messages' + this.store.user.id + '-' + user.id;
            this.openChatSub =
                this.chatService.channel(this.openChatChannel).subscribe((message: Message) => {
                    console.log('message was received', this.openChatChannel);
                    this.getPrivateMessages(user);
                });

            this.recipient = user;
            user.unreadMessageCount = 0;
        }
    }

    getPrivateMessages(user) {

        var pair1 = this.store.user.id;
        var pair2 = user.id;

        this.api.resource('messages').get({ pair1: pair1, pair2: pair2 }).subscribe((messages: Message[]) => {
            messages.forEach((message: Message) => {
                console.log(message);
                user.messages.push(message);
            });
        });
    }

    getMessagesCount() {
        this.api.resource('messageCounts').get({
            user: this.store.user.id
        }).subscribe((userCounts: any) => {
            console.log(userCounts);
            userCounts.forEach((item) => {
                this.userMap[item.id].unreadMessageCount = item.count;
            })
        })
    }

    sendMessage() {
        this.api.resource('messages').post({
            text: this.messageText,
            sender: this.store.user,
            receiver: this.recipient,
        }).subscribe((response: Message) => {
            this.messageText = '';
            this.recipient.messages.push(response);

            this.openChatSeen = this.chatService.channel("seen" + this.store.user.id + '-' + this.recipient.id).subscribe(
                () => {
                    this.recipient.messages.forEach((msg) => {
                        msg.seen = true;
                    })
                });
        });
    }
}
