import { gql } from "@apollo/client";

export const CREATE_STORY = gql`
mutation CreateStory($inputStory: NewStory!){
  createStory(inputStory: $inputStory){
    id
    fileURL
    createdAt
    user{
      id
      first_name
      last_name
      profileImageURL
    }
  }
}
`

export const GET_ALL_STORY = gql`
query GetAllStory{
  getAllStory{
    id
    fileURL
    createdAt
    user{
      id
      first_name
      last_name
      profileImageURL
    }
  }
}
`

export const GET_USER_STORY = gql`
query GetUserStory($userID: ID!){
  getUserStory(userID: $userID){
    id
    fileURL
    createdAt
    user{
      id
      first_name
      last_name
      profileImageURL
    }
  }
}
`