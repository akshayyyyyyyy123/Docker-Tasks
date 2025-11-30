# 🚀 CRUD Node.js + MySQL Application (Docker + Docker Compose) 🚀

This project is a simple **CRUD (Create, Read, Update, Delete)** application built using **Node.js + Express** with a **MySQL database**, fully containerized using **Docker** and **Docker Compose**.

It is designed for learning and DevOps practice—covering Dockerfile, multi-container setup, environment variables, volumes, logs and service communication.

---

## 📁 Project Structure

crud-nodejs-mysql /

├── Dockerfile

├── docker-compose.yml

├── package.json

├── db.js

├── index.js

└── init.sql


---

## 🚀 Features

- Node.js Express API with full CRUD operations
- MySQL database running in a separate container
- Automatic DB table creation via `init.sql`
- Environment variables injected via Docker Compose
- Dockerfile for app containerization
- Logs printed for every API call
- Health-check endpoint

---

## 🐳 Dockerfile

```bash
FROM node:alpine

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install the application dependencies
RUN npm install

# copy the rest of the application code
COPY . .

# expose the port 3000 just for the documentation purpose
EXPOSE 3000

# start the application
CMD ["node", "server.js"]
```


---

## 🐳 docker-compose.yml

- Here is the simple flow, when you run `docker-compose up`, docker sees there are two services namely `nodejs-app` and `mysql-db`.
- Compose starts the `mysql-db` container first because of the `depends_on` condition added under the `nodejs-app` service.
  ```yaml
  depends_on:
  - mysql-db
  ```
- Once the `mysql-db` container starts, then the compose immediately starts the `nodejs-app` container and it will try to connect to the mysql db using the env variables `DB_HOST`, `DB_USER` and `DB_PASSWORD`.

```yaml
version: '3.8'

services:
  nodejs-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 3002:3000
    environment:
      - DB_NAME=mydb
      - DB_HOST=mysql-db
      - DB_USER=root
      - DB_PASSWORD=password
    depends_on:
      - mysql-db

  mysql-db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=mydb
    ports:
      - 3306:3306
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```
---

## ⭐ WORKFLOW
- Build and start all services
```bash
docker-compose up
```


<img width="1708" height="1049" alt="Screenshot 2025-11-30 at 7 07 43 PM" src="https://github.com/user-attachments/assets/def9457e-fe46-4795-b783-7263301a4874" />
<br> <br>
<img width="1709" height="461" alt="Screenshot 2025-11-30 at 7 09 52 PM" src="https://github.com/user-attachments/assets/d3a35a9e-f33d-4f95-b144-ea93a566ccae" />
<br> <br>
<img width="1704" height="462" alt="Screenshot 2025-11-30 at 7 12 03 PM" src="https://github.com/user-attachments/assets/00d898ed-c2ad-4bb6-952a-fa0fa7973312" />

---

## 📊 LOGS AND MONITORING
```bash
# App Health Check
curl -I http://localhost:3002/health

# INSERT a user
curl -X POST http://localhost:3002/users -H "Content-Type: application/json" -d '{"name": "Akshay", "email": "akshay@example.com"}' 

# GET all users
curl http://localhost:3002/users

# UPDATE a user
curl -X PUT http://localhost:3002/users/1 -H "Content-Type: application/json" -d '{"name": "Akshay Updated", "email": "akshay_new@example.com"}'

# DELETE a user
curl -X DELETE http://localhost:3002/users/1

# Checking the application real-time logs
docker logs -f 0375c74941d5

# Check realtime CPU and Memory Usage
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```
<br>
<img width="1127" height="955" alt="Screenshot 2025-11-30 at 7 36 22 PM" src="https://github.com/user-attachments/assets/e48cef03-3f99-4022-9811-ae3e18b781b5" />
<br> 
<img width="707" height="991" alt="Screenshot 2025-11-30 at 7 47 36 PM" src="https://github.com/user-attachments/assets/8deafb5a-bcbc-45c4-87cd-a1cf1bdf5fc6" />
<br> <br>
<img width="812" height="701" alt="Screenshot 2025-11-30 at 7 52 12 PM" src="https://github.com/user-attachments/assets/797a30f6-61e4-4aa7-a540-cb093062cd17" />
<br>
<img width="735" height="87" alt="Screenshot 2025-11-30 at 8 03 31 PM" src="https://github.com/user-attachments/assets/4319ec13-e319-4e6f-a8c5-5a9414fb0ff2" />

---
## ⭐ If You Like This README…

You can:

- ⭐ Star the repo  
- 🍴 Fork it  
- 🐛 Open issues  
- 🙌 Improve the documentation  

---

<h3 align="center"> 🐳 Happy learning Docker — keep exploring, keep shipping! 🐳</h3>

