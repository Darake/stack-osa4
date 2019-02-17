const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const blogs = testHelper.initialBlogs

  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
  })

  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of many is calculated right', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})