const _ = require("lodash");

const totalLikes = (blogs) => {
  const reducer = (sum, likes) => sum + likes;

  return blogs.length === 0 ? 0 : blogs.map((blog) => blog.likes).reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};

  const filtered = blogs.sort((curr, next) => {
    if (curr.likes === next.likes) return 0;
    return curr.likes > next.likes ? 1 : -1;
  });

  const favBlog = filtered.at(-1);

  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  if (blogs.length === 1) return { author: blogs[0].author, blogs: 1 };

  const authorsAndBlogs = _.countBy(blogs, "author");
  const authorsToArray = _.entries(authorsAndBlogs);
  const authorsObjects = _.map(authorsToArray, (el) => {
    return { author: el[0], blogs: el[1] };
  });

  return _.maxBy(authorsObjects, (obj) => obj.blogs);
};

const mostLikes = (blogs) => {
  function reduce(blogs, author) {
    const likes = _.reduce(blogs, (sum, blog) => sum + blog.likes, 0);

    return { author, likes };
  }

  if (blogs.length === 0) return {};
  if (blogs.length === 1) return { author: blogs[0].author, likes: blogs[0].likes };

  const authorsAndBlogs = _.groupBy(blogs, "author");
  const authorsAndLikes = _.map(authorsAndBlogs, (blogs, authors) => reduce(blogs, authors));

  return _.maxBy(authorsAndLikes, "likes");
};

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes };
