import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($inputUser: NewUser!) {
     createUser(inputUser: $inputUser) {
        id
        email
        first_name
        last_name
        gender
        dob
        activated
  }
}
`

export const LOGIN_USER = gql`
    mutation LoginUser($inputCredential: LoginCredential!){
        loginUser(inputCredential: $inputCredential){
            user{
              id
    email
    first_name
    last_name
    gender
    dob
    activated
    profileImageURL
    bannerImageURL
    friend{
      id
      first_name
      last_name
      profileImageURL
    }
    pendingFriend{
      id
      first_name
      last_name
      profileImageURL
    }
    blockedUser{
      id
      first_name
      last_name
      profileImageURL
    }
     specificFriend{
      id
      first_name
      last_name
      profileImageURL
    }
            }
            token
        }
    }
`

export const ACTIVATE_USER = gql`
   mutation ctivateUser($token: String!){
     activateUser(token: $token)
    }
`

export const SEND_CHANGE_PASSWORD = gql`
    mutation SendChangePassword($email: String!){
        sendChangePassword(email: $email)
    }
`

export const VERIFY_CHANGE_PASSWORD_TOKEN = gql`
    mutation VerifyChangePasswordToken($email: String!, $token: String!){
        verifyChangePasswordToken(email: $email, token: $token)
    }
`

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($email:String!, $newPassword: String!){
        changePassword(email: $email, newPassword: $newPassword)
    }
`

export const GET_ALL_USER = gql`
query GetALLUser{
  getAllUser{
     id
    email
    first_name
    last_name
    gender
    dob
    activated
    profileImageURL
    bannerImageURL
    friend{
      id
      first_name
      last_name
      profileImageURL
    }
    pendingFriend{
      id
      first_name
      last_name
      profileImageURL
    }
    blockedUser{
      id
      first_name
      last_name
      profileImageURL
    }
    specificFriend{
      id
      first_name
      last_name
      profileImageURL
    }
  }
  }
`

export const GET_USER = gql`
query GetUser($id: ID!){
  getUser(id: $id){
     id
    email
    first_name
    last_name
    gender
    dob
    activated
    profileImageURL
    bannerImageURL
    friend{
      id
      first_name
      last_name
      profileImageURL
    }
    pendingFriend{
      id
      first_name
      last_name
      profileImageURL
    }
    blockedUser{
      id
      first_name
      last_name
      profileImageURL
    }
    specificFriend{
      id
      first_name
      last_name
      profileImageURL
    }
    groupInvite{
      id
      name
      bannerImageURL
    }
  }
  }
`

export const UPDATE_PROFILE_IMAGE = gql`
mutation UpdateProfileImage($fileURL: String!){
  updateProfileImage(fileURL: $fileURL)
}
`

export const UPDATE_BANNER_IMAGE = gql`
mutation UpdateBannerImage($fileURL: String!){
  updateBannerImage(fileURL: $fileURL)
}
`

export const GET_ALL_NON_FRIEND = gql`
query GetAllNonFriend($id: ID!){
  getAllNonFriend(id: $id){
    id
    email
    first_name
    last_name
    gender
    dob
    activated
    profileImageURL
    bannerImageURL
    friend{
      id
      first_name
      last_name
      profileImageURL
    }
    pendingFriend{
      id
      first_name
      last_name
      profileImageURL
      pendingFriend{
        id
      }
    }
    blockedUser{
      id
      first_name
      last_name
      profileImageURL
    }
    specificFriend{
      id
      first_name
      last_name
      profileImageURL
    }
  }
}
`

export const SEND_FRIEND_REQUEST = gql`
mutation SendFriendRequest($friendID:ID!){
  sendFriendRequest(friendID: $friendID)
}
`

export const ACCEPT_FRIEND_REQUEST = gql`
mutation AcceptFriendRequest($friendID:ID!){
  acceptFriendRequest(friendID: $friendID)
}`

export const REJECT_FRIEND_REQUEST = gql`
mutation RejectFriendRequest($friendID:ID!){
  rejectFriendRequest(friendID: $friendID)
}`

export const BLOCK_USER = gql`
mutation BlockUser($userID:ID!){
  blockUser(userID: $userID)
}
`

export const ADD_SPECIFIC_FRIEND = gql`
mutation AddSpecificFriend($friendID:ID!){
 addSpecificFriend(friendID: $friendID)
}`

export const REMOVE_SPECIFIC_FRIEND = gql`
mutation RemoveSpecificFriend($friendID:ID!){
  removeSpecificFriend(friendID: $friendID)
}`

export const ACCEPT_GROUP_INVITE = gql`
mutation AcceptGroupInvite($groupID: ID!){
  acceptGroupInvite(groupID: $groupID)
}
`

export const REJECT_GROUP_INVITE = gql`
mutation RejectGroupInvite($groupID: ID!){
  rejectGroupInvite(groupID: $groupID)
}
`
