package helper

import (
	"fmt"
	"log"
	"net/smtp"
	"os"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func GetEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return os.Getenv(key)
}

func GenerateJWTToken(userID string) (string, error) {

	secretKey := GetEnvVariable("JWT_SECRET_KEY")
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["userID"] = userID

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, err
}

func VerifyJWTToken(token string) (string, error) {

	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {

		secret := []byte(GetEnvVariable("JWT_SECRET_KEY"))
		return secret, nil
	})

	if parsedToken.Valid {

		claims := parsedToken.Claims.(jwt.MapClaims)
		userID := claims["userID"].(string)
		fmt.Println("Token Valid")
		return userID, nil
	}
	fmt.Println("token invalid")
	return "", err
}

func EncryptPassword(password string) []byte{

	salt := GetEnvVariable("SALT")
	saltedPassword := append([]byte(password), salt...)
	hashedPassword, err := bcrypt.GenerateFromPassword(saltedPassword, bcrypt.DefaultCost)

	if err != nil {
		fmt.Println("Error generating hash:", err)
		return nil
	}

	return hashedPassword
}

func CheckPassword(DBpassword []byte, inputPassword string) bool{

	salt := GetEnvVariable("SALT")
	saltedInputPassword := append([]byte(inputPassword), salt...)
	err := bcrypt.CompareHashAndPassword(DBpassword, saltedInputPassword)

	if err != nil {
		fmt.Println("check failed")
		return false
	}
	fmt.Println("check success")
	return true
}

func SendMail(subject string, token string){
	
	from := GetEnvVariable("MAIL_USERNAME")
	pass := GetEnvVariable("MAIL_PASSWORD")
	host := GetEnvVariable("MAIL_HOST")
	port := GetEnvVariable("MAIL_PORT")

	headers := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";"
	var body string

	if subject == "Activate Account"{
		page := "activate"
		body = fmt.Sprintf("<a href = \"%s/%s/%s\">Activate your account</a>", GetEnvVariable("FRONTEND_URL"), page, token)
	} else if subject == "Forgot Password"{
		page := "change_password"
		body = fmt.Sprintf("<a href = \"%s/%s/%s\">Change your password</a>", GetEnvVariable("FRONTEND_URL"), page, token)
	}

	msg := "Subject:  " + subject + "\n" + headers + "\n\n" + body

	auth := smtp.PlainAuth("", from, pass, host)
	err := smtp.SendMail(host + ":" + port, auth, from, []string{"laisobert@gmail.com"}, []byte(msg))

	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("email sent")
}