package service

import (
	"context"

	"github.com/obertcoy/tpa-web/graph/model"
)

func GetNotification(ctx context.Context, id string) (*model.Notification, error) {
	var notif *model.Notification
	return notif, db.First(&notif, "id = ?", id).Error
}
