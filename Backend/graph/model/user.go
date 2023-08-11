package model

import "time"

type User struct {
	ID              string    `json:"id"`
	FirstName       string    `json:"first_name"`
	LastName        string    `json:"last_name"`
	Email           string    `json:"email" gorm:"unique"`
	Gender          string    `json:"gender"`
	Dob             time.Time `json:"dob"`
	Password        []byte    `json:"password"`
	Activated       bool      `json:"activated"`
	ActivateToken   string    `json:"activate_token"`
	ForgotToken     string    `json:"forgot_token"`
	ProfileImageURL *string   `json:"profileImageURL,omitempty"`
	Friend          []*User   `json:"friend,omitempty" gorm:"many2many:user_friends;associationForeignKey:UserID;joinForeignKey:FriendID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
