import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      {children}
    </div>
  );
};
