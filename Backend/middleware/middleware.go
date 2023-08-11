package middleware

import (
	"context"
	"fmt"
	"net/http"

	"github.com/obertcoy/tpa-web/helper"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {

		token := request.Header.Get("Authorization")
		
		if token != "" {
			
			userID, err := helper.VerifyJWTToken(token)
			
			if err == nil {
				
				fmt.Println(token, "token header")
				ctx := context.WithValue(request.Context(), "TokenHeader", userID)
				request = request.WithContext(ctx)
			}
		}
		next.ServeHTTP(writer, request)
	})
}
