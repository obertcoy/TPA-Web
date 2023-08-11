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
            first_name
            last_name
            email
            gender
            dob
            activated
            profileImageURL
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