import React, { ReactNode } from 'react';

interface TableProps {
  cardBlocks: ReactNode;
  betTable: ReactNode;
}

const Table: React.FC<TableProps> = ({ cardBlocks, betTable }) => {
  const tableStyle = {
    display: 'flex',
    height: '50vh',
    background: 'linear-gradient(to right, #0d6321, #3c8d40)',
  };
  const flexColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  };
  return (
    <div style={tableStyle}>
      <div
        style={{
          ...{ flexColumnStyle },
          width: '70%',
        }}
      >
        {cardBlocks}
      </div>
      <div
        style={{
          width: '30%',
          ...{ flexColumnStyle },
          flexGrow: 1,
        }}
      >
        <div style={{ flexGrow: 1 }}>{betTable}</div>
      </div>
    </div>
  );
};

export default Table;
