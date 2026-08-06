import React from 'react';
import type { Article } from '../../services/api';

interface ArticleCardProps {
  article: Article;
  onFindSimilar: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onFindSimilar }) => {
  return (
    <article className="article-card">
      {article.similarity && (
        <div className="match-badge">
          Match: {(article.similarity * 100).toFixed(1)}%
        </div>
      )}
      {article.image_url ? (
        <img className="article-image" src={article.image_url} alt="" loading="lazy" />
      ) : (
        <div className="article-image-placeholder" />
      )}
      <h3 className="article-title">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title || 'Untitled'}
        </a>
      </h3>
      <div className="article-meta">
        <span className="source-badge">{article.author || 'Hacker News'}</span>
        <span className="date">{new Date(article.created_at).toLocaleDateString()}</span>
      </div>
      <div className="article-actions">
        <button className="btn-outline" onClick={() => onFindSimilar(article.id)}>
          Find Similar
        </button>
      </div>
    </article>
  );
};
