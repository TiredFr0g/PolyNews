import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { Header } from './components/layout/Header';
import { Layout } from './components/layout/Layout';
import { ArticleGrid } from './components/articles/ArticleGrid';
import { SimilarOverlay } from './components/articles/SimilarOverlay';
import { api } from './services/api';
import type { Article } from './services/api';

function FeedApp() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [similarArticles, setSimilarArticles] = useState<Article[]>([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user]);

  const loadFeed = async () => {
    try {
      const res = await api.get<Article[]>('/feed?limit=30');
      setArticles(res.data);
    } catch (e) {
      console.error('Failed to load feed', e);
    }
  };

  const handleSearch = async (query: string) => {
    // Semantic search stub - backend would generate embedding for query text here
    alert('Semantic Search coming soon! (Backend needs Cohere API integration for the query string)');
    // If backend was ready: const res = await api.get<Article[]>(`/ranking/search?query=${query}`);
  };

  const handleFindSimilar = async (id: string) => {
    setIsOverlayOpen(true);
    setSimilarArticles([]); // clear previous
    try {
      const res = await api.get<Article[]>(`/ranking/similar/${id}`);
      setSimilarArticles(res.data);
    } catch (e) {
      console.error('Failed to load similar articles', e);
    }
  };

  return (
    <Layout>
      <Header onSearch={handleSearch} />
      <AuthModal />
      
      {user && (
        <ArticleGrid articles={articles} onFindSimilar={handleFindSimilar} />
      )}

      <SimilarOverlay 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
        articles={similarArticles} 
        onFindSimilar={handleFindSimilar} 
      />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <FeedApp />
    </AuthProvider>
  );
}

export default App;
