import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="editorial-header">
      <div className="header-top">
        <h1 className="logo">The Knowledge <span>Feed</span></h1>
        {user && (
          <div className="header-actions">
            <span className="user-email">{user.email}</span>
            <button onClick={logout} className="btn-outline">Sign Out</button>
          </div>
        )}
      </div>
      <div className="header-bottom">
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search articles semantically..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="editorial-divider"></div>
    </header>
  );
};
