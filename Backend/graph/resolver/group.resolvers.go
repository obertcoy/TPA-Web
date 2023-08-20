package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.36

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/obertcoy/tpa-web/graph"
	"github.com/obertcoy/tpa-web/graph/model"
	"github.com/obertcoy/tpa-web/graph/service"
)

// User is the resolver for the user field.
func (r *groupResolver) User(ctx context.Context, obj *model.Group) ([]*model.User, error) {
	return obj.User, nil
}

// GroupFile is the resolver for the groupFile field.
func (r *groupResolver) GroupFile(ctx context.Context, obj *model.Group) ([]*model.GroupFile, error) {
	return obj.GroupFile, nil
}

// User is the resolver for the user field.
func (r *groupFileResolver) User(ctx context.Context, obj *model.GroupFile) (*model.User, error) {
	return obj.User, nil
}

// User is the resolver for the user field.
func (r *groupUserResolver) User(ctx context.Context, obj *model.GroupUser) (*model.User, error) {
	return obj.User, nil
}

// CreateGroup is the resolver for the createGroup field.
func (r *mutationResolver) CreateGroup(ctx context.Context, inputGroup model.NewGroup) (*model.Group, error) {
	userID := ctx.Value("TokenHeader").(string)
	user, err := service.GetUser(ctx, userID)

	if err != nil {
		return nil, err
	}

	var users []*model.User
	users = append(users, user)

	groupID := uuid.NewString()

	group := &model.Group{
		ID:        groupID,
		Name:      inputGroup.Name,
		User:      users,
		Private:   inputGroup.Private,
		CreatedAt: time.Now(),
	}

	err = r.Database.Save(&group).Error
	if err != nil {
		return nil, err
	}
	
	userRole := &model.UserGroupRole{
		UserID:  userID,
		GroupID: groupID,
		Role:    "Admin",
	}

	err = r.Database.Save(&userRole).Error
	if err != nil {
		return nil, err
	}

	var usersID []string
	usersID = append(usersID, userID)

	chatRoom := &model.NewChatRoom{
		UserID: usersID,
		GroupID: &groupID,
	}
	_, err = r.CreateChatRoom(ctx, *chatRoom)
	if err != nil {
		return nil, err
	}
	
	return group, nil
}

// PromoteMember is the resolver for the promoteMember field.
func (r *mutationResolver) PromoteMember(ctx context.Context, groupID string, userID string) (bool, error) {
	userRole := &model.UserGroupRole{
		UserID:  userID,
		GroupID: userID,
		Role:    "Admin",
	}

	return true, r.Database.Save(&userRole).Error
}

// ApproveRequest is the resolver for the approveRequest field.
func (r *mutationResolver) ApproveRequest(ctx context.Context, groupID string, userID string) (bool, error) {
	user, userErr := service.GetUser(ctx, userID)

	if userErr != nil {
		return false, userErr
	}

	group, groupErr := service.GetGroup(ctx, groupID)

	if groupErr != nil {
		return false, groupErr
	}

	group.User = append(group.User, user)

	userRole := &model.UserGroupRole{
		UserID:  userID,
		GroupID: userID,
		Role:    "Member",
	}

	err := r.Database.Save(&group).Error
	if err != nil {
		return false, err
	}

	err = r.Database.Save(&userRole).Error
	if err != nil {
		return false, err
	}

	err = r.Database.Model(&group).Association("PendingUser").Delete(&user)
	if err != nil {
		return false, err
	}

	return true, nil
}

// KickMember is the resolver for the kickMember field.
func (r *mutationResolver) KickMember(ctx context.Context, groupID string, userID string) (bool, error) {
	user, userErr := service.GetUser(ctx, userID)

	if userErr != nil {
		return false, userErr
	}

	group, groupErr := service.GetGroup(ctx, groupID)

	if groupErr != nil {
		return false, groupErr
	}

	err := r.Database.Model(&group).Association("User").Delete(&user)

	if err != nil {
		return false, err
	}

	err = r.Database.Where("user_id = ? AND group_id = ?", userID, groupID).Delete(&model.UserGroupRole{}).Error

	if err != nil {
		return false, err
	}

	return true, nil
}

// EditGroupBanner is the resolver for the editGroupBanner field.
func (r *mutationResolver) EditGroupBanner(ctx context.Context, groupID string, fileURL string) (bool, error) {
	group, groupErr := service.GetGroup(ctx, groupID)

	if groupErr != nil {
		return false, groupErr
	}
	group.BannerImageURL = &fileURL
	return true, r.Database.Save(&group).Error
}

// DeleteGroupFile is the resolver for the deleteGroupFile field.
func (r *mutationResolver) DeleteGroupFile(ctx context.Context, groupID string, fileID string) (bool, error) {
	group, groupErr := service.GetGroup(ctx, groupID)

	if groupErr != nil {
		return false, groupErr
	}

	file, err := service.GetGroupFile(ctx, fileID)

	if err != nil {
		return false, err
	}
	err = r.Database.Delete(&file).Error

	if err != nil {
		return false, err
	}

	return true, r.Database.Save(&group).Error
}

// InviteFriend is the resolver for the inviteFriend field.
func (r *mutationResolver) InviteFriend(ctx context.Context, groupID string, userID string) (bool, error) {
	user, err := service.GetUser(ctx, userID)
	if err != nil {
		return false, err
	}

	group, groupErr := service.GetGroup(ctx, groupID)

	if groupErr != nil {
		return false, groupErr
	}

	err = r.Database.Model(&user).Association("GroupInvite").Append(&group)
	if err != nil {
		return false, err
	}

	return true, nil
}

// RequestJoinGroup is the resolver for the requestJoinGroup field.
func (r *mutationResolver) RequestJoinGroup(ctx context.Context, groupID string) (bool, error) {
	userID := ctx.Value("TokenHeader").(string)
	user, err := service.GetUser(ctx, userID)
	if err != nil {
		return false, err
	}

	group, groupErr := service.GetGroup(ctx, groupID)

	if groupErr != nil {
		return false, groupErr
	}

	err = r.Database.Model(&group).Association("PendingUser").Append(&user)
	if err != nil {
		return false, err
	}

	return true, nil
}

// LeaveGroup is the resolver for the leaveGroup field.
func (r *mutationResolver) LeaveGroup(ctx context.Context, groupID string) (bool, error) {
	userID := ctx.Value("TokenHeader").(string)
	user, userErr := service.GetUser(ctx, userID)

	if userErr != nil {
		return false, userErr
	}

	group, err := service.GetGroup(ctx, groupID)

	if err != nil {
		return false, err
	}

	err = r.Database.Model(&group).Association("User").Delete(&user)
	if err != nil {
		return false, err
	}

	return true, nil
}

// GetAllUserGroup is the resolver for the getAllUserGroup field.
func (r *queryResolver) GetAllUserGroup(ctx context.Context) ([]*model.Group, error) {
	userID := ctx.Value("TokenHeader").(string)
	return service.GetUserGroup(ctx, userID)
}

// GetGroup is the resolver for the getGroup field.
func (r *queryResolver) GetGroup(ctx context.Context, groupID string) (*model.Group, error) {
	return service.GetGroup(ctx, groupID)
}

// GetAllGroupFile is the resolver for the getAllGroupFile field.
func (r *queryResolver) GetAllGroupFile(ctx context.Context, groupID string) ([]*model.GroupFile, error) {
	panic(fmt.Errorf("not implemented: GetAllGroupFile - getAllGroupFile"))
}

// CheckAdminUser is the resolver for the checkAdminUser field.
func (r *queryResolver) CheckAdminUser(ctx context.Context, groupID string) (bool, error) {
	userID := ctx.Value("TokenHeader").(string)
	var userRole *model.UserGroupRole
	err := r.Database.Where("group_id = ? AND user_id = ?", groupID, userID).First(&userRole).Error

	if err != nil {
		return false, err
	}

	return userRole.Role == "Admin", nil
}

// GetAllGroupUser is the resolver for the getAllGroupUser field.
func (r *queryResolver) GetAllGroupUser(ctx context.Context, groupID string) ([]*model.GroupUser, error) {
	var userRoles []*model.UserGroupRole
	err := r.Database.Where("group_id = ?", groupID).Find(&userRoles).Error
	if err != nil {
		return nil, err
	}

	var groupUsers []*model.GroupUser

	for _, userRole := range userRoles {
		user, err := service.GetUser(ctx, userRole.UserID)
		if err != nil {
			return nil, err
		}

		groupUser := &model.GroupUser{
			User: user,
			Role: userRole.Role,
		}
		groupUsers = append(groupUsers, groupUser)
	}

	return groupUsers, nil
}

// Group returns graph.GroupResolver implementation.
func (r *Resolver) Group() graph.GroupResolver { return &groupResolver{r} }

// GroupFile returns graph.GroupFileResolver implementation.
func (r *Resolver) GroupFile() graph.GroupFileResolver { return &groupFileResolver{r} }

// GroupUser returns graph.GroupUserResolver implementation.
func (r *Resolver) GroupUser() graph.GroupUserResolver { return &groupUserResolver{r} }

type groupResolver struct{ *Resolver }
type groupFileResolver struct{ *Resolver }
type groupUserResolver struct{ *Resolver }