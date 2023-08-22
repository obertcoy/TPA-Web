package model

import "time"

type Chat struct {
	ID         string    `json:"id"`
	Text       *string   `json:"text,omitempty"`
	FileURL    *string   `json:"fileURL,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
	User       *User     `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID     string    `json:"userID"`
	ChatRoomID string    `json:"chatRoomID"`
	Post       *Post     `json:"post,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	PostID     *string   `json:"postID,omitempty"`
}

type ChatRoom struct {
	ID        string    `json:"id"`
	User      []*User   `json:"user,omitempty" gorm:"many2many:chatroom_users;associationForeignKey:UserID;joinForeignKey:ChatRoomID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CreatedAt time.Time `json:"createdAt"`
	Chat      []*Chat   `json:"chat,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ChatID    []*string `json:"chatID,omitempty" gorm:"json"`
	Group     *Group    `json:"group,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	GroupID   *string   `json:"groupID,omitempty"`
}
