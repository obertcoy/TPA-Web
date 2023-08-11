package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.36

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/obertcoy/tpa-web/graph/model"
	"github.com/obertcoy/tpa-web/graph/service"
)

// CreateStory is the resolver for the createStory field.
func (r *mutationResolver) CreateStory(ctx context.Context, inputStory model.NewStory) (*model.Story, error) {
	userID := ctx.Value("TokenHeader").(string)

	story := &model.Story{
		ID:        uuid.NewString(),
		FileURL:   inputStory.FileURL,
		CreatedAt: time.Now(),
		UserID:    userID,
	}

	return story, r.Database.Save(&story).Error
}

// DeleteStory is the resolver for the deleteStory field.
func (r *mutationResolver) DeleteStory(ctx context.Context, storyID string) (bool, error) {
	story, err := service.GetStory(ctx, storyID)
	if err != nil {
		return false, err
	}

	return true, r.Database.Delete(&story).Error
}

// GetUserStory is the resolver for the getUserStory field.
func (r *queryResolver) GetUserStory(ctx context.Context, userID string) ([]*model.Story, error) {
	var stories []*model.Story
	_, err := service.GetUser(ctx, userID)

	if err != nil {
		return nil, err
	}

	return stories, r.Database.Where("user_id = ?", userID).Order("created_at DESC").Find(&stories).Error
}

// GetAllStory is the resolver for the getAllStory field.
func (r *queryResolver) GetAllStory(ctx context.Context) ([]*model.Story, error) {
	var stories []*model.Story

	return stories, r.Database.Order("created_at DESC").Find(&stories).Error
}

// User is the resolver for the user field.
func (r *storyResolver) User(ctx context.Context, obj *model.Story) (*model.User, error) {
	return service.GetUser(ctx, obj.UserID)
}

// Story returns StoryResolver implementation.
func (r *Resolver) Story() StoryResolver { return &storyResolver{r} }

type storyResolver struct{ *Resolver }