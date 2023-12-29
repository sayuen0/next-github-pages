interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  message: string;
  style?: React.CSSProperties;
}

export default function ActionButton({ onClick, message, style }: Props) {
  // ボタンのスタイルを定義
  const buttonStyle = {
    backgroundColor: 'aquamarine',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '4px',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'box-shadow 0.2s',
    ...style,
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {message}
    </button>
  );
}
