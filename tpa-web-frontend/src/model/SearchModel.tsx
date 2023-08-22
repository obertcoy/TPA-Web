import { Group } from "./GroupModel";
import { Post } from "./PostModel";
import { User } from "./UserModel";

export interface SearchResult {
    users: User[]
    posts: Post[]
    groups: Group[]
}