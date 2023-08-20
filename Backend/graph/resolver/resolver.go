package resolver

import (
	"github.com/obertcoy/tpa-web/graph/model"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

//go:generate go run github.com/99designs/gqlgen generate

type Resolver struct{
	Database *gorm.DB
	ChatRoomChannel map[string]map[string] chan []*model.Chat
}
