# 🐳 Mastering Docker Image Layers & Container Layers  
### Understand Read-Only Layers, Writable Layers, `docker system df`, CoW & Real Examples

---

# 📑 Table of Contents
1. [Introduction](#introduction)  
2. [Read-Only Layer (Image Layers)](#read-only-layer-image-layers)  
3. [Writable Layer (Container Layer)](#writable-layer-container-layer)  
4. [How Docker Combines Layers (UnionFS)](#how-docker-combines-these-layers-unionfs)  
5. [What Happens When You Edit a File? (Copy-on-Write)](#what-happens-when-you-edit-a-file-copy-on-write)  
6. [Real Example With Alpine](#real-example)  
7. [Golden Logic Explained](#the-golden-logic-what-happened)  
8. [How to Make Installed Packages Permanent](#if-you-want-installed-packages-to-become-part-of-the-image)  
9. [Final Takeaways](#final-takeaways)

---

# 📌 Introduction

When people start using Docker, the most confusing thing they see is this:

- Installing packages **inside a container does NOT increase the image size**  
- `docker system df` shows **container size** increasing, not image size  
- Multiple containers from the same image **do not multiply storage usage**

Let's break this down with a real example using the Alpine Linux image.

---

# 🧊 Read-Only Layer (Image Layers)

When you pull an image like `alpine:latest`, Docker downloads multiple layers.  
These layers together form the **image** — and they are *read-only*.

### Example Layers Inside Alpine
```bash
- Layer 1 → base OS components  
- Layer 2 → busybox files  
- Layer 3 → apk package manager  
- Layer 4 → configuration files  
- ... (may have more layers)
```

---

## ⭐ Key Characteristics of Image Layers

### ✔ **1. Read-Only**
- You cannot modify files inside these layers  
- You cannot delete or overwrite anything  
- You cannot install new packages here  

### ✔ **2. Shared by All Containers**
If you run 100 containers from Alpine:

- All 100 containers use **the same image layers**  
- Docker does NOT duplicate them  
- Massive disk savings — image is stored only once

### ✔ **3. Stable & Immutable**
- Image layers never change  
- Even if deleted from local system, the same layers exist wherever image is stored (registry, cache)

---

## 📝 Example

All these containers use the SAME read-only Alpine layers:

```bash
docker run -dit --name a1 alpine
docker run -dit --name a2 alpine
docker run -dit --name a3 alpine
```

```bash
docker ps

CONTAINER ID   IMAGE           COMMAND     CREATED              STATUS              PORTS     NAMES
14345d37c898   alpine:latest   "/bin/sh"   About a minute ago   Up About a minute             a3
79a312fabd13   alpine:latest   "/bin/sh"   About a minute ago   Up About a minute             a2
27d1758be975   alpine:latest   "/bin/sh"   2 minutes ago        Up 2 minutes                  a1

```
Now run docker system df to check the usage

```bash
docker system df

TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE     
Images          1         1         13.4MB    82.95kB (0%)
Containers      3         3         12.29kB   0B (0%)
Local Volumes   1         0         1.447GB   1.447GB (100%)
Build Cache     0         0         0B        0B
```


---

# 🧰 Writable Layer (Container Layer)

This layer is created only when you **start a container**.
```bash
docker run --name a1 alpine
```


Docker creates a thin writable layer for container **a1**.

### This layer stores:
- files you create  
- logs  
- installed packages  
- temp files  
- application data  
- anything you modify  

---

## ⭐ Key Characteristics of Writable Layer

### ✔ **Write Allowed**
This is the **only** layer that can be changed inside the container.

### ✔ **Unique Per Container**
- a1 has its own writable layer  
- a2 has its own writable layer  
- a3 has its own writable layer  

### ✔ **Starts small**
Writable layers begin nearly empty — a few KB.

### ✔ **Removed when container is deleted**
```bash
docker rm a1
```

→ its writable layer vanishes completely.

---

# 🔍 How Docker Combines These Layers (UnionFS)

Docker uses **Union File System** to stack layers:
```bash
Writable Layer (changes by container)
-------------------------------------
Read-Only Layer 3 (image layer)
Read-Only Layer 2 (image layer)
Read-Only Layer 1 (image layer)
-------------------------------------
Actual Host Filesystem
```


To the container, this looks like **one merged filesystem**.

---

# 🧠 What Happens When You Edit a File? (Copy-on-Write)

Example: file `/etc/motd` exists in a **read-only image layer**.

But image layers cannot be modified.

So Docker uses **Copy-on-Write (CoW)**:

### How CoW Works
1️⃣ Docker copies `/etc/motd` from image → into writable layer  
2️⃣ Applies your modification  
3️⃣ Container now sees the modified version  
4️⃣ Original read-only file stays untouched  

### Summary:
✔ If file is **unchanged** → read directly from image layer  
✔ If file is **modified** → copy is created in writable layer  

---

# 🧪 Real Example

## **STEP 01 — Check Image Size**

Alpine base image ≈ **13.3MB**
```bash
docker images

REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
alpine       latest    4b7ce07002c6   6 weeks ago   13.3MB
```


---

## **STEP 02 — Run Multiple Containers and check their status**
```bash
docker run -dit --name a1 alpine:latest
docker run -dit --name a2 alpine:latest
docker run -dit --name a3 alpine:latest
```
```bash
docker ps
CONTAINER ID   IMAGE           COMMAND     CREATED              STATUS              PORTS     NAMES
14345d37c898   alpine:latest   "/bin/sh"   About a minute ago   Up About a minute             a3
79a312fabd13   alpine:latest   "/bin/sh"   About a minute ago   Up About a minute             a2
27d1758be975   alpine:latest   "/bin/sh"   2 minutes ago        Up 2 minutes                  a1
```


---

## **STEP 03 — Check Disk Usage Before Installing Anything**

```bash
docker system df

TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          1         1         13.4MB    82.95kB (0%)
Containers      3         3         12.29kB   0B (0%)
Local Volumes   1         0         1.447GB   1.447GB (100%)
Build Cache     0         0         0B        0B
```


At this stage, container writable layers are tiny.

---

## **STEP 04 — Install Packages Inside Container a1**

```bash
docker exec -it a1 sh

/ # 
/ # ls
bin    dev    etc    home   lib    media  mnt    opt    proc   root   run    sbin   srv    sys    tmp    usr    var
/ # 
/ # apk add curl
fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/aarch64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/aarch64/APKINDEX.tar.gz
(1/9) Installing brotli-libs (1.1.0-r2)
(2/9) Installing c-ares (1.34.5-r0)
(3/9) Installing libunistring (1.3-r0)
(4/9) Installing libidn2 (2.3.7-r0)
(5/9) Installing nghttp2-libs (1.65.0-r0)
(6/9) Installing libpsl (0.21.5-r3)
(7/9) Installing zstd-libs (1.5.7-r0)
(8/9) Installing libcurl (8.14.1-r2)
(9/9) Installing curl (8.14.1-r2)
Executing busybox-1.37.0-r19.trigger
OK: 13 MiB in 25 packages
/ # 
/ # exit

```


Now run `docker system df` again — container `a1` shows increased size.

```bash
docker system df

TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          1         1         21.41MB   8.095MB (37%)
Containers      3         3         8.024MB   0B (0%)
Local Volumes   1         0         1.447GB   1.447GB (100%)
Build Cache     0         0         0B        0B
```

---

## **STEP 05 — Check the size of each container**

```bash
docker ps -s

CONTAINER ID   IMAGE           COMMAND     CREATED          STATUS          PORTS     NAMES     SIZE
14345d37c898   alpine:latest   "/bin/sh"   47 minutes ago   Up 47 minutes             a3        4.1kB (virtual 9.2MB)
79a312fabd13   alpine:latest   "/bin/sh"   47 minutes ago   Up 47 minutes             a2        4.1kB (virtual 9.2MB)
27d1758be975   alpine:latest   "/bin/sh"   47 minutes ago   Up 47 minutes             a1        8.02MB (virtual 17.2MB)
```
#### The additional increase in the 8MB is due to the installation of the curl package inside the container a1.
---

# 🧠 The Golden Logic: What Happened?

### ❌ Image size did NOT increase  
Even after installing `curl`, Alpine image stays **13.3MB**.

Why?  
Because the image is **read-only** — nothing changes inside it.

### ✔ Writable layer increased  
Container **a1** added ~8MB of data:

- curl binaries  
- dependencies  
- temp files  

This goes **only** into a1’s writable layer.

### ✔ Other containers (a2, a3) remain unchanged  
Because they didn’t install anything.

---

# 🧹 If You Want Installed Packages to Become Part of the Image

You must create a new image with a **Dockerfile** and build it

** DOCKERFILE **
```bash
FROM alpine:latest
RUN apk add curl
```
** BUILD IMAGE **
```bash
docker build -t alpine-curl .
```

Now `curl` is baked permanently into the image.

---

# 🎯 Final Takeaways

- Image layers = read-only, shared, immutable  
- Container layers = writable, private, dynamic  
- Installing packages affects **container size**, not image size  
- `docker system df` helps separate image/cache/container usage  
- Use Dockerfile to make changes permanent  

---

## ⭐ If You Like This README…

You can:

- ⭐ Star the repo  
- 🍴 Fork it  
- 🐛 Open issues  
- 🙌 Improve the documentation  

---

<h3 align="center"> 🐳 Happy learning Docker — keep exploring, keep shipping! 🐳</h3>



