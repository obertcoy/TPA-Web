package model

import "time"

type Story struct {
	ID         string    `json:"id"`
	FileURL    string   `json:"fileURL,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
	User       *User     `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	UserID    string     `json:"userID"`
}