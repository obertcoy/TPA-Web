import { gql } from "@apollo/client";

export const CREATE_POST = gql`
mutation CreatePost($inputPost: NewPost!){
  createPost(inputPost: $inputPost){
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
    tagged{
      id
      first_name
      last_name
      profileImageURL
    }
    createdAt
  }
}
`

export const GET_ALL_POST = gql`
query GetAllPost{
  getAllPost{
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
      id
      text
      parentID
      createdAt
      likedBy{
        id
      }
      user{
        id
        first_name
        last_name
        profileImageURL
      }
    }
    sharedBy{
      id
    }
    tagged{
      id
      first_name
      last_name
      profileImageURL
    }
    group{
      id
      name
    }
    createdAt
  }
}
`

export const GET_ALL_POST_DEBUG = gql`
query GetAllPostDebug{
  getAllPostDebug{
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
      id
      text
      parentID
      createdAt
      likedBy{
        id
      }
      user{
        id
        first_name
        last_name
        profileImageURL
      }
    }
    sharedBy{
      id
    }
    tagged{
      id
      first_name
      last_name
      profileImageURL
    }
    createdAt
  }
}
`


export const GET_POST = gql`
query GetPost($id: ID!){
  getPost(id: $id){
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
    tagged{
      id
      first_name
      last_name
      profileImageURL
    }
    group{
      id
      name
    }
    createdAt
  }
}
`

export const LIKE_POST = gql`
mutation LikePost($postID: ID!){
    likePost(postID: $postID)
  }
`
export const UNLIKE_POST = gql`
mutation UnlikePost($postID: ID!){
  	unlikePost(postID: $postID)
  }
`

export const DELETE_POST = gql`
mutation DeletePost($postID: ID!){
  deletePost(postID: $postID)
}
`

export const SHARE_POST = gql`
mutation SharePost($postID: ID!, $sharedTo: ID!){
  sharePost(postID: $postID, sharedTo: $sharedTo)
}
`

export const CREATE_COMMENT = gql`
mutation CreateComment($inputComment: NewComment!, $postID: ID!) {
  createComment(inputComment: $inputComment, postID: $postID) {
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

export const LIKE_COMMENT = gql`
mutation LikeComment($commentID: ID!){
  likeComment(commentID: $commentID)
}
`
export const UNLIKE_COMMENT = gql`
mutation UnlikeComment($commentID: ID!){
  unlikeComment(commentID: $commentID)
}
`

export const GET_GROUP_POST = gql`
query GetGroupPost($groupID: ID!){
  getGroupPost(groupID: $groupID){
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
    tagged{
      id
      first_name
      last_name
      profileImageURL
    }
    group{
      id
      name
    }
    createdAt
  }
}
`