interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  message: string;
  style?: React.CSSProperties;
  recommended?: boolean;
}

export default function ActionButton({ onClick, message, style, recommended }: Props) {
  // 推奨されたボタン用の追加スタイル
  const recommendedStyle = recommended
    ? {
        animation: 'blinking 1s infinite', // 点滅するアニメーションを追加
        border: '3px solid gold', // ゴールドの枠線を追加
        position: 'relative' as 'relative', // アイコンの位置設定用
      }
    : {};

  // 点滅するアニメーションのキーフレーム
  const blinkingKeyframes = `
    @keyframes blinking {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `;

  // ボタンの基本スタイル
  const buttonStyle = {
    backgroundColor: 'aquamarine',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '4px',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'box-shadow 0.2s',
    ...style,
    ...recommendedStyle, // 追加スタイルを組み込む
  };

  // 推奨されたボタン用のアイコンスタイル
  const iconStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '5%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.5em', // アイコンのサイズ
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {recommended && <span style={iconStyle}>⭐</span>} {/* アイコンの追加 */}
      {message}
      <style>{blinkingKeyframes}</style>
    </button>
  );
}
