import { ShowUser } from "./UserModel"

export interface Story{
    id: string
    fileURL: string | null
    createdAt: Date
    user: ShowUser
}