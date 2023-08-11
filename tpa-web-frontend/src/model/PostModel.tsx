import { ShowUser } from "./UserModel"

export interface Post {
    id: string
    text: string
    user: ShowUser
    fileURL: string[] | null
    createdAt: Date
    likedBy: CountComponent[] | null
    comment: Comment[] | null
    sharedBy: CountComponent[] | null
    tagged: ShowUser[] | null
}

export interface Comment {
    id: string
    text: string
    parentID: string | null
    likedBy: CountComponent[] | null
    replies: Comment[] | null
    user: ShowUser
    createdAt: Date
}

export interface CountComponent{
    id: string
}
