import { gql } from "@apollo/client";

export const GET_USER_NOTIFICATION = gql`
query GetUserNotification{
  getUserNotification{
    id
    user{
      id
      first_name
      last_name
      profileImageURL
    }
    createdAt
    text
    read
    fromUser{
      id
      first_name
      last_name
      profileImageURL
    }
  }
}
`

export const READ_NOTIFICATION = gql`
mutation ReadNotification($notificationID: ID!){
  readNotification(notificationID: $notificationID)
}
`