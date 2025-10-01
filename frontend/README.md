# 🎬 Movie Frontend

Next.js frontend for the Movie Search application with modern React patterns, infinite scrolling, and responsive design.

## 🚀 Features
- Movie search with real-time results
- Infinite scrolling for search results
- Favorites management with local storage persistence
- Responsive mobile-friendly design
- Comprehensive component testing
- Smooth animations and transitions

## 🛠 Tech Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching, caching, and state management
- **CSS3** - Responsive styling with modern features
- **Jest & Testing Library** - Component testing
- **Local Storage API** - Favorites persistence

## 📦 Installation

### Prerequisites
- Node.js 18+
- Backend server running

### Setup
```bash
npm install
cp .env.example .env
npm run dev
```
The application will run on http://localhost:3000

## 🧪 Testing
```bash
npm test
npm run test:watch
npm run test:cov
```

## 🏗 Project Structure
```
frontend/
├── components/
│   ├── MovieCard.tsx
│   └── __tests__/
├── hooks/
│   ├── api.ts
│   └── __tests__/
├── pages/
│   ├── index.tsx
│   ├── favorites.tsx
│   ├── _app.tsx
│   └── __tests__/
├── styles/
│   └── globals.css
└── public/
```

## 🎯 Key Features
**Infinite Scrolling**: Intersection Observer API, manual load fallback, loading states

**Favorites Persistence**: Backend synchronization, local storage, optimistic updates

**Responsive Design**: Mobile-first, flexible grid, touch-friendly

**TanStack Query Integration**: Efficient caching, background sync, optimistic updates, error retry

## 📱 Pages
- Search Page (/)
- Favorites Page (/favorites)

## 🔧 Development Scripts
```bash
npm run dev
npm run build
npm run start
```

Environment Variables: NEXT_PUBLIC_API_BASE_URL, PORT

## 🎨 UI/UX Features
- Responsive design, touch-optimized, smooth animations, intuitive interactions, scroll to top button

## 📐 Component Architecture
- MovieCard: displays movie info, favorite toggle, responsive
- Custom Hooks: useInfiniteSearchMovies, useFavorites, useAddToFavorites, useRemoveFromFavorites

## 🔄 State Management
- TanStack Query for server state
- Local state for search query, UI states

## 🚀 Production Deployment
- Image optimization, code splitting, bundle analysis, CDN configuration, performance monitoring
- Security: environment variable protection, CSP headers, XSS protection, API security

## 📝 Implementation Notes
- TanStack Query: caching, background sync, optimistic updates, error handling, loading states
- Local Storage Strategy: favorites stored backend & local, sync on load, fallback
- Infinite Scroll: Intersection Observer, manual load button fallback, proper cleanup

