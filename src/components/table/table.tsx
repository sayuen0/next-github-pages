import React, { ReactNode } from 'react';

interface TableProps {
  children: ReactNode; // childrenに型を明示的に指定
}

const Table: React.FC<TableProps> = ({ children }) => {
  const tableStyle = {
    backgroundColor: 'green',
  };
  return <div style={tableStyle}>{children}</div>;
};

export default Table;
