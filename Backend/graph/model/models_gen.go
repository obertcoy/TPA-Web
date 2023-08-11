// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)


type LoginCredential struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type NewComment struct {
	Text     string  `json:"text"`
	ParentID *string `json:"parentID,omitempty"`
}

type NewPost struct {
	Text     string    `json:"text"`
	FileURL  []*string `json:"fileURL,omitempty"`
	TaggedID []*string `json:"taggedID,omitempty"`
	Type     string    `json:"type"`
}

type NewStory struct {
	FileURL string `json:"fileURL"`
}

type NewUser struct {
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Gender    string    `json:"gender"`
	Dob       time.Time `json:"dob"`
	Password  string    `json:"password"`
}

type UserAuthorization struct {
	User  *User  `json:"user"`
	Token string `json:"token"`
}
