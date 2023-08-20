import { ShowUser, User } from "../model/UserModel";

export function UserName(user: User | ShowUser){
    return `${user.first_name} ${user.last_name}`
}