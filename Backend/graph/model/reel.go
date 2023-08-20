package model

import "time"

type Reel struct {
	ID        string         `json:"id"`
	Text      string         `json:"text"`
	FileURL   string        `json:"fileURL"`
	User      *User          `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID    string         `json:"userID"`
	Comment   []*ReelComment `json:"comment,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CommentID []*string      `json:"commentID" gorm:"json"`
	LikedBy   []*User        `json:"likedBy,omitempty" gorm:"many2many:reel_likes;associationForeignKey:UserID;joinForeignKey:ReelID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	SharedBy  []*User        `json:"sharedBy,omitempty" gorm:"many2many:reel_shares;associationForeignKey:UserID;joinForeignKey:ReelID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CreatedAt time.Time      `json:"createdAt"`
}

type ReelComment struct {
	ID        string         `json:"id"`
	ReelID    string         `json:"reelID"`
	Text      string         `json:"text"`
	CreatedAt time.Time      `json:"createdAt"`
	User      *User          `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID    string         `json:"userID"`
	Replies   []*ReelComment `json:"replies,omitempty" gorm:"foreignKey:ParentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ParentID  *string        `json:"parentID,omitempty"`
	LikedBy   []*User        `json:"likedBy,omitempty" gorm:"many2many:reelcomment_likes;associationForeignKey:UserID;joinForeignKey:CommentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE""`
}
