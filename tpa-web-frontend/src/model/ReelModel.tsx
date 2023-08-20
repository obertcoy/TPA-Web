import { Comment, CountComponent } from "./PostModel"
import { ShowUser } from "./UserModel"

export interface Reel {
    id: string
    text: string
    user: ShowUser
    fileURL: string
    createdAt: Date
    likedBy: CountComponent[] | null
    comment: Comment[] | null
    sharedBy: CountComponent[] | null
}

