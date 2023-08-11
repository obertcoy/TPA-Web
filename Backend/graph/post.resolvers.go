package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.36

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/obertcoy/tpa-web/graph/model"
	"github.com/obertcoy/tpa-web/graph/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
)

// User is the resolver for the user field.
func (r *commentResolver) User(ctx context.Context, obj *model.Comment) (*model.User, error) {
	return service.GetUser(ctx, obj.UserID)
}

// Replies is the resolver for the replies field.
func (r *commentResolver) Replies(ctx context.Context, obj *model.Comment) ([]*model.Comment, error) {
	// if obj.ParentID != nil {
	// 	return service.GetReplies(ctx, *obj.ParentID)
	// }
	// return nil, nil
	return obj.Replies, nil
}

// CreatePost is the resolver for the createPost field.
func (r *mutationResolver) CreatePost(ctx context.Context, inputPost model.NewPost) (*model.Post, error) {
	userID := ctx.Value("TokenHeader")
	fmt.Println(userID)
	var fileUrl []*string = nil
	var taggedUsers []*model.User = nil

	if inputPost.FileURL != nil {
		for _, url := range inputPost.FileURL {
			if url != nil {
				fileUrl = append(fileUrl, url)
			}
		}
	}
	if inputPost.TaggedID != nil {
		for _, userID := range inputPost.TaggedID {
			if userID != nil {
				taggedUser, _ := service.GetUser(ctx, *userID)
				taggedUsers = append(taggedUsers, taggedUser)
			}
		}
	}

	post := &model.Post{
		ID:        uuid.NewString(),
		Text:      inputPost.Text,
		FileURL:   fileUrl,
		UserID:    userID.(string),
		CreatedAt: time.Now(),
		Type:      inputPost.Type,
		Tagged:    taggedUsers,
	}

	return post, r.Database.Save(&post).Error
}

// CreateComment is the resolver for the createComment field.
func (r *mutationResolver) CreateComment(ctx context.Context, inputComment model.NewComment, postID string) (*model.Comment, error) {
	userID := ctx.Value("TokenHeader").(string)
	var parentID *string = nil

	if inputComment.ParentID != nil {
		parentID = inputComment.ParentID
	}

	comment := &model.Comment{
		ID:        uuid.NewString(),
		PostID:    postID,
		Text:      inputComment.Text,
		CreatedAt: time.Now(),
		UserID:    userID,
		ParentID:  parentID,
	}

	return comment, r.Database.Save(&comment).Error
}

// LikePost is the resolver for the likePost field.
func (r *mutationResolver) LikePost(ctx context.Context, postID string) (bool, error) {
	userID := ctx.Value("TokenHeader")
	user, _ := service.GetUser(ctx, userID.(string))
	post, _ := service.GetPost(ctx, postID)

	if user == nil || post == nil {
		return false, gqlerror.Errorf("Error like post")
	}

	post.LikedBy = append(post.LikedBy, user)
	return true, r.Database.Save(&post).Error
}

// UnlikePost is the resolver for the unlikePost field.
func (r *mutationResolver) UnlikePost(ctx context.Context, postID string) (bool, error) {
	userID := ctx.Value("TokenHeader").(string)
	user, userErr := service.GetUser(ctx, userID)
	post, postErr := service.GetPost(ctx, postID)

	if userErr != nil || postErr != nil {
		return false, gqlerror.Errorf("Error fetching")
	}

	err := r.Database.Debug().Model(&post).Association("LikedBy").Delete(user)
	if err != nil {
		return false, fmt.Errorf("Error retrieving post: %v", err)
	}
	return true, nil
}

// LikeComment is the resolver for the likeComment field.
func (r *mutationResolver) LikeComment(ctx context.Context, commentID string) (bool, error) {
	userID := ctx.Value("TokenHeader").(string)
	user, _ := service.GetUser(ctx, userID)
	comment, _ := service.GetComment(ctx, commentID)

	if user == nil || comment == nil {
		return false, gqlerror.Errorf("Error like post")
	}

	comment.LikedBy = append(comment.LikedBy, user)
	return true, r.Database.Save(&comment).Error
}

// UnlikeComment is the resolver for the unlikeComment field.
func (r *mutationResolver) UnlikeComment(ctx context.Context, commentID string) (bool, error) {
	userID := ctx.Value("TokenHeader").(string)
	user, userErr := service.GetUser(ctx, userID)
	comment, postErr := service.GetComment(ctx, commentID)

	if userErr != nil || postErr != nil {
		return false, gqlerror.Errorf("Error fetching")
	}

	err := r.Database.Debug().Model(&comment).Association("LikedBy").Delete(user)
	if err != nil {
		return false, fmt.Errorf("Error retrieving post: %v", err)
	}
	return true, nil
}

// SharePost is the resolver for the sharePost field.
func (r *mutationResolver) SharePost(ctx context.Context, postID string, sharedTo string) (bool, error) {
	panic(fmt.Errorf("not implemented: SharePost - sharePost"))
}

// User is the resolver for the user field.
func (r *postResolver) User(ctx context.Context, obj *model.Post) (*model.User, error) {
	return service.GetUser(ctx, obj.UserID)
}

// Comment is the resolver for the comment field.
func (r *postResolver) Comment(ctx context.Context, obj *model.Post) ([]*model.Comment, error) {
	return obj.Comment, nil
}

// GetAllPost is the resolver for the getAllPost field.
func (r *queryResolver) GetAllPost(ctx context.Context) ([]*model.Post, error) {
	var posts []*model.Post

	return posts, r.Database.
		Order("created_at DESC").
		Preload("Comment", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC")
		}).
		Preload("Comment.LikedBy").
		Preload("Comment.Replies").
		Preload("LikedBy").
		Preload("SharedBy").
		Preload("Tagged").
		Find(&posts).Error
}

// GetPost is the resolver for the getPost field.
func (r *queryResolver) GetPost(ctx context.Context, id string) (*model.Post, error) {
	return service.GetPost(ctx, id)
}

// GetComment is the resolver for the getComment field.
func (r *queryResolver) GetComment(ctx context.Context, id string) (*model.Comment, error) {
	panic(fmt.Errorf("not implemented: GetComment - getComment"))
}

// Comment returns CommentResolver implementation.
func (r *Resolver) Comment() CommentResolver { return &commentResolver{r} }

// Post returns PostResolver implementation.
func (r *Resolver) Post() PostResolver { return &postResolver{r} }

type commentResolver struct{ *Resolver }
type postResolver struct{ *Resolver }