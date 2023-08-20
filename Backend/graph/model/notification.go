package model

import "time"

type Notification struct {
	ID         string    `json:"id"`
	User       *User     `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID     string    `json:"userID"`
	CreatedAt  time.Time `json:"createdAt"`
	Text       string    `json:"text"`
	Read       bool      `json:"read"`
	FromUser   *User     `json:"fromUser" gorm:"foreignKey:FromUserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	FromUserID string    `json:"userID"`
}
