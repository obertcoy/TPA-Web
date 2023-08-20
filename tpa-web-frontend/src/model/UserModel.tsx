export interface User {
    id: string
    first_name: string
    last_name: string
    email: string
    gender: string
    dob: Date
    profileImageURL: string
    bannerImageURL: string

    friend: ShowUser[]
    pendingFriend: User[]
    blockedUser: ShowUser[]
    specificFriend: ShowUser[]
}

export interface ShowUser{

    id: string
    first_name: string
    last_name: string
    profileImageURL: string
}