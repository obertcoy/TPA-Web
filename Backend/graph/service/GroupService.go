package service

import (
	"context"

	"github.com/obertcoy/tpa-web/graph/model"
)

func GetGroup(ctx context.Context, id string) (*model.Group, error) {
	var group *model.Group
	return group, db.Preload("User").Preload("GroupFile").Preload("PendingUser").Where("id = ?", id).First(&group).Error
}

func GetGroupFile(ctx context.Context, fileID string) (*model.GroupFile, error){
	var file *model.GroupFile
	return file, db.Where("id = ? ", fileID).First(&file).Error
}

func GetUserGroup(ctx context.Context, userID string) ([]*model.Group, error){
	var groups []*model.Group
	subquery := db.Table("user_group_roles").Select("group_id").Where("user_id = ?", userID)
	return groups, db.Preload("User").Preload("GroupFile").Preload("PendingUser").Where("id IN (?)", subquery).Find(&groups).Error
}