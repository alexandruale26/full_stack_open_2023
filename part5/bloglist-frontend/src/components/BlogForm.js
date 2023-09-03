import PropTypes from "prop-types";
import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const resetBlogFields = () => {
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const addBlog = async (event) => {
    event.preventDefault();

    await createBlog({ title, author, url });
    resetBlogFields();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input id="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input id="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input id="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
