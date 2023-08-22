package model

import "time"

type Group struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	BannerImageURL *string   `json:"bannerImageURL,omitempty"`
	User           []*User   `json:"user,omitempty" gorm:"many2many:user_group_roles;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Private        bool      `json:"private"`
	CreatedAt      time.Time `json:"createdAt"`
	GroupFile      []*GroupFile `json:"groupFile,omitempty" gorm:"many2many:group_groupfiles;associationForeignKey:GroupFileID;joinForeignKey:GroupID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	PendingUser    []*User      `json:"pendingUser,omitempty" gorm:"many2many:group_pendingusers;associationForeignKey:UserID;joinForeignKey:GroupID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type UserGroupRole struct {
	UserID  string   `gorm:"primaryKey"`
	GroupID string `gorm:"primaryKey"`
	Role    string `json:"role" gorm:"default:Member"`
}


type GroupFile struct {
	ID        string    `json:"id"`
	User      *User     `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID    string     `json:"userID"`
	FileURL   string    `json:"fileURL"`
	FileName  string    `json:"fileName"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"createdAt"`
}

