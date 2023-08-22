package model

type SearchResult struct {
	Users  []*User  `json:"users,omitempty"`
	Posts  []*Post  `json:"posts,omitempty"`
	Groups []*Group `json:"groups,omitempty"`
}