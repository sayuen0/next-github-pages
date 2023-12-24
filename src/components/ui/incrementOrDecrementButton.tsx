import React, { useState } from 'react';

interface Props {
  text: string;
  onClick: () => void;
}

const MaterialButton = ({ text, onClick }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const baseStyle = {
    backgroundColor: 'gold',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '4px',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'box-shadow 0.2s',
  };

  const hoverStyle = {
    boxShadow: '0px 5px 12px rgba(0, 0, 0, 0.24)',
  };

  const clickStyle = {
    boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.16)',
  };

  let buttonStyle = { ...baseStyle };
  if (isHovered) buttonStyle = { ...buttonStyle, ...hoverStyle };
  if (isClicked) buttonStyle = { ...buttonStyle, ...clickStyle };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false);
      }}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default MaterialButton;
