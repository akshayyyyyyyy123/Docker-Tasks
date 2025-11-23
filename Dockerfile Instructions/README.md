# 🐳 Dockerfile Instructions — Complete Beginner-Friendly Guide

A **Dockerfile** is a recipe that tells Docker how to build an image.  
Each instruction is a step in creating that image.

---

## 📚 Table of Contents
- [FROM](#from)
- [RUN](#run)
- [CMD](#cmd)
- [ENTRYPOINT](#entrypoint)
- [COPY](#copy)
- [ADD](#add)
- [WORKDIR](#workdir)
- [EXPOSE](#expose)
- [ENV](#env)
- [VOLUME](#volume)
- [USER](#user)
- [LABEL](#label)
- [ARG](#arg)
- [HEALTHCHECK](#healthcheck)
- [Multi-Stage Builds](#multi-stage-builds)
- [Practical Full Example](#practical-full-example)

---

# 🧱 FROM
Defines the **base image** for your Docker image.

```dockerfile
FROM alpine:latest
```

---

# 🛠️ RUN
Runs commands **during build time** inside the image layers.

```dockerfile
RUN apk add --no-cache curl
```

---

# ▶️ CMD
Default command executed when the container starts.

```dockerfile
CMD ["npm", "start"]
```

---

# 🎯 ENTRYPOINT
Main executable for the container.

```dockerfile
ENTRYPOINT ["python3"]
```

Combine ENTRYPOINT + CMD:

```dockerfile
ENTRYPOINT ["ping"]
CMD ["google.com"]
```

---

# 📥 COPY
Copy files from local machine → inside image.

```dockerfile
COPY app.py /app/
```

---

# 📦 ADD
Like COPY but more powerful (URL download, auto-extract tar).

```dockerfile
ADD https://example.com/archive.tar.gz /data/
```

---

# 📁 WORKDIR
Sets working directory (like `cd`).

```dockerfile
WORKDIR /app
```

---

# 🌐 EXPOSE
Documents the container's listening port.

```dockerfile
EXPOSE 8080
```

---

# 🌍 ENV
Sets environment variables.

```dockerfile
ENV DB_HOST=mysql
```

---

# 💾 VOLUME
Declares persistent storage locations.

```dockerfile
VOLUME /data
```

---

# 👤 USER
Sets which user runs the container.

```dockerfile
USER node
```

---

# 🏷️ LABEL
Adds image metadata.

```dockerfile
LABEL maintainer="Akshay"
LABEL version="1.0"
```

---

# 🧩 ARG
Build-time variables.

```dockerfile
ARG VERSION=1.0
RUN echo "Building version $VERSION"
```

Difference between ARG vs ENV:

| ARG | ENV |
|-----|-----|
| Build-time only | Available at runtime |
| Not visible inside container | Visible inside container |

---

# ❤️ HEALTHCHECK
Lets Docker monitor container health.

```dockerfile
HEALTHCHECK CMD curl -f http://localhost:8080/health || exit 1
```

---

# 🏗️ Multi-Stage Builds
For extremely small final images.

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

---

# 🚀 Practical Full Example

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python3", "app.py"]
```

---

## ⭐ If You Like This README…

You can:

- ⭐ Star the repo  
- 🍴 Fork it  
- 🐛 Open issues  
- 🙌 Improve the documentation  

---

<h3 align="center"> 🐳 Happy learning Docker — keep exploring, keep shipping! 🐳</h3>

