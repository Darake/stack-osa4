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
  return _(blogs)
    .groupBy(b => b.author)
    .map((value, key) => ({ author: key, blogs: value }))
    .orderBy(b => b.blogs.length, 'desc')
    .slice(0, 1)
    .value()
    .map(b => ({ author: b.author, blogs: b.blogs.length }))[0] || {}
}

const mostLikes = (blogs) => {
  return _(blogs)
    .groupBy(b => b.author)
    .map((value, key) => ({ author: key, likes: value.reduce((likeSum, blog) => {
      return likeSum + blog.likes
    }, 0) }))
    .orderBy(b => b.likes, 'desc')
    .value()[0] || {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}