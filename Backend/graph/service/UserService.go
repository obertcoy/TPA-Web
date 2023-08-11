package service

import (
	"context"

	"github.com/obertcoy/tpa-web/database"
	"github.com/obertcoy/tpa-web/graph/model"
	"gorm.io/gorm"
)

var db *gorm.DB = database.GetInstance()

func GetUser(ctx context.Context, id string) (*model.User, error){
	var user *model.User
	return user, db.Preload("Friend").First(&user, "id = ?", id).Error
}

func GetUserByEmail(ctx context.Context, email string) (*model.User, error){
	var user *model.User
	return user, db.Preload("Friend").First(&user, "email = ?", email).Error
}

func GetActiveUserByEmail(ctx context.Context, email string) (*model.User, error){
	var user *model.User
	return user, db.Preload("Friend").First(&user, "email = ? AND activated = ?", email, true).Error
}

func GetUserByActivateToken(ctx context.Context, token string) (*model.User, error){
	var user *model.User
	return user, db.Preload("Friend").First(&user, "activate_token = ?", token).Error
}