# Apache Docker Project

This project demonstrates how to run a custom Apache HTTP Server container using Docker.  
It includes building a Docker image, serving static website content, configuring Apache,  
and understanding container logs, CPU/memory usage, and process management.

---

## 🚀 Project Overview

You will:
- Build a custom Docker image based on `httpd:alpine`
- Copy your website files into Apache's document root
- Configure Apache inside the container
- Run the container and access the website
- View container logs
- Inspect CPU & memory consumption
- Understand Apache process management in Docker

---

## 📂 Project Structure

project/

├── Dockerfile

├── index.html

├── styles.css

└── app.js

---

## 🐳 Dockerfile 

```dockerfile
FROM httpd:alpine

# Setting a ServerName to avoid FQDN warnings
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

# Copy static site files
COPY . /usr/local/apache2/htdocs/

# Expose port
EXPOSE 80
```
---

- Here, I used the lightweight httpd:alpine image.
- I added ServerName localhost to the httpd.conf file because, when the container started, Apache showed this warning:
```bash
AH00558: Could not reliably determine the server's fully qualified domain name
```
- However adding the ServerName fixed that warning message.

- The website files are served from the folder - /usr/local/apache2/htdocs/

- I could also add ```CMD ["httpd-foreground"]``` in the Dockerfile, but it wasn’t necessary in my case because it is already defined in the base ```httpd:alpine``` image.

---

## 🏗️ Build the Docker Image
```bash
docker build -t apache-image .
```
<img width="1707" height="489" alt="Screenshot 2025-11-27 at 12 04 52 AM" src="https://github.com/user-attachments/assets/6d88617d-5e29-4eb5-9508-16db5c7b958d" />

## ▶️ Run the Container
```bash
docker run -d -p 8000:80 apache-image:latest
```
<img width="1696" height="222" alt="Screenshot 2025-11-27 at 12 06 19 AM" src="https://github.com/user-attachments/assets/216fa7d0-6d1e-4cca-9477-e328992ee461" />
<br><br>

Visit the site: ```http://localhost:8000/```

<img width="1478" height="543" alt="Screenshot 2025-11-27 at 12 09 41 AM" src="https://github.com/user-attachments/assets/5ea98988-fa10-4aae-9cdb-b36ef83a580d" />

---

## 📜 View Container Logs
### ✅ Method 1 — View Live Logs
```bash
docker logs xenodochial_chaplygin
```
<img width="1635" height="293" alt="Screenshot 2025-11-27 at 12 15 19 AM" src="https://github.com/user-attachments/assets/2368c1d0-98d0-4c58-bb69-3643147df279" />
<br><br>

View Logs With Live Streaming (real-time) - This will keep showing logs as new requests come in
```bash
docker logs -f xenodochial_chaplygin
```
View Only Last N Lines
```bash
docker logs --tail 50 xenodochial_chaplygin
```
### ✅ Method 2 — Enable access/error logs inside container
Apache stores logs in ```/usr/local/apache2/logs/```. But in ```httpd:alpine```, sometimes access_log and error_log are redirected to container stdout as shown above.
Inorder to store the logs inside the container then we would need to update the httpd.conf file under ```/usr/local/apache2/conf```. In ```httpd.conf``` file:
```bash<img width="1369" height="801" alt="Screenshot 2025-11-27 at 12 42 26 AM" src="https://github.com/user-attachments/assets/fa0836d8-17fb-4136-8d95-fc333ce8f289" />

ErrorLog "logs/error_log" (Uncomment)
#CustomLog /proc/self/fd/1 common (Comment)
CustomLog "logs/access_log" combined (Uncomment)
```
Next step is to restart the container inorder to apply the changes made in the httpd.conf file. Run :
```bash
docker restart xenodochial_chaplygin
```


<img width="1233" height="831" alt="Screenshot 2025-11-27 at 12 43 02 AM" src="https://github.com/user-attachments/assets/2d925fc4-1055-4a50-801f-be332aa400d5" />

<br><br>

<img width="1710" height="765" alt="Screenshot 2025-11-27 at 12 43 49 AM" src="https://github.com/user-attachments/assets/c6fade51-16a8-45ab-8f01-a83b2106103a" />

Earlier Apache was sending logs to Docker’s stdout (1) and stderr (2) instead of writing to files
```bash
/proc/self/fd/1 → STDOUT
/proc/self/fd/2 → STDERR
```
---
## 📊 Monitoring
### 1️⃣ Using docker stats (Live monitoring)
```bash
docker stats (Shows real-time CPU %, memory usage, network I/O, block I/O for all running containers)
docker stats xenodochial_chaplygin (To monitor a specific container)
```
<img width="1333" height="72" alt="Screenshot 2025-11-27 at 12 51 12 AM" src="https://github.com/user-attachments/assets/09fd9977-1492-497f-916e-31563a5fcc5f" />

### 2️⃣ Using docker top
Shows processes running inside a container
```bash
docker top xenodochial_chaplygin
```
<img width="1706" height="291" alt="Screenshot 2025-11-27 at 12 53 54 AM" src="https://github.com/user-attachments/assets/6301a377-aa71-45f9-99de-d6778d574a2c" />

### 3️⃣ Using docker stats in a formatted way
```bash
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```
<img width="600" height="59" alt="Screenshot 2025-11-27 at 12 56 38 AM" src="https://github.com/user-attachments/assets/86f4136a-70de-434d-9434-fd52fb18f3fd" />

---
## ⭐ If You Like This README…

You can:

- ⭐ Star the repo  
- 🍴 Fork it  
- 🐛 Open issues  
- 🙌 Improve the documentation  

---

<h3 align="center"> 🐳 Happy learning Docker — keep exploring, keep shipping! 🐳</h3>

