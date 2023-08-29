const BlogForm = ({ addBlog, blog, handles }) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input type="text" id="title" name="Title" value={blog.title} onChange={handles.handleTitleChange} />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input type="text" id="author" name="Author" value={blog.author} onChange={handles.handleAuthorChange} />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input type="text" id="url" name="Url" value={blog.url} onChange={handles.handleUrlChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
