import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import LoginPage from './page/guest/LoginPage'
import RegisterPage from './page/guest/RegisterPage'
import HomePage from './page/main/HomePage'
import ForgotPage from './page/guest/ForgotPage'
import ActivatePage from './page/guest/ActivatePage'
import ChangePasswordPage from './page/guest/ChangePassword'
import MasterLayout from './page/component/MasterLayout'
import GetApolloProvider from './provider/ApolloProvider'
import { useState, useEffect } from 'react'
import CreateStoryPage from './page/main/story/CreateStoryPage'
import CreatePhotoStoryPage from './page/main/story/CreatePhotoStoryPage'
import CreateTextStoryPage from './page/main/story/CreateTextStoryPage'
import StoryNavbar from './page/component/StoryNavbar'
import StoryPage from './page/main/story/StoryPage'
import CreateReelPage from './page/main/reel/CreateReelPage'
import ReelPage from './page/main/reel/ReelPage'
import UserProfilePage from './page/main/UserProfilePage'
import FriendsPage from './page/main/FriendsPage'
import FriendsNavbar from './page/component/FriendsNavbar'
import ChatsPage from './page/main/ChatsPage'
import GroupsPage from './page/main/GroupsPage'
import NotificationsPage from './page/main/NotificationsPage'
import GroupFullPage from './page/main/GroupFullPage'
import MiddlewareMain from './page/middleware/MiddlewareMain'
import MiddlewareLogin from './page/middleware/MiddlewareLogin'
import SearchPage from './page/main/SearchPage'

function AuthenticatedRoutes() {
  return (
    <MasterLayout>
      <Routes>
        <Route path='home' element={<MiddlewareMain> <HomePage /></MiddlewareMain>}></Route>
        <Route path='friends' element={<MiddlewareMain> <FriendsPage /> </MiddlewareMain>}></Route>
        <Route path='create-story/*' element={<MiddlewareMain> <CreateStoryRoutes /> </MiddlewareMain>} />
        <Route path='stories/*' element={<MiddlewareMain> <StoryPageRoute /> </MiddlewareMain>}></Route>
        <Route path='reels/' element={<MiddlewareMain> <ReelPage /> </MiddlewareMain>}></Route>
        <Route path='create-reel' element={<MiddlewareMain> <CreateReelPage /> </MiddlewareMain>}></Route>
        <Route path='profile/:userID' element={<MiddlewareMain> <UserProfilePage /> </MiddlewareMain>}></Route>
        <Route path='all-friends/*' element={<MiddlewareMain> <FriendsNavbar /> </MiddlewareMain>}></Route>
        <Route path='chats/' element={<MiddlewareMain> <ChatsPage /> </MiddlewareMain>}></Route>
        <Route path='chats/:paramChatRoomID' element={<MiddlewareMain> <ChatsPage /> </MiddlewareMain>}></Route>
        <Route path='groups/' element={<MiddlewareMain> <GroupsPage /> </MiddlewareMain>}></Route>
        <Route path='groups/:groupID' element={<MiddlewareMain> <GroupFullPage /> </MiddlewareMain>}></Route>
        <Route path='notifications/' element={<MiddlewareMain> <NotificationsPage/> </MiddlewareMain>}></Route>
        <Route path='search/:search' element={<MiddlewareMain> <SearchPage/> </MiddlewareMain>}></Route>
      </Routes>
    </MasterLayout>
  );
}

function StoryPageRoute() {

  return (
    <StoryNavbar>
      <Routes>
        <Route path=':userID' element={<StoryPage />}></Route>
      </Routes>
    </StoryNavbar>
  )
}

function CreateStoryRoutes() {
  return (
    <Routes>
      <Route path='select' element={<CreateStoryPage />} />
      <Route path='photo' element={<CreatePhotoStoryPage />} />
      <Route path='text' element={<CreateTextStoryPage />} />
    </Routes>
  )
}


function PublicRoutes() {
  const location = useLocation();
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  useEffect(() => {
    const currentToken = sessionStorage.getItem('token');
    if (currentToken !== token) {
      setToken(currentToken);
    }
  }, [location]);

  return (
    <GetApolloProvider token={token}>
      <Routes>
        <Route path='/login' element={<MiddlewareLogin> <LoginPage /> </MiddlewareLogin>}></Route>
        <Route path='/register' element={<RegisterPage />}></Route>
        <Route path='/forgot' element={<ForgotPage />}></Route>
        <Route path='/activate/:activateToken' element={<ActivatePage />}></Route>
        <Route path='/change_password/:forgotToken' element={<ChangePasswordPage />}></Route>
        <Route path='/main/*' element={<AuthenticatedRoutes />}></Route>
      </Routes>
    </GetApolloProvider>
  )
}


function App() {

  return (
    <BrowserRouter>
      <PublicRoutes />
    </BrowserRouter>
  )
}

export default App
