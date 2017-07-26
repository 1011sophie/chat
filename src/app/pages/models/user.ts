import {Message} from './message';

export interface User {

    id: number;

    name: string;

    messages: Message[];

    unreadMessages: Message[];

    lastSeenMessageId: number;

    unreadMessageCount: number;
}