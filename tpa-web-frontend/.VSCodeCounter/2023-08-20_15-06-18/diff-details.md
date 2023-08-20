# Diff Details

Date : 2023-08-20 15:06:18

Directory c:\\TPA\\TPA-Web\\tpa-web-frontend

Total : 62 files,  5022 codes, 244 comments, 995 blanks, all 6261 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [package-lock.json](/package-lock.json) | JSON | 336 | 0 | 0 | 336 |
| [package.json](/package.json) | JSON | 12 | 0 | 0 | 12 |
| [src/App.tsx](/src/App.tsx) | TypeScript JSX | 6 | 5 | 0 | 11 |
| [src/helper/TextHelper.tsx](/src/helper/TextHelper.tsx) | TypeScript JSX | 39 | 0 | 12 | 51 |
| [src/helper/UserHelper.tsx](/src/helper/UserHelper.tsx) | TypeScript JSX | 4 | 0 | 1 | 5 |
| [src/index.css](/src/index.css) | CSS | 3 | 0 | 2 | 5 |
| [src/model/ChatModel.tsx](/src/model/ChatModel.tsx) | TypeScript JSX | 16 | 0 | 4 | 20 |
| [src/model/GroupModel.tsx](/src/model/GroupModel.tsx) | TypeScript JSX | 27 | 0 | 4 | 31 |
| [src/model/NotificationModel.tsx](/src/model/NotificationModel.tsx) | TypeScript JSX | 9 | 0 | 1 | 10 |
| [src/model/PostModel.tsx](/src/model/PostModel.tsx) | TypeScript JSX | 2 | 0 | 0 | 2 |
| [src/model/UserModel.tsx](/src/model/UserModel.tsx) | TypeScript JSX | 3 | 0 | 1 | 4 |
| [src/page/component/ChatRoomComponent.tsx](/src/page/component/ChatRoomComponent.tsx) | TypeScript JSX | 100 | 0 | 18 | 118 |
| [src/page/component/EditorText.tsx](/src/page/component/EditorText.tsx) | TypeScript JSX | 59 | 1 | 13 | 73 |
| [src/page/component/FriendProfile.tsx](/src/page/component/FriendProfile.tsx) | TypeScript JSX | 272 | 2 | 51 | 325 |
| [src/page/component/FriendsNavbar.tsx](/src/page/component/FriendsNavbar.tsx) | TypeScript JSX | 81 | 0 | 18 | 99 |
| [src/page/component/GroupProfile.tsx](/src/page/component/GroupProfile.tsx) | TypeScript JSX | 140 | 191 | 36 | 367 |
| [src/page/component/MasterLayout.tsx](/src/page/component/MasterLayout.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [src/page/component/MentionComponent.tsx](/src/page/component/MentionComponent.tsx) | TypeScript JSX | 85 | 0 | 21 | 106 |
| [src/page/component/Navbar.tsx](/src/page/component/Navbar.tsx) | TypeScript JSX | 123 | 0 | 16 | 139 |
| [src/page/component/ReelNavbar.tsx](/src/page/component/ReelNavbar.tsx) | TypeScript JSX | -45 | 0 | -13 | -58 |
| [src/page/component/card/CommentCard.tsx](/src/page/component/card/CommentCard.tsx) | TypeScript JSX | 6 | 2 | -1 | 7 |
| [src/page/component/card/PostCard.tsx](/src/page/component/card/PostCard.tsx) | TypeScript JSX | 37 | 0 | 5 | 42 |
| [src/page/component/card/ReplyCard.tsx](/src/page/component/card/ReplyCard.tsx) | TypeScript JSX | 7 | 2 | -1 | 8 |
| [src/page/component/card/UserChat.tsx](/src/page/component/card/UserChat.tsx) | TypeScript JSX | 52 | 0 | 9 | 61 |
| [src/page/component/card/css/CommentCard.module.scss](/src/page/component/card/css/CommentCard.module.scss) | SCSS | 8 | 1 | -1 | 8 |
| [src/page/component/card/css/PostCard.module.scss](/src/page/component/card/css/PostCard.module.scss) | SCSS | 2 | 0 | 2 | 4 |
| [src/page/component/card/css/ReplyCard.module.scss](/src/page/component/card/css/ReplyCard.module.scss) | SCSS | 8 | 3 | 0 | 11 |
| [src/page/component/card/css/UserChat.module.scss](/src/page/component/card/css/UserChat.module.scss) | SCSS | 61 | 0 | 20 | 81 |
| [src/page/component/css/ChatRoomComponent.module.scss](/src/page/component/css/ChatRoomComponent.module.scss) | SCSS | 117 | 4 | 33 | 154 |
| [src/page/component/css/EditorText.module.scss](/src/page/component/css/EditorText.module.scss) | SCSS | 16 | 3 | 3 | 22 |
| [src/page/component/css/FriendProfile.module.scss](/src/page/component/css/FriendProfile.module.scss) | SCSS | 445 | 1 | 131 | 577 |
| [src/page/component/css/FriendsNavbar.module.scss](/src/page/component/css/FriendsNavbar.module.scss) | SCSS | 112 | 0 | 36 | 148 |
| [src/page/component/css/GroupProfile.module.scss](/src/page/component/css/GroupProfile.module.scss) | SCSS | 420 | 1 | 120 | 541 |
| [src/page/component/css/Navbar.module.scss](/src/page/component/css/Navbar.module.scss) | SCSS | 178 | 0 | 50 | 228 |
| [src/page/component/css/ReelNavbar.module.scss](/src/page/component/css/ReelNavbar.module.scss) | SCSS | -86 | 0 | -28 | -114 |
| [src/page/component/modal/CreateGroupModal.tsx](/src/page/component/modal/CreateGroupModal.tsx) | TypeScript JSX | 67 | 1 | 12 | 80 |
| [src/page/component/modal/CreatePostModal.tsx](/src/page/component/modal/CreatePostModal.tsx) | TypeScript JSX | 163 | 1 | 21 | 185 |
| [src/page/component/modal/InviteGroupModal.tsx](/src/page/component/modal/InviteGroupModal.tsx) | TypeScript JSX | 112 | 0 | 14 | 126 |
| [src/page/component/modal/PostModal.tsx](/src/page/component/modal/PostModal.tsx) | TypeScript JSX | 19 | 1 | 4 | 24 |
| [src/page/component/modal/css/CreateGroupModal.module.scss](/src/page/component/modal/css/CreateGroupModal.module.scss) | SCSS | 243 | 0 | 67 | 310 |
| [src/page/component/modal/css/CreatePostModal.module.scss](/src/page/component/modal/css/CreatePostModal.module.scss) | SCSS | 147 | 0 | 36 | 183 |
| [src/page/component/modal/css/InviteGroupModal.module.scss](/src/page/component/modal/css/InviteGroupModal.module.scss) | SCSS | 145 | 0 | 35 | 180 |
| [src/page/css/ChatsPage.module.scss](/src/page/css/ChatsPage.module.scss) | SCSS | 112 | 2 | 34 | 148 |
| [src/page/css/FriendsPage.module.scss](/src/page/css/FriendsPage.module.scss) | SCSS | 118 | 0 | 41 | 159 |
| [src/page/css/GroupsPage.module.scss](/src/page/css/GroupsPage.module.scss) | SCSS | 114 | 0 | 35 | 149 |
| [src/page/css/HomePage.module.scss](/src/page/css/HomePage.module.scss) | SCSS | 4 | 0 | 1 | 5 |
| [src/page/css/NotificicationPage.module.scss](/src/page/css/NotificicationPage.module.scss) | SCSS | 77 | 0 | 18 | 95 |
| [src/page/css/ReelPage.module.scss](/src/page/css/ReelPage.module.scss) | SCSS | 0 | 0 | 1 | 1 |
| [src/page/css/UserProfilePage.module.scss](/src/page/css/UserProfilePage.module.scss) | SCSS | 43 | 0 | 8 | 51 |
| [src/page/main/ChatsPage.tsx](/src/page/main/ChatsPage.tsx) | TypeScript JSX | 102 | 0 | 18 | 120 |
| [src/page/main/FriendsPage.tsx](/src/page/main/FriendsPage.tsx) | TypeScript JSX | 96 | 0 | 18 | 114 |
| [src/page/main/GroupsPage.tsx](/src/page/main/GroupsPage.tsx) | TypeScript JSX | 84 | 0 | 20 | 104 |
| [src/page/main/NotificationsPage.tsx](/src/page/main/NotificationsPage.tsx) | TypeScript JSX | 81 | 0 | 11 | 92 |
| [src/page/main/UserProfilePage.tsx](/src/page/main/UserProfilePage.tsx) | TypeScript JSX | 57 | 23 | 10 | 90 |
| [src/page/main/story/StoryPage.tsx](/src/page/main/story/StoryPage.tsx) | TypeScript JSX | 0 | 0 | -2 | -2 |
| [src/provider/ApolloProvider.tsx](/src/provider/ApolloProvider.tsx) | TypeScript JSX | 24 | 0 | 2 | 26 |
| [src/query/ChatQuery.tsx](/src/query/ChatQuery.tsx) | TypeScript JSX | 119 | 0 | 5 | 124 |
| [src/query/GroupQuery.tsx](/src/query/GroupQuery.tsx) | TypeScript JSX | 194 | 0 | 15 | 209 |
| [src/query/NotificationQuery.tsx](/src/query/NotificationQuery.tsx) | TypeScript JSX | 28 | 0 | 2 | 30 |
| [src/query/PostQuery.tsx](/src/query/PostQuery.tsx) | TypeScript JSX | 125 | 0 | 3 | 128 |
| [src/query/UserQuery.tsx](/src/query/UserQuery.tsx) | TypeScript JSX | 84 | 0 | 4 | 88 |
| [vite.config.ts](/vite.config.ts) | TypeScript | 8 | 0 | -1 | 7 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details