const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const blogs = testHelper.initialBlogs

  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(testHelper.listWithOneBlog)).toBe(5)
  })

  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of many is calculated right', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})

describe('blog with most likes', () => {
  const favoriteBlog = {
    _id: '5a422aa71b54a676234d17f9',
    title: 'Best blog ever',
    author: 'Bloginston',
    url: 'www.awesome.com',
    likes: 1337,
    __v: 0
  }

  const blogOutput = {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }

  const blogs = testHelper.initialBlogs.concat(favoriteBlog)

  test('is normally right', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual(blogOutput)
  })

  test('is an empty object when argument is an empty array', () => {
    expect(listHelper.favoriteBlog([])).toEqual({})
  })
})

describe('most blogs', () => {
  const authorWithMostBlogs = {
    author: 'Robert C. Martin',
    blogs: 3
  }

  const expectedWithOne = {
    author: 'Edsger W. Dijkstra',
    blogs: 1
  }

  test('of many is calculated right', () => {
    expect(listHelper.mostBlogs(testHelper.initialBlogs)).toEqual(authorWithMostBlogs)
  })

  test('of empty array is empty object', () => {
    expect(listHelper.mostBlogs([])).toEqual({})
  })

  test('of one is returned right', () => {
    expect(listHelper.mostBlogs(testHelper.listWithOneBlog)).toEqual(expectedWithOne)
  })
})