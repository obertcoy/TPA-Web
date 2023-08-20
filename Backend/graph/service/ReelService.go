package service

import (
	"context"

	"github.com/obertcoy/tpa-web/graph/model"
	"gorm.io/gorm"
)

func GetReel(ctx context.Context, id string) (*model.Reel, error) {
	var reel *model.Reel
	return reel, db.
		Preload("Comment", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC")
		}).
		Preload("Comment.LikedBy").
		Preload("Comment.Replies", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC")
		}).
		Preload("LikedBy").
		Preload("SharedBy").
		First(&reel, "id = ?", id).Error
}

func GetReelReplies(ctx context.Context, parentID string) ([]*model.ReelComment, error) {
	var replies []*model.ReelComment
	return replies, db.Find(&replies).Where("parent_id = ?", parentID).Error
}

func GetReelComment(ctx context.Context, id string) (*model.ReelComment, error) {
	var comment *model.ReelComment
	return comment, db.Preload("Replies").Preload("LikedBy").First(&comment, "id = ?", id).Error
}