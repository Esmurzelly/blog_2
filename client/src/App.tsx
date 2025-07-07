import React from 'react';

import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import(/* webpackChunkName: "Home" */ './pages/Home'));
const About = lazy(() => import(/* webpackChunkName: "About" */ './pages/About'));
const SignIn = lazy(() => import(/* webpackChunkName: "SignIn" */ './pages/SignIn'));
const SignUp = lazy(() => import(/* webpackChunkName: "SignUp" */ './pages/SignUp'));
const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ './pages/Dashboard'));
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ './pages/NotFound'));
const CreatePost = lazy(() => import(/* webpackChunkName: "CreatePost" */ './pages/CreatePost'));
const UpdatePost = lazy(() => import(/* webpackChunkName: "UpdatePost" */ './pages/UpdatePost'));
const PostPage = lazy(() => import(/* webpackChunkName: "PostPage" */ './pages/PostPage'));
const Search = lazy(() => import(/* webpackChunkName: "Search" */ './pages/Search'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/search' element={<Search />} />
          <Route path='/post/:postId' element={<PostPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute adminOny />}>
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:postId' element={<UpdatePost />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
