# 🎬 Movie Backend

NestJS backend for the Movie Search application providing REST API endpoints for movie search and favorites management.

## 🚀 Features

- **Movie Search**: Integration with OMDb API for searching movies
- **Favorites Management**: Add, remove, and list favorite movies
- **Infinite Scroll Support**: Paginated responses with `hasMore` indicator
- **Comprehensive Testing**: Unit tests for services and controllers
- **Environment Configuration**: Secure API key management
- **RESTful API**: Clean, predictable API endpoints
- **Error Handling**: Proper HTTP exceptions and error responses
- **CORS Enabled**: Configured for frontend development

## 🛠 Tech Stack

- **NestJS 10** - Progressive Node.js framework for efficient, scalable server-side applications
- **TypeScript** - Type safety and enhanced developer experience
- **Jest** - Comprehensive testing framework
- **Axios** - HTTP client for OMDb API integration
- **@nestjs/config** - Environment-based configuration management
- **@nestjs/axios** - Integrated HTTP module for external API calls

## 📦 Installation & Setup

### Prerequisites
- Node.js 18 or higher
- OMDb API key ([Get free API key](http://www.omdbapi.com/apikey.aspx))

### Step-by-Step Setup

1. **Navigate to backend directory**
```bash
cd backend
```
2. **Install dependencies**
```bash
npm install
```
3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env file with your OMDb API key
env
OMDB_API_KEY=your_actual_omdb_api_key_here
```
4. **Start the development server**
```bash
npm run start:dev
```
The backend server will start on http://localhost:3001

## 🧪 Testing

### Test Commands
```bash
npm test              # Run all unit tests
npm run test:watch    # Run tests in watch mode (development)
npm run test:cov      # Run tests with coverage report
npm run test:debug    # Run tests with debugger
```

### Test Coverage
Our testing strategy includes:
- **MoviesService**: Business logic for movie search and data transformation
- **FavoritesService**: In-memory favorites management operations
- **MoviesController**: HTTP request handling and response formatting
- **Error Scenarios**: API failures, invalid responses, edge cases

### Test Structure
```
src/
├── movies/
│   ├── movies.service.spec.ts      # Service unit tests
│   └── movies.controller.spec.ts   # Controller unit tests
├── favorites/
│   └── favorites.service.spec.ts   # Service unit tests
```

### Example Test Run
```bash
> movie-backend@1.0.0 test
> jest

 PASS  src/movies/movies.service.spec.ts
 PASS  src/favorites/favorites.service.spec.ts
 PASS  src/movies/movies.controller.spec.ts

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        3.2 s
```

## 🏗 Project Structure
```
src/
├── movies/
│   ├── movies.controller.ts     # REST endpoints for movie search
│   ├── movies.service.ts        # Business logic and OMDb integration
│   ├── movies.module.ts         # Dependency injection configuration
│   └── *.spec.ts               # Comprehensive test files
├── favorites/
│   ├── favorites.controller.ts  # REST endpoints for favorites
│   ├── favorites.service.ts     # In-memory favorites management
│   ├── favorites.module.ts      # Dependency injection configuration
│   └── *.spec.ts               # Comprehensive test files
├── app.module.ts               # Root module configuration
└── main.ts                    # Application bootstrap
```

## 📡 API Documentation

### Movie Search Endpoint
```
GET /movies/search?q={query}&page={page}
```
**Parameters:**
- q (required): Search query string (e.g., "batman")
- page (optional): Page number for pagination, defaults to 1

**Success Response (200):**
```json
{
  "movies": [
    {
      "imdbID": "tt0372784",
      "Title": "Batman Begins",
      "Year": "2005",
      "Poster": "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
    }
  ],
  "totalResults": 425,
  "hasMore": true,
  "nextPage": 2
}
```
**Error Responses:**
- 400 Bad Request: Missing search query
- 500 Internal Server Error: OMDb API failure

### Favorites Management Endpoints
- **Get All Favorites**: `GET /favorites`
- **Add Movie to Favorites**: `POST /favorites` (JSON payload with movie info)
- **Remove Movie from Favorites**: `DELETE /favorites/:imdbID`

## ⚙️ Configuration
**Environment Variables**
| Variable | Description | Default |
|----------|-------------|---------|
| OMDB_API_KEY | Your OMDb API key | Required |
| PORT | Server port number | 3001 |

**CORS Configuration**
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

## 🔧 Development Scripts
```bash
npm run start:dev      # Development server with hot reload
npm run start:debug    # Development server with debug mode
npm run build          # Build the project for production
npm run start:prod     # Run production build
npm run format         # Format code with Prettier
```

## 🎯 Implementation Details

**OMDb API Integration**
- Rate Limit Aware: Handles API limitations gracefully
- Error Resilient: Proper error handling for network issues
- Data Transformation: Converts OMDb responses to consistent format
- Pagination Support: Implements OMDb's pagination system

**Data Persistence**
- In-Memory Storage: Favorites stored in memory (resets on server restart)
- Simple & Fast: No database dependencies for this implementation
- Production Ready: Can be easily extended with database integration

**Response Formatting**
- Consistent Structure: Uniform response format across all endpoints
- Pagination Metadata: `hasMore` and `nextPage` for infinite scroll
- Error Standardization: Consistent error messages and status codes

## 🚀 Production Deployment Considerations

**Security Enhancements**
- Rate limiting (express-rate-limit)
- Input validation (class-validator)
- Helmet.js for security headers
- Request logging and monitoring

**Database Integration**
- PostgreSQL with TypeORM
- MongoDB with Mongoose
- Redis for caching

**Monitoring & Operations**
- Health check endpoints (/health)
- Structured logging with Winston/Pino
- Metrics collection with Prometheus
- Error tracking with Sentry

## 📝 API Integration Notes

**OMDb API Characteristics**
- Returns max 10 results per page
- Requires API key for all requests
- Has daily request limits (1000 for free tier)
- Returns "N/A" for missing poster images

**Error Handling Strategy**
```typescript
try {
  // API call to OMDb
} catch (error) {
  console.error('OMDb API Error:', error);
  throw new HttpException(
    'Failed to fetch movies from OMDb API',
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}
```

## 🔍 Example Usage

**Search for Movies**
```bash
curl "http://localhost:3001/movies/search?q=avengers&page=1"
```
**Add to Favorites**
```bash
curl -X POST http://localhost:3001/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "imdbID": "tt0848228",
    "Title": "The Avengers",
    "Year": "2012",
    "Poster": "https://example.com/poster.jpg"
  }'
```
**Get Favorites**
```bash
curl http://localhost:3001/favorites
```

## 🤝 Contributing
- Follow the existing code structure and patterns
- Write comprehensive tests for new features
- Update documentation for API changes
- Use TypeScript for type safety
