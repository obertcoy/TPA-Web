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
    groupFile{
      id
      user{
        id
        first_name
        last_name
        profileImageURL
      }
      fileURL
      fileName
      type
      createdAt
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
      groupFile{
        id
        user{
          id
          first_name
          last_name
          profileImageURL
        }
        fileURL
        fileName
        type
        createdAt
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
      groupFile{
        id
        user{
          id
          first_name
          last_name
          profileImageURL
        }
        fileURL
        fileName
        type
        createdAt
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