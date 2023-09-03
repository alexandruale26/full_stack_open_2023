import { useState } from "react";

const Blog = ({ blog, update, remove }) => {
  const [visible, setVisible] = useState(false);
  const showWhenIsVisible = { display: visible ? "" : "none" };

  const blogStyle = {
    paddingTop: "10px",
    paddingLeft: "2px",
    border: "solid 1px purple",
    marginBottom: "5px",
  };

  const handleUpdateBlog = async (event) => {
    event.preventDefault();

    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    await update(blog.id, blogToUpdate);
  };

  const handleRemoveBlog = async (event) => {
    event.preventDefault();

    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) return;
    await remove(blog.id);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? "hide" : "view"}</button>
      </div>
      <div style={showWhenIsVisible} className="blogHidden">
        <div>{blog.url}</div>{" "}
        <div>
          likes {blog.likes}
          <button className="likeButton" onClick={handleUpdateBlog}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <button onClick={handleRemoveBlog} style={{ backgroundColor: "aquamarine" }}>
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
