import { gql } from "@apollo/client";

export const GO_TO_CHATROOM = gql`
mutation GoToChatRoom($inputChatRoom: NewChatRoom!){
    goToChatRoom(inputChatRoom: $inputChatRoom){
        id
        user{
            id
            first_name
            last_name
            profileImageURL
        }
        createdAt
        chat{
            id
            text
            fileURL
            createdAt
            user{
                id
                first_name
                last_name
                profileImageURL
            }
        }
        group{
            id
        }
  }
}
`

export const GET_ALL_CHATROOM = gql`
query GetAllChatRoom{
  getAllChatRoom{
    id
    user{
      id
      first_name
      last_name
      profileImageURL
    }
    createdAt
    chat{
      id
      text
      fileURL
      createdAt
      user{
        id
        first_name
        last_name
        profileImageURL
      }
    }
    group{
      id
      name
      bannerImageURL
    }
  }
}
`

export const GET_CHAT_ROOM = gql`
query GetChatRoom($chatRoomID: ID!){
  getChatRoom(chatRoomID: $chatRoomID){
    id
    user{
      id
      first_name
      last_name
      profileImageURL
    }
    createdAt
    chat{
      id
      text
      fileURL
      createdAt
      user{
        id
        first_name
        last_name
        profileImageURL
      }
    }
    group{
      id
      name
      bannerImageURL
    }
    
  }
}
`

export const CREATE_CHAT = gql`
mutation CreateChat($inputChat: NewChat!){
  createChat(inputChat: $inputChat){
    id
    text
    fileURL
    createdAt
  }
}
`

export const GET_CHAT = gql`
subscription GetChat($chatRoomID: ID!){
	getChat(chatRoomID: $chatRoomID){
    id
    text
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