<h1 align="center">🐳 Mastering <code>docker system df</code>: Understand Image Size, Active Layers & Reclaimable Space (With Live Example) 🐳</h1>

---

## 📚 Table of Contents
- [Introduction](#-introduction)
- [What docker system df Shows](#-what-docker-system-df-actually-shows)
- [Example: Pulling & Running Ubuntu Image](#-example-pulling-and-running-ubuntu-image)
- [Deep Dive](#-deep-dive-understanding-each-section)
- [Stopping Containers](#-step-2-stop-containers--analyze-again)
- [Pruning](#-step-3-pruning-unused-resources)
- [Final Takeaways](#-final-takeaways)

---

## 📌 Introduction

If you’ve ever cleaned containers, deleted images, pruned cache…  
yet Docker still shows high disk usage — you’re not alone.

The command behind this confusion is
```bash
docker system df
```


This README breaks down **how Docker calculates disk usage**, what **Reclaimable** means, and walks you through a **real live example** using multiple Ubuntu containers.

---


## 🧩 What `docker system df` Actually Shows

Docker summarizes your disk usage under four categories:

| Category      | What It Tracks |
|---------------|----------------|
| **Images**    | Base images & layers |
| **Containers** | Running + stopped containers |
| **Local Volumes** | Data stored persistently |
| **Build Cache** | Layers created during `docker build` |

Each category shows:

### **🔹 TOTAL**  
How many items exist

### **🔹 ACTIVE**  
How many are currently in use

### **🔹 SIZE**  
Total disk usage

### **🔹 RECLAIMABLE**  
Space Docker *can safely delete*  
(not used by any running or stopped container)

---

## 🧪 Example: Pulling and Running Ubuntu Image

Start by pulling one Ubuntu image:<br>
```bash
docker images

REPOSITORY            TAG            IMAGE ID        CREATED       SIZE
ubuntu         resolute-20251101   17b7f58eea25    2 weeks ago     155MB
```


**No containers yet**
```bash
docker ps

(no containers)
```

Now create **three containers using the same base image**
```bash
docker run -dit --name u1 ubuntu:resolute-20251101
docker run -dit --name u2 ubuntu:resolute-20251101
docker run -dit --name u3 ubuntu:resolute-20251101
```

**Check disk usage**
```bash
docker system df

TYPE            TOTAL  ACTIVE    SIZE    RECLAIMABLE
Images            1      1     155.3MB     80.42kB (0%)
Containers        3      3     12.29kB     0B (0%)
Local Volumes     1      0     1.447GB    1.447GB (100%)
Build Cache       0      0       0B          0B
```


---

## 🧠 Deep Dive: Understanding Each Section

---

### 🐳 **1. Images**

Images: TOTAL=1 | ACTIVE=1 | SIZE=155MB | RECLAIMABLE=80KB


**Why is reclaimable so small?**

- All 3 containers use the *same* 155 MB Ubuntu image
- Docker cannot delete layers that containers depend on  
- So only a tiny metadata layer (~80 KB) is reclaimable

Think of the 155 MB image as **one DVD**:

- 3 computers (containers) are using that same DVD  
- You cannot throw away the DVD  
- You can only remove a tiny sticker on the box (80 KB)

---

### 🐳 **2. Containers**

Containers: 3 total | 3 active | 12KB size | 0 KB reclaimable


Containers only add **small writable layers**.  
While running → **none of it reclaimable**.

---

### 🐳 **3. Volumes**

Local Volumes: 1.447GB total | 1.447GB reclaimable


The volume is **not used by any container**,  
so Docker marks *all* of it reclaimable.

This is where hidden disk usage often accumulates!

---

## 🛑 Step 2: Stop Containers & Analyze Again

Stop the containers:

```bash
docker stop u1 u2 u3
```

Check disk usage
```bash
docker system df

TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images            1        1    155.3MB    80.42kB (0%)
Containers        3        0    12.29kB    12.29kB (100%)
Local Volumes     1        0    1.447GB    1.447GB (100%)
```


### What changed?

✔ Stopped containers → now reclaimable  
✖ Image still active → still not reclaimable  
➡ Because the image is still referenced by the stopped containers

Stopped ≠ unused  
Stopped still **prevents image deletion**

---

## 💣 Step 3: Pruning Unused Resources

Run:
```bash
docker system prune
```
Total reclaimed space: 12.29kB

Check df again:
```bash
docker system df

Images:  ACTIVE = 0, RECLAIMABLE = 155MB
Containers:  0
Volumes: 1.447GB reclaimable
```


### Now the image becomes fully reclaimable  
because no container references it anymore.

To delete unused images too:

```bash
docker system prune -a
```

### 📊 Before vs After Cleanup

| Stage | Images Active | Image Reclaimable | Containers | Volumes Reclaimable |
|-------|--------------|-------------------|------------|----------------------|
| After Running 3 Containers | 1 | 80 KB | 3 running | 0 GB |
| After Stopping Containers | 1 | 80 KB | 3 stopped | 1.447 GB |
| After Pruning | 0 | 155 MB | 0 | 1.447 GB |

---

## 🎯 Final Takeaways

### ✔ One image serves multiple containers  
No duplication → 155 MB stays 155 MB even for 100 containers.

### ✔ Reclaimable space = safe-to-delete space  
Docker knows what is unused.

### ✔ Stopped containers still block deletion  
You must remove them before image layers become reclaimable.

### ✔ Volumes often consume GBs silently  
Always inspect them.

### ✔ `docker system prune` cleans up unused resources  
But **`prune -a`** is required to remove unused images.

---

## 🧰 Quick Commands Cheat Sheet

| Command | Purpose |
|---------|---------|
| `docker system df` | Show disk usage summary |
| `docker system prune` | Remove stopped containers + unused networks + dangling images |
| `docker system prune -a` | Remove **all** unused images |
| `docker volume prune` | Delete unused volumes |
| `docker image prune -a` | Delete all unused image layers |

---

## ⭐ If You Like This README…

You can:

- ⭐ Star the repo  
- 🍴 Fork it  
- 🐛 Open issues  
- 🙌 Improve the documentation  

---

<h3 align="center"> 🐳 Happy learning Docker — keep exploring, keep shipping! 🐳</h3>

