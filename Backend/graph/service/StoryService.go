package service

import (
	"context"

	"github.com/obertcoy/tpa-web/graph/model"
)

func GetStory(ctx context.Context, id string) (*model.Story, error) {
	var story *model.Story
	return story, db.Order("created_at DESC").First(&story, "id = ?", id).Error
}
