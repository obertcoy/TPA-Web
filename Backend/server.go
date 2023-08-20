package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/obertcoy/tpa-web/database"
	"github.com/obertcoy/tpa-web/graph"
	"github.com/obertcoy/tpa-web/graph/resolver"
	"github.com/obertcoy/tpa-web/helper"
	"github.com/obertcoy/tpa-web/middleware"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

const defaultPort = "8080"
var router = mux.NewRouter()


func graphQL(port string) {
	config := graph.Config{Resolvers: &resolver.Resolver{Database: database.GetInstance()}}

	config.Directives.Auth = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {

		token := ctx.Value("TokenHeader")

		if token == nil {
			return nil, &gqlerror.Error{
				Message: "Please Login!",
			}
		}
		ctx = context.WithValue(ctx, "TokenHeader", token)
		return next(ctx)
	}

	srv := handler.New(graph.NewExecutableSchema(config))
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{})
	srv.Use(extension.Introspection{})

	srv.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		InitFunc: func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {

			fmt.Println(initPayload.Authorization())
			userID, err := helper.VerifyJWTToken(initPayload.Authorization())
			if err == nil {
				ctx = context.WithValue(ctx, "TokenHeader", userID)
			}
			ctx = context.WithValue(ctx, "TokenHeader", userID)
			return ctx, nil
		},
	})

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{helper.GetEnvVariable("FRONTEND_URL"), "http://localhost:8080"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	router.Use(middleware.AuthMiddleware)
	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	database.MigrateTable()

	graphQL(port)
}
