import { gql } from "@apollo/client"


export const GET_SEARCH_RESULT = gql`
query GetSearchResult($search: String!){
  getSearchResult(search: $search){
    users{
      id
      first_name
      last_name
      profileImageURL
    }
    posts{
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
    group{
      id
      name
    }
    sharedBy {
      id
    }
    createdAt
    }
    groups{
      id
      name
      bannerImageURL
    }
  }
}
`