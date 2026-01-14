#!/bin/bash

echo "Building Docker images..."

echo "Building backend image..."
docker build -t book-library-backend:latest ./backend

echo "Building frontend image..."
docker build -t book-library-frontend:latest .

echo "Deploying to Kubernetes..."

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/database-deployment.yaml

echo "Waiting for database to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n book-library --timeout=120s

kubectl apply -f k8s/backend-deployment.yaml

echo "Waiting for backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend -n book-library --timeout=120s

kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

echo "Deployment complete!"
echo ""
echo "Check deployment status:"
echo "  kubectl get pods -n book-library"
echo "  kubectl get services -n book-library"
echo "  kubectl get hpa -n book-library"
