const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

let token

beforeAll(async () => {
  await api
    .post('/api/users')
    .send(helper.newUser)

  const res = await api
    .post('/api/login')
    .send({ username: 'daraku', password: 'salasana' })
  token = res.body.token
})

beforeEach(async () => {
  await Blog.remove({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when getting', () => {
  test('right amount of blogs are returned', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body.length).toBe(helper.initialBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs are returned id as their identifier', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
  })
})

describe('when adding', () => {
  test('a valid blog can be added', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.extraBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
  })

  test('if amount of likes not given then defaults as 0', async () => {
    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.blogWithoutLikes)

    expect(res.body.likes).toBe(0)
  })

  describe('if blog does not contain required fields returns status 400', () => {
    test('if blog does not contain title returns 400', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.blogWithoutTitle)
        .expect(400)
    })

    test('if blog does not contain url returns 400', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.blogWithoutUrl)
        .expect(400)
    })
  })
})

test('a blog can be deleted', async () => {
  const blogAtStart = await helper.blogsInDb()
  const blogToDelete = blogAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

  const blogs = blogsAtEnd.map(b => b.title)
  expect(blogs).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogAtStart = blogsAtStart[0]
  await api
    .put(`/api/blogs/${blogAtStart.id}`)
    .send({
      title: blogAtStart.title,
      author: blogAtStart.author,
      url: blogAtStart.url,
      likes: blogAtStart.likes + 1
    })

  const blogsAtEnd = await helper.blogsInDb()
  const blogAtEnd = blogsAtEnd[0]
  expect(blogAtEnd.likes).toBe(blogAtStart.likes + 1)
})


afterAll(() => {
  mongoose.connection.close()
})