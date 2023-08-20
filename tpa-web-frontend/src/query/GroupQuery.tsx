import { gql } from "@apollo/client";

export const GET_ALL_USER_GROUP = gql`
query GetAllUserGroup{
  getAllUserGroup{
    id
    name
    bannerImageURL
    user{
      id
      first_name
      last_name
      profileImageURL
    }
    pendingUser{
      id
      first_name
      last_name
      profileImageURL
    }
    createdAt
  }
}
`

export const CREATE_GROUP = gql`
mutation CreateGroup($inputGroup: NewGroup!){
    createGroup(inputGroup: $inputGroup){
      id
      name
      bannerImageURL
      user{
        id
        first_name
        last_name
        profileImageURL
      }
      pendingUser{
        id
        first_name
        last_name
        profileImageURL
      }
      createdAt
    }
  }
`

export const GET_GROUP = gql`
query GetGroup($groupID: ID!){
    getGroup(groupID: $groupID){
      id
      name
      bannerImageURL
      user{
        id
        first_name
        last_name
        profileImageURL
      }
      pendingUser{
        id
        first_name
        last_name
        profileImageURL
      }
      createdAt
    }
  }
`

export const GET_ALL_GROUP_USER = gql`
query GetAllGroupUser($groupID: ID!){
    getAllGroupUser(groupID: $groupID){
      user{
        id
        first_name
        last_name
        profileImageURL
      }
      role
    }
  }
`

export const EDIT_GROUP_BANNER = gql`
mutation EditGroupBanner($groupID: ID!, $fileURL: String!){
  editGroupBanner(groupID: $groupID, fileURL: $fileURL)
}
`

export const CHECK_ADMIN_USER = gql`
query CheckAdminUser($groupID: ID!){
  checkAdminUser(groupID: $groupID)
}
`

export const GET_NON_MEMBER_USER = gql`
query GetNonMemberUser($groupID: ID!){
  getNonMemberUser(groupID: $groupID){
    id
    first_name
    last_name
    profileImageURL
  }
}
`

export const GET_ALL_GROUP_FILE = gql`
query GetAllGroupFile($groupID: ID!){
  getAllGroupFile(groupID: $groupID){
    id
    user{
      id
      first_name
      last_name
      profileImageURL
    }
    fileName
    fileURL
    type
    createdAt
  }
}

`

export const PROMOTE_MEMBER = gql`
mutation PromoteMember($groupID: ID!, $userID: ID!){
  promoteMember(groupID:$groupID, userID: $userID)
}
`

export const APPROVE_REQUEST = gql`
mutation ApproveRequest($groupID: ID!, $userID: ID!){
  approveRequest(groupID:$groupID, userID: $userID)
}
`

export const REJECT_REQUEST = gql`
mutation RejectRequest($groupID: ID!, $userID: ID!){
  rejectRequest(groupID:$groupID, userID: $userID)
}
`

export const KICK_MEMBER = gql`
mutation KickMember($groupID: ID!, $userID: ID!){
  kickMember(groupID:$groupID, userID: $userID)
}

`

export const INVITE_FRIEND = gql`
mutation InviteFriend($groupID: ID!, $userID: ID!){
  inviteFriend(groupID:$groupID, userID: $userID)
}
`

export const DELETE_GROUP_FILE = gql`
mutation DeleteGroupFile($groupID: ID!, $fileID: ID!){
  deleteGroupFile(groupID:$groupID, fileID: $fileID)
}

`

export const REQUEST_JOIN_GROUP = gql`
mutation RequestJoinGroup($groupID: ID!){
  requestJoinGroup(groupID: $groupID)
}
`

export const LEAVE_GROUP = gql`
mutation LeaveGroup($groupID: ID!){
  leaveGroup(groupID: $groupID)
}
`
export const CHECK_MEMBER = gql`
mutation CheckMember($groupID: ID!){
  checkMember(groupID: $groupID)
}
`