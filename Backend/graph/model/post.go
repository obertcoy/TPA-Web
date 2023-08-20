package model

import "time"

type Post struct {
	ID        string     `json:"id"`
	Text      string     `json:"text"`
	FileURL   []*string  `json:"fileURL,omitempty" gorm:"json"`
	User      *User      `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID    string     `json:"userID"`
	Comment   []*Comment `json:"comment,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CommentID []*string  `json:"commentID" gorm:"json"`
	LikedBy   []*User    `json:"likedBy,omitempty" gorm:"many2many:post_likes;associationForeignKey:UserID;joinForeignKey:PostID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	SharedBy  []*User    `json:"sharedBy,omitempty" gorm:"many2many:post_shares;associationForeignKey:UserID;joinForeignKey:PostID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Tagged    []*User    `json:"tagged,omitempty" gorm:"many2many:post_tags;associationForeignKey:UserID;joinForeignKey:PostID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CreatedAt time.Time  `json:"createdAt"`
	Type      string     `json:"type"`
    Group     *Group     `json:"group,omitempty" gorm:"foreignKey:GroupID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	GroupID   *string     `json:"groupID, omitempty"`
}

type Comment struct {
	ID        string     `json:"id"`
	PostID    string     `json:"postID"`
	Text      string     `json:"text"`
	CreatedAt time.Time  `json:"createdAt"`
	User      *User      `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID    string     `json:"userID"`
	Replies   []*Comment `json:"replies,omitempty" gorm:"foreignKey:ParentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ParentID  *string     `json:"parentID,omitempty"`
	LikedBy   []*User    `json:"likedBy,omitempty" gorm:"many2many:comment_likes;associationForeignKey:UserID;joinForeignKey:CommentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE""`
}
