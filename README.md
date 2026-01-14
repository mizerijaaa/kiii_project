# Book Library Application

A full-stack book library application built with a three-tier architecture featuring React frontend, Flask backend, and PostgreSQL database. The application is containerized with Docker and ready for Kubernetes deployment.

## Architecture

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Flask REST API with PostgreSQL
- **Database**: PostgreSQL (using Supabase)
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Features

- Browse all books in the library
- Search books by title or author
- Add new books with details (title, author, description, publication year, ISBN)
- Delete books from the library
- Responsive design for mobile and desktop
- RESTful API with proper error handling
- Horizontal Pod Autoscaling for production workloads

## Project Structure

```
.
├── backend/                  # Flask backend service
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend Docker image
├── src/                     # React frontend
│   ├── components/         # React components
│   ├── services/           # API service layer
│   └── types/              # TypeScript type definitions
├── k8s/                     # Kubernetes manifests
│   ├── namespace.yaml      # Namespace definition
│   ├── database-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml
│   └── hpa.yaml            # Horizontal Pod Autoscaler
├── docker-compose.yml      # Docker Compose configuration
└── Dockerfile              # Frontend Docker image
```

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL (or use Supabase)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables (copy `.env.example` to `.env` and update):
```bash
DB_HOST=localhost
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
```

4. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (copy `.env.example` to `.env`):
```bash
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Docker Deployment

### Using Docker Compose

1. Build and run all services:
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Flask backend on port 5000
- React frontend on port 80

### Building Individual Images

Backend:
```bash
cd backend
docker build -t book-library-backend:latest .
```

Frontend:
```bash
docker build -t book-library-frontend:latest .
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (minikube, k3s, or cloud provider)
- kubectl configured
- Docker images built and available

### Deploy to Kubernetes

1. Create the namespace:
```bash
kubectl apply -f k8s/namespace.yaml
```

2. Deploy the database:
```bash
kubectl apply -f k8s/database-deployment.yaml
```

3. Deploy the backend:
```bash
kubectl apply -f k8s/backend-deployment.yaml
```

4. Deploy the frontend:
```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

5. Apply ingress configuration:
```bash
kubectl apply -f k8s/ingress.yaml
```

6. Enable autoscaling:
```bash
kubectl apply -f k8s/hpa.yaml
```

### Verify Deployment

```bash
kubectl get pods -n book-library
kubectl get services -n book-library
kubectl get hpa -n book-library
```

### Access the Application

If using LoadBalancer:
```bash
kubectl get service frontend-service -n book-library
```

If using Ingress, add to `/etc/hosts`:
```
<ingress-ip> book-library.local
```

Then access: `http://book-library.local`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/books` - Get all books
- `GET /api/books/search?q=query` - Search books
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Scaling

The Kubernetes deployment includes Horizontal Pod Autoscalers:

- **Backend**: Scales 3-10 pods based on CPU (70%) and memory (80%)
- **Frontend**: Scales 2-5 pods based on CPU (70%)

Monitor scaling:
```bash
kubectl get hpa -n book-library --watch
```

## Database Schema

The `books` table includes:
- `id` (UUID, primary key)
- `title` (text, required)
- `author` (text, required)
- `description` (text)
- `publication_year` (integer)
- `isbn` (text, unique)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security

- Row Level Security (RLS) enabled on all tables
- CORS configured for frontend-backend communication
- Health check endpoints for monitoring
- Liveness and readiness probes in Kubernetes

## License

MIT
