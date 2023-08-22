import { ShowGroup } from "./GroupModel"
import { Post } from "./PostModel"
// import { Post } from "./PostModel"
import { ShowUser } from "./UserModel"

export interface ChatRoom{

    id: string
    user: ShowUser[]
    createdAt: Date
    chat: Chat[]
    group: ShowGroup
}

export interface Chat{
    
    id: string
    text: string
    fileURL: string
    createdAt: Date
    user: ShowUser
    post: Post
}