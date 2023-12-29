import { convertSuitToDirectoryName, PokerCard } from '@/lib/domain/model/cards/card';
import Image from 'next/image';

interface CardProps {
  card: PokerCard;
}

// Card コンポーネント
export default function Card({ card }: CardProps) {
  const cardStyle = {
    width: '18%',
    height: 'auto', // アスペクト比を維持
    margin: '1%', // カード間のマージンを設定
  };

  const imagePath = card.visible
    ? `/static/img/cards/${convertSuitToDirectoryName(card.suit)}/${
        card.numberSymbol
      }.svg`
    : '/static/img/card/back/10.svg';

  return (
    <div style={cardStyle}>
      <Image
        src={imagePath}
        alt={card.visible ? card.cardValue : ''}
        layout="responsive"
        width={500} // 任意の値
        height={726} // 任意の値、アスペクト比を保つために width に対する比率を考慮
      />
    </div>
  );
}
