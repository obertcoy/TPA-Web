package service

import (
	"context"
	"fmt"

	"github.com/obertcoy/tpa-web/graph/model"
	"gorm.io/gorm"
)

func GetChat(ctx context.Context, id string) ([]*model.Chat, error) {
	var chat []*model.Chat
	return chat, db.Order("created_at ASC").Where("chat_room_id = ?", id).Preload("User").
	Preload("Post.Comment", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at DESC")
	}).
	Preload("Post.Comment.LikedBy").
	Preload("Post.Comment.Replies").
	Preload("Post.LikedBy").
	Preload("Post.SharedBy").
	Preload("Post.Tagged").
	Preload("Post.Group").
	Find(&chat).Error
}

func GetChatRoomByUser(ctx context.Context, userID []string, groupID *string) (*model.ChatRoom, error) {
	var room *model.ChatRoom

	if groupID == nil {
		fmt.Println(len(userID), "LEN USER ID")

		subquery := db.Table("chatroom_users").Select("chat_room_id").Where("user_id IN ?", userID).Group("chat_room_id").
			Having("COUNT(DISTINCT user_id) = ?", len(userID))

		err := db.Debug().Where("id IN (?)", subquery).Preload("Chat", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC").Preload("User").Preload("Post")
		}).Preload("User").Preload("Group").First(&room).Error

		if err != nil {
			return nil, err
		}

	} else {
		err := db.Where("group_id = ?", groupID).Preload("Chat", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC").Preload("User").Preload("Post").Limit(1)
		}).Preload("User").Preload("Group").First(&room).Error

		if err != nil {
			return nil, err
		}
	}

	return room, nil
}

func GetChatRoom(ctx context.Context, id string) (*model.ChatRoom, error) {
	var room *model.ChatRoom
	err := db.Where("id = ?", id).Preload("User").Preload("Chat", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at DESC").Preload("User").Preload("Post").Preload("Post.Comment", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC")
		}).
			Preload("Post.Comment.LikedBy").
			Preload("Post.Comment.Replies").
			Preload("Post.LikedBy").
			Preload("Post.SharedBy").
			Preload("Post.Tagged").
			Preload("Post.Group").Limit(1)
	}).Preload("Group").First(&room).Error
	return room, err
}

func AddUserToGroupChat(ctx context.Context, userID, groupID string) (bool, error){
	
	user, err := GetUser(ctx, userID)

	if err != nil {
		return false, nil
	}

	var usersID []string 
	usersID = append(usersID, userID)
	room, err := GetChatRoomByUser(ctx, usersID, &groupID)
	
	if err != nil {
		return false, err
	}
	
	room.User = append(room.User, user)
	return true, db.Save(&room).Error
}