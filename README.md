# 🚀 StaffPulse — Employee Management System (MERN + Docker)

A modern, production-ready full-stack **Employee Management System** built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and containerized with **Docker**, **Docker Compose**, **Docker Volumes**, and **Custom Isolated Networks**.

---

## 📸 Overview & Architecture

StaffPulse provides an intuitive dashboard for HR teams and engineering managers to visualize workforce metrics, search, filter, and perform full CRUD operations on employee records.

```
                  +----------------------------------------------+
                  |               Client Browser                 |
                  |            http://localhost:3000             |
                  +----------------------+-----------------------+
                                         |
                                         v
                         +-------------------------------+
                         |      employee-frontend        |
                         |   (React + Vite + Nginx)      |
                         |        [Port 3000:80]         |
                         +---------------+---------------+
                                         |  frontend-net
                                         |  (proxy /api)
                                         v
                         +-------------------------------+
                         |       employee-backend        |
                         |      (Node.js + Express)      |
                         |       [Port 5000:5000]        |
                         +---------------+---------------+
                                         |  backend-net
                                         |  (mongodb:27017)
                                         v
                         +-------------------------------+
                         |       employee-mongodb        |
                         |         (MongoDB 7.0)         |
                         |       [Port 27017:27017]      |
                         +---------------+---------------+
                                         |
                                         v
                             [( mongo-data Volume )]
                            (Data Persists Across Restarts)
```

### 🔒 Docker Security & Isolation Highlights
1. **Multi-Tier Custom Networks**:
   - `frontend-net`: Connects the React client/Nginx server to the Node.js Express backend.
   - `backend-net`: Connects the Node.js Express backend to MongoDB.
   - **Network Isolation**: The `mongodb` container is placed strictly on `backend-net`. It cannot be directly accessed by the frontend container.
2. **Service Discovery**:
   - The backend connects to the database via its Docker service name `mongodb://mongodb:27017/employeedb`.
   - Nginx reverse-proxies `/api/` requests internally to `http://backend:5000/api/`.
3. **Data Persistence via Docker Volumes**:
   - Named volume `mongo-data` is mounted to `/data/db` on the MongoDB container, ensuring that data persists even if containers are stopped, removed, or rebuilt.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Lucide Icons | Responsive UI, live stats, table/grid views, dark/light theme |
| **Build / Web Server** | Vite 5, Nginx (Alpine) | Multi-stage build for ultra-small, fast production container |
| **Backend API** | Node.js (Alpine), Express.js | RESTful API, validation, error handling, graceful shutdown |
| **Database** | MongoDB 7.0, Mongoose ODM | Document database with schema enforcement and text indexes |
| **Containerization** | Docker, Docker Compose | Multi-container orchestration, custom bridge networks, volumes |

---

## 📁 Project Structure

```
Employee management app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Mongoose connection with retry logic
│   │   ├── controllers/
│   │   │   └── employeeController.js # CRUD, metrics aggregation, seed handler
│   │   ├── models/
│   │   │   └── Employee.js           # Mongoose schema with validation & indexes
│   │   ├── routes/
│   │   │   └── employeeRoutes.js     # Express REST endpoints
│   │   └── server.js                 # App configuration & graceful shutdown
│   ├── .dockerignore
│   ├── .env.example                  # Backend environment template
│   ├── Dockerfile                    # Node.js Alpine production container
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx # Safe deletion prompt
│   │   │   ├── EmployeeModal.jsx     # Add/Edit employee form with validation
│   │   │   ├── EmployeeStats.jsx     # KPI summary cards
│   │   │   ├── EmployeeTable.jsx     # Searchable, filterable table/cards
│   │   │   ├── Navbar.jsx            # Header, system health status, dark mode
│   │   │   └── Toast.jsx             # Floating animated notifications
│   │   ├── services/
│   │   │   └── api.js                # Frontend API client
│   │   ├── App.jsx                   # Main application state orchestrator
│   │   ├── index.css                 # Tailwind utilities & glassmorphism
│   │   └── main.jsx
│   ├── .dockerignore
│   ├── .env.example                  # Frontend environment template
│   ├── Dockerfile                    # Multi-stage build (Node -> Nginx Alpine)
│   ├── index.html
│   ├── nginx.conf                    # Nginx proxy & SPA routing config
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker-compose.yml                # Orchestration with 3 services, 2 networks, 1 volume
├── .env.example                      # Root configuration template
└── README.md
```

---

## ⚡ Quick Start with Docker Compose

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Clone or Open the Workspace
```bash
cd "a:/AWS/Employee management app"
```

### 2. Configure Environment (Optional)
A default `.env.example` is provided. If you want custom settings:
```bash
cp .env.example .env
```

### 3. Build & Launch Containers
Run the following single command to build the Docker images and start all three containers:

```bash
docker compose up --build
```

> **Tip (Detached Mode):** To run in the background, add `-d`:
> ```bash
> docker compose up --build -d
> ```

### 4. Access the Application
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API Root:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MongoDB Connection:** `mongodb://localhost:27017/employeedb`

---

## 🎯 Features & Walkthrough

1. **Dashboard KPI Metrics**:
   - Total Employees count
   - Total Annual Payroll (formatted currency)
   - Average Compensation & Highest Salary benchmark
   - Department breakdown
2. **Interactive Directory**:
   - **Instant Search**: Real-time filter across name, role, email, and department.
   - **Department Filter**: Filter by Engineering, Product, Design, Marketing, Sales, HR, Finance, etc.
   - **Sorting**: Sort by Newest, Oldest, Name (A-Z, Z-A), and Salary (High-Low, Low-High).
   - **View Switcher**: Toggle between dense Table View and responsive Card Grid.
3. **Full CRUD Operations**:
   - **Add Employee**: Modal form with field validation (Name, Position, Department, Email, Salary).
   - **Edit Employee**: Update existing fields with immediate optimistic UI sync.
   - **Delete Employee**: Deletion confirmation modal preventing accidental deletions.
4. **Demo Data Seeding**:
   - Click the **"Seed Data"** button in the header or empty-state screen to populate realistic sample employee records.
5. **Dark Mode**:
   - Full dark/light theme support with persisted preference.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & DB connection status | None |
| `GET` | `/api/employees/stats` | Dashboard metrics (total, payroll, avg, depts) | None |
| `GET` | `/api/employees` | List employees with filters | `?search=...&department=...&sortBy=...&order=asc\|desc` |
| `GET` | `/api/employees/:id` | Get employee by ID | None |
| `POST` | `/api/employees` | Create a new employee | `{ name, position, department, email, salary }` |
| `PUT` | `/api/employees/:id` | Update an existing employee | `{ name, position, department, email, salary }` |
| `DELETE` | `/api/employees/:id` | Delete an employee | None |
| `POST` | `/api/employees/seed` | Seed sample employee dataset | `?force=true` (optional) |

### Sample Employee JSON:
```json
{
  "name": "Sarah Connor",
  "position": "Lead Full Stack Architect",
  "department": "Engineering",
  "email": "sarah.connor@cyberdyne.io",
  "salary": 145000
}
```

---

## 💻 Standalone Development (Without Docker)

You can also run the backend and frontend directly on your host machine:

### 1. Start MongoDB Locally
Ensure a local MongoDB server is running on `mongodb://localhost:27017`.

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
# Server will run on http://localhost:5000
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server will run on http://localhost:3000
```

---

## 🛑 Useful Docker Commands

- **Stop containers:**
  ```bash
  docker compose down
  ```
- **Stop containers and delete persistent MongoDB volume (Clean Reset):**
  ```bash
  docker compose down -v
  ```
- **View real-time logs:**
  ```bash
  docker compose logs -f
  ```
- **Inspect MongoDB container shell:**
  ```bash
  docker compose exec mongodb mongosh employeedb
  ```
- **Check container status and health:**
  ```bash
  docker compose ps
  ```

---

## 📄 License
MIT License. Created for prototype demonstration.
