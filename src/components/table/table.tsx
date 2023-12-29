import React, { ReactNode } from 'react';

interface TableProps {
  children: ReactNode; // childrenに型を明示的に指定
}

const Table: React.FC<TableProps> = ({ children }) => {
  const tableStyle = {
    background: 'linear-gradient(to right, #0d6321, #3c8d40)',
  };
  return <div style={tableStyle}>{children}</div>;
};

export default Table;
