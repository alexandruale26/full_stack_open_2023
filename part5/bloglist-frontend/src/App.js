import { useState, useRef } from "react";
import useAsyncEffect from "use-async-effect";
import blogService from "./services/blogs";
import loginService from "./services/login";

import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm.js";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import Logout from "./components/Logout";

function App() {
  const loggedUserKey = "loggedBlogUser";

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  const populateBlogs = async () => {
    const initialBlogs = await blogService.getAll();
    setBlogs(initialBlogs);
  };

  const loginAndPopulate = async (user) => {
    setUser(user);
    blogService.setToken(user.token);
    await populateBlogs();
  };

  useAsyncEffect(async () => {
    const loggedUserJSON = window.localStorage.getItem(loggedUserKey);

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      await loginAndPopulate(user);
    }
  }, []);

  const login = async (userCredentials) => {
    try {
      const user = await loginService.login(userCredentials);

      window.localStorage.setItem(loggedUserKey, JSON.stringify(user));
      await loginAndPopulate(user);

      createNotification("You logged in with success", false);
    } catch (exception) {
      createNotification("Wrong username or password", true);
    }
  };

  const logout = () => {
    setUser(null);
    setBlogs([]);
    window.localStorage.removeItem(loggedUserKey);
  };

  const createNotification = (message, isCritical, duration = 3000) => {
    setNotification({ message, isCritical });
    setTimeout(() => setNotification(null), duration);
  };

  const createBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const response = await blogService.create(newBlog);

      setBlogs(blogs.concat(response));
      createNotification(`A new blog ${response.title} by ${response.author} added`, false);
    } catch (exception) {
      createNotification("Invalid blog data", true);
    }
  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm login={login} />
      </Togglable>
    );
  };

  const blogForm = () => {
    return (
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    );
  };

  return (
    <div>
      <Notification notification={notification} />
      <h2>Blogs app</h2>

      {!user && loginForm()}
      {user && <Logout logout={logout} name={user.name} />}
      <br />

      {user && blogForm()}

      <h3>Blogs</h3>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default App;
