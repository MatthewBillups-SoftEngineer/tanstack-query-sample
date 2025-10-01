import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../styles/globals.css'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">🎬 Movie Search</h1>
            <div className="nav-links">
              <a href="/" className="nav-link">Search</a>
              <a href="/favorites" className="nav-link">Favorites</a>
            </div>
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  )
}
