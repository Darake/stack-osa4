const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.remove({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

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

test('a valid blog can be added', async () => {
  await api
    .post('/api/blogs')
    .send(helper.extraBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
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

afterAll(() => {
  mongoose.connection.close()
})