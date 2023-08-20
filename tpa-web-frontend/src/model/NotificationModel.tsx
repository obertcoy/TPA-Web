import { ShowUser } from "./UserModel";

export interface Notification{
    id: string,
    user: ShowUser,
    text: string,
    fromUser: ShowUser,
    createdAt: Date,
    read: boolean
}