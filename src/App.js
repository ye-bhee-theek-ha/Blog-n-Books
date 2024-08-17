import './App.css';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Auth/Auth';
import Home from './screens/Home/Home';
import Blogs from './screens/Blogs/Blogs';
import NotFound from './screens/Not Found/NotFound';
import Books from './screens/Books/Books'
import UserAuth from './screens/UserAuth/UserAuth';
import Profile from './screens/Profile/Profile';
import UploadBook from './screens/UploadBook/UploadBook';
import ViewBook from './screens/ViewBook/ViewBook';
import UploadBlog from './screens/UploadBlog/UploadBlog';
import ViewBlog from './screens/ViewBlog/ViewBlog';

function App() {
  return (
    <div className="App bg-green min-h-screen h-full">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Blogs" element={<Blogs/>} />
            <Route path="/Books" element={<Books/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile/UploadBook" element={<UploadBook/>} />
            <Route path="/profile/UploadBlog" element={<UploadBlog/>} />
            <Route path="/Book/:ID" element={<ViewBook/>} />
            <Route path="/Blog/:ID" element={<ViewBlog/>} />
            <Route path="/auth" element={<UserAuth/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
