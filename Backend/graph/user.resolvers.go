package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.36

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/obertcoy/tpa-web/graph/model"
	"github.com/obertcoy/tpa-web/graph/service"
	"github.com/obertcoy/tpa-web/helper"
)

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, inputUser model.NewUser) (*model.User, error) {
	activateToken := uuid.NewString()

	user := &model.User{
		ID:            uuid.NewString(),
		FirstName:     inputUser.FirstName,
		LastName:      inputUser.LastName,
		Email:         inputUser.Email,
		Gender:        inputUser.Gender,
		Dob:           inputUser.Dob,
		Password:      helper.EncryptPassword(inputUser.Password),
		Activated:     false,
		ActivateToken: activateToken,
		ForgotToken:   uuid.NewString(),
	}

	helper.SendMail("Activate Account", activateToken)

	return user, r.Database.Save(&user).Error
}

// ActivateUser is the resolver for the activateUser field.
func (r *mutationResolver) ActivateUser(ctx context.Context, token string) (bool, error) {
	user, err := service.GetUserByActivateToken(ctx, token)

	if err != nil {
		return false, err
	}

	if token != user.ActivateToken {
		return false, err
	}

	user.Activated = true
	return true, r.Database.Save(&user).Error
}

// SendChangePassword is the resolver for the sendChangePassword field.
func (r *mutationResolver) SendChangePassword(ctx context.Context, email string) (bool, error) {
	user, err := service.GetUserByEmail(ctx, email)

	if err != nil {
		return false, err
	}

	helper.SendMail("Forgot Password", user.ForgotToken)

	return true, nil
}

// VerifyChangePasswordToken is the resolver for the verifyChangePasswordToken field.
func (r *mutationResolver) VerifyChangePasswordToken(ctx context.Context, email string, token string) (bool, error) {
	user, err := service.GetUserByEmail(ctx, email)

	if err != nil {
		return false, err
	}

	if token != user.ForgotToken {
		return false, err
	}

	return true, err
}

// ChangePassword is the resolver for the changePassword field.
func (r *mutationResolver) ChangePassword(ctx context.Context, email string, newPassword string) (bool, error) {
	user, err := service.GetUserByEmail(ctx, email)

	if err != nil {
		return false, err
	}

	user.Password = helper.EncryptPassword(newPassword)
	return true, r.Database.Save(&user).Error
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, id string, inputUser model.NewUser) (*model.User, error) {
	var user *model.User
	if err := r.Database.First(&user, "id = ?", id).Error; err != nil {
		return nil, err
	}
	user.FirstName = inputUser.FirstName
	user.LastName = inputUser.LastName
	user.Email = inputUser.Email
	user.Dob = inputUser.Dob
	user.Password = helper.EncryptPassword(inputUser.Password)

	return user, r.Database.Save(&user).Error
}

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, id string) (*model.User, error) {
	var user *model.User
	if err := r.Database.First(&user, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return user, r.Database.Delete(&user).Error
}

// LoginUser is the resolver for the loginUser field.
func (r *mutationResolver) LoginUser(ctx context.Context, inputCredential model.LoginCredential) (*model.UserAuthorization, error) {
	user, err := service.GetActiveUserByEmail(ctx, inputCredential.Email)

	if err != nil {
		return nil, err
	}

	if helper.CheckPassword(user.Password, inputCredential.Password) {

		token, tokenErr := helper.GenerateJWTToken(user.ID)

		if tokenErr != nil {
			return nil, err
		}

		userAuthorization := &model.UserAuthorization{
			User:  user,
			Token: token,
		}

		fmt.Println(user, token)

		return userAuthorization, err
	}

	return nil, err
}

// GetUser is the resolver for the getUser field.
func (r *queryResolver) GetUser(ctx context.Context, id string) (*model.User, error) {
	return service.GetUser(ctx, id)
}

// GetAllUser is the resolver for the getAllUser field.
func (r *queryResolver) GetAllUser(ctx context.Context) ([]*model.User, error) {
	var users []*model.User

	return users, r.Database.Preload("Friend").Find(&users).Error
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }