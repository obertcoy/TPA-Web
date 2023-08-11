package service

import (
	"context"

	"github.com/obertcoy/tpa-web/graph/model"
	"gorm.io/gorm"
)

func GetPost(ctx context.Context, id string) (*model.Post, error) {
	var post *model.Post
	return post, db.
		Preload("Comment", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC")
		}).
		Preload("Comment.LikedBy").
		Preload("Comment.Replies", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC")
		}).
		Preload("LikedBy").
		Preload("SharedBy").
		Preload("Tagged").
		First(&post, "id = ?", id).Error
}

func GetReplies(ctx context.Context, parentID string) ([]*model.Comment, error) {
	var replies []*model.Comment
	return replies, db.Find(&replies).Where("parent_id = ?", parentID).Error
}

func GetComment(ctx context.Context, id string) (*model.Comment, error) {
	var comment *model.Comment
	return comment, db.Preload("Replies").Preload("LikedBy").First(&comment, "id = ?", id).Error
}
