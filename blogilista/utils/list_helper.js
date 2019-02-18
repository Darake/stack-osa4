const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) =>  sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const result = blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes
      ? blog
      : favorite
  }, blogs[0])

  return result || {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}