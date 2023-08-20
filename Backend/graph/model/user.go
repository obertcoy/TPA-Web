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
	BannerImageURL  *string   `json:"bannerImageURL,omitempty"`

	Friend         []*User         `json:"friend,omitempty" gorm:"many2many:user_friends;associationForeignKey:UserID;joinForeignKey:FriendID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	PendingFriend  []*User         `json:"pendingFriend,omitempty" gorm:"many2many:user_pendingfriends;associationForeignKey:UserID;joinForeignKey:PendingFriendID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	BlockedUser    []*User         `json:"blockedUser,omitempty" gorm:"many2many:user_blockedusers;associationForeignKey:UserID;joinForeignKey:BlockedUserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	SpecificFriend []*User         `json:"specificFriend,omitempty" gorm:"many2many:user_specificfriends;associationForeignKey:UserID;joinForeignKey:SpecificFriendID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Notification   []*Notification `json:"notification,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	NotificationID []*string        `json:"notificationID, omitempty" gorm:"json"`

	GroupInvite     []*Group        `json:"groupInvite,omitempty" gorm:"many2many:user_groupinvites;associationForeignKey:GroupID;joinForeignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`

}
