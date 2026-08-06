import React from 'react';
import type { Article } from '../../services/api';
import { ArticleCard } from './ArticleCard';
import { X } from 'lucide-react';

interface SimilarOverlayProps {
  articles: Article[];
  isOpen: boolean;
  onClose: () => void;
  onFindSimilar: (id: string) => void;
}

export const SimilarOverlay: React.FC<SimilarOverlayProps> = ({ articles, isOpen, onClose, onFindSimilar }) => {
  if (!isOpen) return null;

  return (
    <div className="similar-overlay">
      <div className="similar-panel">
        <div className="panel-header">
          <h2>Related Insights</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>
        <div className="similar-list">
          {articles.length === 0 ? (
            <p>No similar articles found.</p>
          ) : (
            articles.map(article => (
              <ArticleCard key={article.id} article={article} onFindSimilar={onFindSimilar} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
