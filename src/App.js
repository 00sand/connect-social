
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom'

import logo from './pics/logo.png'
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import PageNotFound from "./pages/PageNotFound";
import Registration from './pages/Registration';
import { AuthContext } from "./helper/AuthContext";
import { useState, useEffect, Error } from "react";
import axios from "axios";

function App() {
  let { id } = useParams();

  const [isActive, setIsActive] = useState(false);

  const handleClick = event => {
    setIsActive(current => !current);
  };


  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/verify", { withCredentials: true })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          })
        }
      }).then();
  }, []);

  const logOut = () => {
    axios.get('http://localhost:3001/auth/delete', { withCredentials: true })
      .then((response) => {
        setAuthState({ username: "", id: 0, status: false });

      })
  }


  return (
    <div>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar is-spaced has-shadow is-link py-2">
            <div className="navbar-brand">
              <img className='logo' src={logo} ></img>

              <Link role="button" className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} onClick={handleClick}>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </Link>

            </div>

            <div className={isActive ? "navbar-menu navbar-end pr-6 is-active" : "navbar-menu navbar-end pr-6"}>
              <Link class="navbar-item" to="/">Home Page</Link>
              {!authState.status ? (
                <>
                  <Link class="navbar-item" to="/login"> Login</Link>
                  <Link class="navbar-item" to="/registration"> Registration</Link>
                </>
              ) :
                (
                  <>
                    <Link class="navbar-item" to="/createpost">Create a Post</Link>
                    <Link class="navbar-item" to={`/Profile/${authState.id}`}>Profile</Link>
                    <label class="navbar-item">{`${authState.username}`}</label>
                    {authState.status && <Link to="/" class="navbar-item" onClick={logOut}> Logout</Link>}
                  </>
                )}
            </div>
          </div>

          <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/createpost' exact element={<CreatePost />} />
            <Route path='/posts/:id' exact element={<Post />} />
            <Route path='/registration' exact element={<Registration />} />
            <Route path='/login' exact element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>


    </div>
  );
}

export default App;
