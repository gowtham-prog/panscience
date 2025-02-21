

# **Task Manager - Django Backend**  

This is the **backend** for the Task Manager application, built with **Django** and **Django REST Framework (DRF)**. It is containerized using **Docker**.

---

## **Prerequisites**  
Ensure you have the following installed:  
- [Python (>= 3.8)](https://www.python.org/downloads/)  
- [PostgreSQL (if running without Docker or online DB)](https://www.postgresql.org/download/)  
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)  

---

## **Project Setup**  

### **1. Clone the Repository**  
```sh
git clone https://github.com/your-repo/task-manager-backend.git
cd task-manager-backend
```

### **2. Create a Virtual Environment (if running locally)**  
```sh
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### **3. Install Dependencies**  
```sh
pip install -r requirements.txt
```

### **4. Set Up Environment Variables**  
Create a `.env` file in the **root backend folder** (`taskManager_backend/.env`) and configure:  
```env
DATABASE_URL=postgres://user:password@db:5432/dbname

```
> Replace `DATABASE_URL` with your actual PostgreSQL connection string.

---

## **Running the Backend**  

### **Without Docker (Local Development)**  
Run the following commands:

1. Apply Migrations:  
   ```sh
   python manage.py migrate
   ```
2. Create a Superuser (for Django Admin):  
   ```sh
   python manage.py createsuperuser
   ```
3. Start the Development Server:  
   ```sh
   python manage.py runserver
   ```
4. The API will be available at:  
   ```
   http://localhost:8000
   ```

---

### **With Docker**  

1. **Build and Start Containers**  
   ```sh
   docker-compose up --build
   ```
2. **Apply Migrations inside the container**  
   ```sh
   docker exec -it django_backend python manage.py migrate
   ```
3. **Create a Superuser (for Django Admin)**  
   ```sh
   docker exec -it django_backend python manage.py createsuperuser
   ```
4. The API will be available at:  
   ```
   http://localhost:8000
   ```

---

## **API Documentation**  
If you have **Django REST Framework** installed, you can access the API documentation at:  
```
http://localhost:8000/api/schema/redoc/
http://localhost:8000/api/schema/swagger-ui/
```

---

## **Database Management**  

### **Using PostgreSQL (Local Database)**  
If you’re running PostgreSQL locally, update your `.env` file with:  
```env
DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db
```
And run:  
```sh
python manage.py migrate
```

### **Using PostgreSQL in Docker**  
Your `docker-compose.yml` should have a `db` service.  
Ensure the database service is running, then run migrations:  
```sh
docker exec -it django_backend python manage.py migrate
```

---



## **Stopping the Backend**  

### **If running locally:**  
```sh
CTRL + C  # Stop the Django server
```

### **If running in Docker:**  
```sh
docker-compose down
```


