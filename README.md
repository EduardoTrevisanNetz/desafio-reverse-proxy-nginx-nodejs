# Nginx Reverse Proxy + Node.js + MySQL

##  Run

docker compose up

Access:
http://localhost:8080

Test:
curl http://localhost:8080

---

##  What this project does

A Node.js application behind an Nginx reverse proxy that stores and retrieves data from a MySQL database.

Every request to `/`:

- inserts a new name into MySQL
- fetches all stored names
- returns an HTML page with the list

---

##  Architecture

Browser → Nginx → Node.js → MySQL

- Nginx: reverse proxy (port 8080)
- Node.js: business logic + HTML response
- MySQL: data persistence (volume enabled)

---

##  Persistence

MySQL data is persisted using Docker volume.

---

##  Reliability

- MySQL healthcheck ensures startup readiness
- Node.js includes retry logic for DB connection
