package model

import "time"

type Notification struct {
	ID        string    `json:"id"`
	User      *User     `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID    string    `json:"userID"`
	CreatedAt time.Time `json:"createdAt"`
	Text      string    `json:"text"`
	Read      bool      `json:"read"`
}
