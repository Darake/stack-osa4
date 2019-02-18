const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) =>  sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes
      ? blog
      : favorite
  }, blogs[0]) || {}

  return favoriteBlog === {}
    ? {}
    : {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes
    }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorsInOrder = _(blogs)
    .groupBy(b => b.author)
    .map((value, key) => ({ author: key, blogs: value }))
    .orderBy(b => b.blogs.length, 'desc')
    .value()

  return {
    author: authorsInOrder[0].author,
    blogs: authorsInOrder[0].blogs.length
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}