# =============================================================================
# LiveStakes Project Makefile
# =============================================================================

# Directories
FRONTEND_DIR=src
BLOCKCHAIN_DIR=src/blockchain
SERVER_DIR=src/server
COMMON_DIR=common
PIPELINE_DIR=pipeline

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

.PHONY: help install dev build start test clean docker-dev docker-prod docker-build blockchain-compile blockchain-test blockchain-deploy blockchain-node blockchain-clean server-install server-dev server-build server-start server-migrate frontend-install frontend-dev frontend-build frontend-start all-dev all-build all-start

# =============================================================================
# Help
# =============================================================================
help: ## Show this help message
	@echo "$(BLUE)LiveStakes Project Makefile$(NC)"
	@echo "$(YELLOW)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# =============================================================================
# Installation
# =============================================================================
install: ## Install all dependencies
	@echo "$(BLUE)Installing all dependencies front end and backend...$(NC)"
	cd $(FRONTEND_DIR) && pnpm install
	cd $(BLOCKCHAIN_DIR) && pnpm install
	cd $(SERVER_DIR) && pnpm install
	@echo "$(GREEN)All dependencies installed!$(NC)"



# =============================================================================
# Frontend (Next.js)
# =============================================================================
frontend-install: ## Install frontend dependencies
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	cd $(FRONTEND_DIR) && pnpm install

frontend-dev: ## Start frontend development server
	@echo "$(BLUE)Starting frontend development server...$(NC)"
	cd $(FRONTEND_DIR) && pnpm dev

frontend-build: ## Build frontend for production
	@echo "$(BLUE)Building frontend for production...$(NC)"
	cd $(FRONTEND_DIR) && pnpm build

frontend-start: ## Start frontend production server
	@echo "$(BLUE)Starting frontend production server...$(NC)"
	cd $(FRONTEND_DIR) && pnpm start

frontend-lint: ## Lint frontend code
	@echo "$(BLUE)Linting frontend code...$(NC)"
	cd $(FRONTEND_DIR) && pnpm lint

# =============================================================================
# Blockchain (Hardhat)
# =============================================================================
blockchain-compile: ## Compile smart contracts
	@echo "$(BLUE)Compiling smart contracts...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat compile

blockchain-test: ## Run blockchain tests
	@echo "$(BLUE)Running blockchain tests...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat test

blockchain-test-coverage: ## Run blockchain tests with coverage
	@echo "$(BLUE)Running blockchain tests with coverage...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat coverage

blockchain-deploy-local: ## Deploy contracts to local network
	@echo "$(BLUE)Deploying contracts to local network...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat run scripts/deploy.js --network localhost

blockchain-deploy-sepolia: ## Deploy contracts to Sepolia testnet
	@echo "$(BLUE)Deploying contracts to Sepolia testnet...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat run scripts/deploy.js --network sepolia

blockchain-deploy-mainnet: ## Deploy contracts to mainnet
	@echo "$(BLUE)Deploying contracts to mainnet...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat run scripts/deploy.js --network mainnet

blockchain-deploy-flow-testnet: ## Deploy contracts to Flow testnet
	@echo "$(BLUE)Deploying contracts to Flow testnet...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat run scripts/deploy.js --network flow-testnet

blockchain-deploy-flow-mainnet: ## Deploy contracts to Flow mainnet
	@echo "$(BLUE)Deploying contracts to Flow mainnet...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat run scripts/deploy.js --network flow-mainnet

blockchain-node: ## Start local Hardhat node
	@echo "$(BLUE)Starting local Hardhat node...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat node

blockchain-clean: ## Clean blockchain artifacts
	@echo "$(BLUE)Cleaning blockchain artifacts...$(NC)"
	cd $(BLOCKCHAIN_DIR) && npx hardhat clean

# =============================================================================
# Server (Express/TypeScript)
# =============================================================================
server-install: ## Install server dependencies
	@echo "$(BLUE)Installing server dependencies...$(NC)"
	cd $(SERVER_DIR) && pnpm install

server-dev: ## Start server in development mode
	@echo "$(BLUE)Starting server in development mode...$(NC)"
	cd $(SERVER_DIR) && pnpm dev

server-dev-debug: ## Start server in debug mode
	@echo "$(BLUE)Starting server in debug mode...$(NC)"
	cd $(SERVER_DIR) && pnpm dev-debug

server-build: ## Build server for production
	@echo "$(BLUE)Building server for production...$(NC)"
	cd $(SERVER_DIR) && pnpm build

server-start: ## Start server in production mode
	@echo "$(BLUE)Starting server in production mode...$(NC)"
	cd $(SERVER_DIR) && pnpm start

server-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	cd $(SERVER_DIR) && pnpm migrate

# =============================================================================
# Combined Development
# =============================================================================
all-dev: ## Start all services in development mode
	@echo "$(BLUE)Starting all services in development mode...$(NC)"
	cd $(FRONTEND_DIR) && pnpm dev:all

all-build: ## Build all services for production
	@echo "$(BLUE)Building all services for production...$(NC)"
	cd $(FRONTEND_DIR) && pnpm build:all

all-start: ## Start all services in production mode
	@echo "$(BLUE)Starting all services in production mode...$(NC)"
	cd $(FRONTEND_DIR) && pnpm start:all

# =============================================================================
# Docker Operations
# =============================================================================
docker-dev: ## Start development environment with Docker
	@echo "$(BLUE)Starting development environment with Docker...$(NC)"
	docker-compose -f docker-compose-local.yml up --build

docker-prod: ## Start production environment with Docker
	@echo "$(BLUE)Starting production environment with Docker...$(NC)"
	docker-compose up --build

docker-build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build

docker-clean: ## Clean Docker containers and images
	@echo "$(BLUE)Cleaning Docker containers and images...$(NC)"
	docker-compose down -v
	docker system prune -f

# =============================================================================
# Database Operations
# =============================================================================
db-start: ## Start database container
	@echo "$(BLUE)Starting database container...$(NC)"
	docker-compose up -d livestakesmdb

db-stop: ## Stop database container
	@echo "$(BLUE)Stopping database container...$(NC)"
	docker-compose stop livestakesmdb

db-reset: ## Reset database (stop, remove volumes, start)
	@echo "$(BLUE)Resetting database...$(NC)"
	docker-compose down -v
	docker-compose up -d livestakesmdb

# =============================================================================
# Testing
# =============================================================================
test: blockchain-test ## Run all tests
	@echo "$(BLUE)Running all tests...$(NC)"

test-frontend: ## Run frontend tests (if configured)
	@echo "$(BLUE)Running frontend tests...$(NC)"
	cd $(FRONTEND_DIR) && pnpm test

test-server: ## Run server tests (if configured)
	@echo "$(BLUE)Running server tests...$(NC)"
	cd $(SERVER_DIR) && pnpm test

# =============================================================================
# Cleanup
# =============================================================================
clean: blockchain-clean ## Clean all build artifacts
	@echo "$(BLUE)Cleaning all build artifacts...$(NC)"
	cd $(FRONTEND_DIR) && rm -rf .next
	cd $(SERVER_DIR) && rm -rf dist
	@echo "$(GREEN)Cleanup complete!$(NC)"

clean-all: clean docker-clean ## Clean everything including Docker
	@echo "$(BLUE)Cleaning everything...$(NC)"
	@echo "$(GREEN)Complete cleanup finished!$(NC)"

# =============================================================================
# Development Shortcuts
# =============================================================================
dev: all-dev ## Alias for all-dev
build: all-build ## Alias for all-build
start: all-start ## Alias for all-start

# =============================================================================
# Quick Setup
# =============================================================================
setup: install db-start ## Quick setup: install dependencies and start database
	@echo "$(GREEN)Setup complete! Run 'make dev' to start development.$(NC)"

# =============================================================================
# Deployment Helpers
# =============================================================================
deploy-local: blockchain-deploy-local ## Deploy to local network
deploy-sepolia: blockchain-deploy-sepolia ## Deploy to Sepolia testnet
deploy-mainnet: blockchain-deploy-mainnet ## Deploy to mainnet
deploy-flow-testnet: blockchain-deploy-flow-testnet ## Deploy to Flow testnet
deploy-flow-mainnet: blockchain-deploy-flow-mainnet ## Deploy to Flow mainnet
