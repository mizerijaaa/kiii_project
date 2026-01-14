# Quick Start Guide

## Option 1: Local Development (Fastest)

### Start Backend
```bash
cd backend
pip install -r requirements.txt
# Configure your database connection in .env
python app.py
```

### Start Frontend
```bash
npm install
# Configure API URL in .env
npm run dev
```

Visit `http://localhost:5173`

## Option 2: Docker Compose (Recommended)

```bash
docker-compose up --build
```

Visit `http://localhost`

This automatically sets up:
- PostgreSQL database
- Flask backend
- React frontend with Nginx

## Option 3: Kubernetes (Production)

### Prerequisites
- Kubernetes cluster running
- kubectl configured
- Docker images built

### Quick Deploy
```bash
./deploy.sh
```

### Manual Deploy
```bash
# Build images
docker build -t book-library-backend:latest ./backend
docker build -t book-library-frontend:latest .

# Deploy to Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/database-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### Access Application
```bash
# Get the LoadBalancer IP
kubectl get service frontend-service -n book-library

# Or use port-forward for testing
kubectl port-forward -n book-library service/frontend-service 8080:80
```

Visit `http://localhost:8080`

## Using Supabase

If you're using Supabase for the database:

1. Get your Supabase connection details from the dashboard
2. Update the backend environment variables:
   - `DB_HOST`: Your Supabase host
   - `DB_NAME`: postgres
   - `DB_USER`: postgres
   - `DB_PASSWORD`: Your Supabase password
   - `DB_PORT`: 5432

The database schema has already been created via the migration.

## Troubleshooting

### Backend won't start
- Check database connection settings
- Ensure PostgreSQL is running
- Verify all environment variables are set

### Frontend can't connect to backend
- Check VITE_API_URL in frontend .env
- Ensure backend is running on the correct port
- Check CORS settings if accessing from different origin

### Kubernetes pods not starting
```bash
kubectl describe pod <pod-name> -n book-library
kubectl logs <pod-name> -n book-library
```

Common issues:
- Images not pulled: Check image names and availability
- Database not ready: Wait for postgres pod to be running
- Config/secrets missing: Verify all ConfigMaps and Secrets are created
