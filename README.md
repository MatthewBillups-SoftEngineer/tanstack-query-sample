# 🎬 Movie Search + Favorites Application

A full-stack movie search application built with Next.js frontend and NestJS backend, featuring movie search, favorites management, and infinite scrolling.

## 🚀 Features

### ✅ Core Requirements
- **Movie Search**: Search movies using OMDb API
- **Favorites Management**: Add/remove movies from favorites
- **REST API**: NestJS backend with proper endpoints
- **Modern Frontend**: Next.js with TypeScript and TanStack Query

### ✅ Bonus Features Implemented
- **Infinite Scrolling**: Automatic loading of more search results
- **Persistence**: Favorites saved in browser local storage
- **Unit Tests**: Comprehensive testing for both backend and frontend
- **Mobile-Friendly**: Responsive design that works on all devices
- **Scroll to Top**: Smooth scroll-to-top button
- **Loading States**: Clear loading indicators and error handling

## 🛠 Tech Stack

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Jest** - Testing framework
- **Axios** - HTTP client for OMDb API

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and state management
- **CSS3** - Responsive styling
- **Jest & Testing Library** - Component testing

## 📁 Project Structure
movie-search-app/
├── backend/ # NestJS application
├── frontend/ # Next.js application
├── README.md # This file
└── package.json # Root package.json (if any)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- OMDb API key ([Get one here](http://www.omdbapi.com/apikey.aspx))

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your OMDb API key to .env
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run tests
npm run test:cov      # Run tests with coverage
npm run test:watch    # Run tests in watch mode
```

### Frontend Tests
```bash
cd frontend
npm test              # Run tests
npm run test:cov      # Run tests with coverage
npm run test:watch    # Run tests in watch mode
```

## 📚 API Documentation

### Backend Endpoints
**Search Movies**
```
GET /movies/search?q={query}&page={page}
```
**Response:**
```json
{
  "movies": [
    {
      "imdbID": "tt1234567",
      "Title": "Movie Title",
      "Year": "2023",
      "Poster": "http://example.com/poster.jpg"
    }
  ],
  "totalResults": 100,
  "hasMore": true,
  "nextPage": 2
}
```

**Favorites**
```
GET    /favorites                    # Get all favorites
POST   /favorites                    # Add to favorites
DELETE /favorites/:imdbID           # Remove from favorites
```

## 🎯 Implementation Details

### Backend Architecture
- Modular Structure: Separate modules for movies and favorites
- Service Layer: Business logic separated from controllers
- Error Handling: Proper HTTP exceptions and error responses
- Environment Configuration: Secure API key management

### Frontend Architecture
- TanStack Query: Efficient data fetching, caching, and synchronization
- Component-Based: Reusable React components
- Infinite Scroll: Intersection Observer for automatic loading
- Local Storage: Favorites persistence across page reloads
- Responsive Design: Mobile-first CSS approach

### Key Features Explained
**Infinite Scrolling**
- Uses Intersection Observer API
- Automatic loading when scrolling near bottom
- Manual "Load More" button as fallback
- Proper loading states and error handling

**Favorites Persistence**
- Backend: In-memory storage (resets on server restart)
- Frontend: Browser local storage for persistence
- Synchronized state between backend and frontend

### Testing Strategy
- Backend: Unit tests for services and controllers
- Frontend: Component tests with mocked APIs
- Coverage: Comprehensive test coverage for critical paths

## 🔒 Production Considerations

**Security**
- Environment variable management
- Input validation and sanitization
- CORS configuration
- Rate limiting
- HTTPS enforcement

**Monitoring & Operations**
- Logging (Winston/Pino)
- Health checks
- Error tracking (Sentry)
- Metrics collection

**Infrastructure**
- Database persistence (PostgreSQL)
- Redis for caching
- Docker containerization
- CI/CD pipelines
- Load balancing

## 🤝 Development

### Backend Development
```bash
cd backend
npm run start:dev    # Development server with hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev          # Next.js development server
```

## 📱 Mobile Experience
- Touch-friendly interfaces
- Optimized layouts for mobile screens
- Smooth scrolling and interactions
- Readable typography and spacing

## 🎨 UI/UX Features
- Clean, modern interface
- Smooth animations and transitions
- Clear loading and error states
- Intuitive favorites management
- Search with debouncing
- Scroll to top functionality

## 📄 License
This project is for assessment purposes.

---
