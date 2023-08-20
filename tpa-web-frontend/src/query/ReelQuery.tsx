import { gql } from "@apollo/client";

export const CREATE_REEL = gql`
mutation CreateReel($inputReel: NewReel!){
  createReel(inputReel: $inputReel){
    id
    text
    fileURL
    user{
      id
      first_name
      last_name
      profileImageURL
    }
    likedBy{
      id
    }
    comment{
      text
      user{
        id
        first_name
        last_name
        profileImageURL
      }
      createdAt
    }
    sharedBy{
      id
    }
    createdAt
  }
}
`

export const GET_ALL_REEL = gql`
query GetAllReel {
  getAllReel {
    id
    text
    fileURL
    user {
      id
      first_name
      last_name
      profileImageURL
    }
    likedBy {
      id
    }
    comment {
      id
      text
      parentID
      createdAt
      likedBy {
        id
      }
      replies {
        id
        text
        parentID
        createdAt
        likedBy {
          id
        }
        user {
          id
          first_name
          last_name
          profileImageURL
        }
      }
      user {
        id
        first_name
        last_name
        profileImageURL
      }
    }
    sharedBy {
      id
    }
    createdAt
  }
}
`

export const GET_USER_REEL = gql`
query GetUserReel($userID: ID!){
  getUserReel(userID: $userID){
    id
    text
    fileURL
    user {
      id
      first_name
      last_name
      profileImageURL
    }
    likedBy {
      id
    }
    comment {
      id
      text
      parentID
      createdAt
      likedBy {
        id
      }
      user {
        id
        first_name
        last_name
        profileImageURL
      }
      replies{
        id
        text
        parentID
        createdAt
        likedBy {
          id
        }
        user {
          id
          first_name
          last_name
          profileImageURL
        }
      }
    }
    sharedBy {
      id
    }
    createdAt
  }
}
`

export const GET_REEL = gql`
query GetReel($reelID: ID!){
  getReel(reelID: $reelID){
    id
    text
    fileURL
    user {
      id
      first_name
      last_name
      profileImageURL
    }
    likedBy {
      id
    }
    comment {
      id
      text
      parentID
      createdAt
      likedBy {
        id
      }
      user {
        id
        first_name
        last_name
        profileImageURL
      }
      replies{
        id
        text
        parentID
        createdAt
        likedBy {
          id
        }
        user {
          id
          first_name
          last_name
          profileImageURL
        }
      }
    }
    sharedBy {
      id
    }
    createdAt
  }
}
`

export const LIKE_REEL = gql`
mutation LikeReel($reelID: ID!){
    likeReel(reelID: $reelID)
  }
`
export const UNLIKE_REEL = gql`
mutation UnlikeReel($reelID: ID!){
  	unlikeReel(reelID: $reelID)
  }
`

export const CREATE_REEL_COMMENT = gql`
mutation CreateReelComment($inputReelComment: NewReelComment!, $reelID: ID!) {
  createReelComment(inputReelComment: $inputReelComment, reelID: $reelID) {
    id
    text
    createdAt
    user {
      id
      first_name
      last_name
      profileImageURL
    }
    parentID
    likedBy {
      id
    }
  }
}
`

export const LIKE_REEL_COMMENT = gql`
mutation LikeReelComment($reelCommentID: ID!){
  likeReelComment(reelCommentID: $reelCommentID)
}
`
export const UNLIKE_REEL_COMMENT = gql`
mutation UnlikeReelComment($reelCommentID: ID!){
  unlikeReelComment(reelCommentID: $reelCommentID)
}
`