package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"
	"github.com/obertcoy/tpa-web/database"
	"github.com/obertcoy/tpa-web/graph"
	"github.com/obertcoy/tpa-web/helper"
	"github.com/obertcoy/tpa-web/middleware"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

const defaultPort = "8080"
var router = mux.NewRouter()


func graphQL(port string) {
	config := graph.Config{Resolvers: &graph.Resolver{Database: database.GetInstance()}}

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

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(config))


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
