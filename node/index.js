const express = require('express')
const axios = require('axios')
const mysql = require('mysql2/promise')

const app = express()

const api_url = 'https://randomuser.me/api/?results=1'

let connection

async function connectWithRetry() {
  while (true) {
    try {
      connection = await mysql.createConnection({
        host: 'mysql-app',
        user: 'root',
        password: 'root',
        database: 'appdb'
      })

      console.log('Database connected')
      return

    } catch (err) {
      console.log('Retrying database connection...')
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

async function findUser() {

  const response = await axios.get(api_url)

  return response.data.results.map(user => ({
    name: `${user.name.first} ${user.name.last}`
  }))
}

function buildHtml(users) {
  let html = `
  <html>
    <body>
      <h1>Full Cycle Rocks!</h1>

      <ul>
  `

  users.forEach(user => {
    html += `<li>${user.name}</li>`
  })

  html += `
      </ul>

    </body>
  </html>
  `

  return html
}

async function start() {

  await connectWithRetry()

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)
    )
  `)

  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
}

app.get('/', async (req, res) => {

  try {
    const user = await findUser()

    await connection.execute(
      'INSERT INTO users(name) VALUES(?)',
      [user[0].name]
    )

    const [users] = await connection.execute(
      'SELECT * FROM users'
    )

    const html = buildHtml(users)

    res.send(html)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Error fetching users'
    })
  }
})

start()