import { PokerCard } from '@/lib/domain/model/cards/card';
import Card from '@/components/card/card';

interface props {
  cards: PokerCard[];
  style?: React.CSSProperties;
}

export default function CardBlock({ cards, style }: props) {
  const cardsContainerStyle = {
    minHeight: '109px',
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
    border: '1px solid white',
    ...style,
  };
  return (
    <div style={cardsContainerStyle}>
      {cards.map((card, index) => (
        <Card key={card.cardValue} card={card} />
      ))}
    </div>
  );
}
