import { ShowUser } from "./UserModel";

export interface Group{
    id: string
    name: string
    bannerImageURL: string
    user: ShowUser[]
    pendingUser: ShowUser[]
    groupFile: GroupFile[]
    createdAt: Date
}

export interface GroupFile{
    id: string
    user: ShowUser
    fileURL: string
    fileName: string
    type: string
    createdAt: Date
}

export interface GroupUser{
    user: ShowUser
    role: string
}

export interface ShowGroup{
    id: string
    name: string
    bannerImageURL: string
}