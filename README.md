

### **Task Manager - Docker Setup**  

This project contains a **Django backend** and a **React frontend**, both running in Docker containers using **Docker Compose**.  

## **Prerequisites**  
Ensure you have the following installed:  
- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  

---

## **Project Structure**  
```
.
├── taskManager_backend/       # Django Backend
│   ├── Dockerfile
│   ├── .env
│   ├── manage.py
│   └── ...
├── task_management_frontend/  # React Frontend
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## **Environment Variables**  
Before running the setup, ensure that the **.env files** are correctly configured.

### **Backend (`taskManager_backend/.env`)**  
Set up your Django backend environment variables:  
```env
DATABASE_URL=postgres://user:password@db:5432/dbname

```
> Replace `DATABASE_URL` with your actual database connection string.

### **Frontend (`task_management_frontend/.env`)**  
Set up your React frontend environment variables:  
```env
VITE_SERVER_URL=http://localhost:8000
```

---

## **Running the Application**  

### **1. Build and Start the Containers**
Run the following command to build and start the services:  
```sh
docker-compose up --build
```
This will:
- Build and start the **Django backend** on `http://localhost:8000`
- Build and start the **React frontend** on `http://localhost:5173`

### **2. Stop the Containers**
To stop the running containers, use:
```sh
docker-compose down
```

### **3. Run in Detached Mode (Background)**
```sh
docker-compose up -d
```

---


## **API Documentation**  
If you have **Django REST Framework** installed, you can access the API documentation at:  
```
http://localhost:8000/api/schema/redoc/
http://localhost:8000/api/schema/swagger-ui/
```


## **Additional Notes**
- If you make changes to the `Dockerfile` or dependencies, rebuild with:
  ```sh
  docker-compose up --build
  ```
- Ensure that the `taskManager_backend` has database migrations applied:
  ```sh
  docker exec -it django_backend python manage.py migrate
  ```
- Logs for debugging:
  ```sh
  docker-compose logs -f
  ```

