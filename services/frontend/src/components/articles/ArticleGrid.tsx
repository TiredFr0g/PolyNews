import React from 'react';
import type { Article } from '../../services/api';
import { ArticleCard } from './ArticleCard';
import './Articles.css';

interface ArticleGridProps {
  articles: Article[];
  onFindSimilar: (id: string) => void;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, onFindSimilar }) => {
  if (articles.length === 0) return <p>No articles found.</p>;

  const [lead, ...rest] = articles;

  return (
    <div className="article-layout">
      {/* Lead Story */}
      <section className="lead-story">
        <h2 className="lead-title">
          <a href={lead.url} target="_blank" rel="noopener noreferrer">
            {lead.title}
          </a>
        </h2>
        <div className="article-meta lead-meta">
          <span className="source-badge">{lead.author || 'Hacker News'}</span>
          <span className="date">{new Date(lead.created_at).toLocaleDateString()}</span>
        </div>
        <button className="btn-primary" onClick={() => onFindSimilar(lead.id)}>
          Find Similar Stories
        </button>
      </section>

      <div className="editorial-divider"></div>

      {/* Grid */}
      <div className="article-grid">
        {rest.map(article => (
          <ArticleCard key={article.id} article={article} onFindSimilar={onFindSimilar} />
        ))}
      </div>
    </div>
  );
};
