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

function AuthenticatedRoutes() {
  return (
    <MasterLayout>
      <Routes>
        <Route path='home' element={<HomePage />}></Route>
        <Route path='create-story/*' element={<CreateStoryRoutes />} />
        <Route path='*' element={<StoryPageRoute />}></Route>
      </Routes>
    </MasterLayout>
  );
}

function StoryPageRoute() {

  return (
    <StoryNavbar>
      <Routes>
        <Route path='stories/:userID' element={<StoryPage />}></Route>
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
        <Route path='/login' element={<LoginPage />}></Route>
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
