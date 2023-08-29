import { useState, useEffect } from "react";
import useAsyncEffect from "use-async-effect";
import blogService from "./services/blogs";
import loginService from "./services/login";

import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm.js";
import Notification from "./components/Notification";
import Logout from "./components/Logout";

function App() {
  const loggedUserKey = "loggedBlogUser";

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const populateBlogs = async () => {
    const initialNotes = await blogService.getAll();
    setBlogs(initialNotes);
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

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem(loggedUserKey, JSON.stringify(user));
      setUsername("");
      setPassword("");

      createNotification("You logged in with success", false);
      await loginAndPopulate(user);
    } catch (exception) {
      createNotification("Wrong username or password", true);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    setUser(null);
    setBlogs([]);
    window.localStorage.removeItem(loggedUserKey);
  };

  const createNotification = (message, isCritical, duration = 3000) => {
    setNotification({ message, isCritical });
    setTimeout(() => setNotification(null), duration);
  };

  const resetNoteFields = () => {
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const handleTitleChange = ({ target }) => setTitle(target.value);
  const handleAuthorChange = ({ target }) => setAuthor(target.value);
  const handleUrlChange = ({ target }) => setUrl(target.value);

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlog = { title, author, url };
      const response = await blogService.create(newBlog);

      setBlogs(blogs.concat(response));
      resetNoteFields();
      createNotification(`A new blog ${response.title} by ${response.author} added`, false);
    } catch (exception) {
      createNotification("Invalid blog data", true);
    }
  };

  return (
    <div>
      <Notification notification={notification} />

      {!user && <LoginForm login={{ handleLogin, username, password, setUsername, setPassword }} />}

      <h2>Blogs</h2>

      {user && <Logout user={user} handleLogout={handleLogout} />}
      <br />

      {user && (
        <BlogForm
          addBlog={addBlog}
          blog={{ title, author, url }}
          handles={{ handleTitleChange, handleAuthorChange, handleUrlChange }}
        />
      )}
      <br />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default App;
