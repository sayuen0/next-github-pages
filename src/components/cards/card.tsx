import { convertSuitToDirectoryName, PokerCard } from '@/lib/domain/model/card';

interface CardProps {
  card: PokerCard;
}

// Card コンポーネント
export default function Card({ card }: CardProps) {
  const cardStyle = {
    width: '18%', // 画面幅の18%に設定
    height: 'auto', // アスペクト比を維持
    margin: '1%', // カード間のマージンを設定
  };

  const imagePath = `/static/img/cards/${convertSuitToDirectoryName(card.suit)}/${
    card.numberSymbol
  }.svg`;

  return <img src={imagePath} style={cardStyle} alt="King of Spades" />;
}
