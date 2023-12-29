import { convertSuitToDirectoryName, PokerCard } from '@/lib/domain/model/cards/card';

interface CardProps {
  card: PokerCard;
}

// Card コンポーネント
export default function Card({ card }: CardProps) {
  const cardStyle = {
    width: '18%', // 画面幅の18%に設定
    height: 'auto', // アスペクト比を維持
    maxHeight: '100px', // 画面の高さいっぱいに設定
    margin: '1%', // カード間のマージンを設定
  };

  const imagePath = card.visible
    ? `/static/img/cards/${convertSuitToDirectoryName(card.suit)}/${
        card.numberSymbol
      }.svg`
    : '/static/img/cards/back/10.svg';

  return (
    // TODO: Imageに置き換えると良いらしい
    <img src={imagePath} style={cardStyle} alt={card.visible ? card.cardValue : ''} />
  );
}
