package database

import (
	"github.com/obertcoy/tpa-web/graph/model"
	"github.com/obertcoy/tpa-web/helper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var database *gorm.DB

const defaultDatabase = "host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"

func GetInstance() *gorm.DB {

	if database == nil {

		dsn := helper.GetEnvVariable("DATABASE_URL")

		if dsn == "" {
			dsn = defaultDatabase
		}

		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

		if err != nil {
			panic(err)
		}

		database = db

	}

	return database
}

func MigrateTable() {

	db := GetInstance()
	db.AutoMigrate(&model.User{}, &model.Post{},  &model.Reel{}, &model.Comment{}, &model.ReelComment{}, &model.Story{},
		&model.Notification{}, &model.ChatRoom{}, &model.Chat{}, &model.Group{}, &model.UserGroupRole{}, &model.GroupFile{})

}
