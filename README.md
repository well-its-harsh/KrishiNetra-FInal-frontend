# SwasthyaNet - AgriChain Platform

AgriChain is a comprehensive agricultural marketplace platform that connects farmers directly to consumers and businesses. The platform includes auction functionality, blockchain traceability, subscription services, and integrated payment processing.

## Project Structure

```
├── backend/sih/                 # FastAPI backend application
│   ├── app/                     # Main application code
│   │   ├── main.py             # FastAPI application setup
│   │   ├── models/             # Database models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── routers/            # API endpoints
│   │   ├── crud/               # Database operations
│   │   ├── services/           # Business logic
│   │   ├── db/                 # Database session & configuration
│   │   ├── auth/               # Authentication utilities
│   │   ├── blockchain/         # Blockchain integration
│   │   ├── cache/              # Caching services
│   │   └── notification_service/# Real-time notifications
│   ├── alembic/                # Database migrations
│   ├── media/                  # Uploaded files & images
│   ├── tests/                  # Test files
│   └── requirements.txt         # Python dependencies
│
├── krishinetra-connect/         # Main React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── modules/            # Feature modules
│   │   ├── hooks/              # Custom React hooks
│   │   ├── contexts/           # React contexts
│   │   ├── utils/              # Utility functions
│   │   ├── config/             # Configuration files
│   │   └── main.tsx            # Application entry point
│   ├── package.json            # Node dependencies
│   └── vite.config.ts          # Vite configuration
│
└── pages/SIH_Frontend/          # Alternative frontend implementation
```

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (asyncpg)
- **ORM**: SQLAlchemy
- **Caching**: Redis
- **Migrations**: Alembic
- **Payment**: Razorpay
- **Real-time**: WebSockets
- **Validation**: Pydantic

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack React Query (React Query)
- **Form Management**: React Hook Form
- **HTTP Client**: Axios

## Features

- 🌾 **Marketplace**: Direct farmer-to-consumer connections
- 🏆 **Auction System**: Real-time bidding for agricultural products
- 🔗 **Blockchain Traceability**: Track product origin and supply chain
- 💳 **Payment Integration**: Razorpay for secure transactions
- 🔐 **Authentication**: Secure user authentication
- 📢 **Real-time Notifications**: WebSocket-based notifications
- 📦 **Subscription Services**: Recurring product orders
- 🛡️ **Escrow Management**: Secure payment handling

## Getting Started

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL 12+
- Redis
- npm or bun package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/sih
```

2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Create .env file in backend/sih/app directory with:
DATABASE_URL=postgresql+asyncpg://user:password@localhost/agrichain
REDIS_URL=redis://localhost:6379
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd krishinetra-connect
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Create environment configuration (if needed):
```bash
# Create .env file with backend API URL
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

The backend provides comprehensive API documentation at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Database Migrations

To create new migrations:
```bash
cd backend/sih
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

## Testing

Run tests from the backend directory:
```bash
# Run all tests
python -m pytest tests/

# Run specific test file
python -m pytest tests/test_api_flow.py

# Run with coverage
python -m pytest --cov=app tests/
```

## Building for Production

### Backend
```bash
cd backend/sih
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
cd krishinetra-connect
npm run build
npm run preview  # Local preview of production build
```

## Environment Variables

### Backend (`backend/sih/app/.env`)
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost/agrichain_db
REDIS_URL=redis://localhost:6379
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30
ENVIRONMENT=development
```

### Frontend (`krishinetra-connect/.env`)
```
VITE_API_URL=http://localhost:8000
```

## Architecture Overview

### Backend Architecture
- **Layered Architecture**: Routers → Services → CRUD → Models
- **Database**: Async PostgreSQL with SQLAlchemy ORM
- **Real-time**: WebSocket connections for live updates
- **Caching**: Redis for session and data caching
- **Async/Await**: Full async support for high concurrency

### Frontend Architecture
- **Component-Based**: Reusable React components with TypeScript
- **State Management**: React Context API and React Query
- **Routing**: Client-side routing for SPAs
- **Styling**: Tailwind CSS with component library (shadcn/ui)

## Key Modules

### Backend Modules
- **auth/**: User authentication and JWT handling
- **crud/**: Database CRUD operations
- **models/**: SQLAlchemy database models
- **services/**: Business logic (auction, subscription, etc.)
- **routers/**: API endpoint definitions
- **blockchain/**: Blockchain integration and traceability
- **notification_service/**: Real-time WebSocket notifications

### Frontend Modules
- **auction/**: Auction browsing and bidding interface
- **auth/**: Login and signup components
- **consumer/**: Consumer-facing features
- **products/**: Product listing and details
- **common/**: Shared/common components

## Common Issues & Solutions

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify connection string in .env
- Check user permissions

### Frontend Not Connecting to Backend
- Verify backend is running on correct port (8000)
- Check CORS configuration in backend
- Verify VITE_API_URL environment variable

### WebSocket Connection Issues
- Ensure backend WebSocket endpoints are properly configured
- Check firewall settings
- Verify proper async context in browser console

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests to ensure everything works
4. Submit a pull request

## License

This project is part of the Smart India Hackathon initiative.

## Support

For issues and questions, please refer to the respective README files:
- [Frontend README](krishinetra-connect/README.md)
- [Backend README](backend/sih/README.md)

## Project Links

- **Frontend**: `krishinetra-connect/`
- **Backend**: `backend/sih/`
- **Alternative Frontend**: `pages/SIH_Frontend/`
