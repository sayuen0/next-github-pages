import { PokerCard } from '@/lib/domain/model/cards/card';
import Card from '@/components/cards/card';

interface props {
  cards: PokerCard[];
}

export default function CardBlock({ cards }: props) {
  const cardsContainerStyle = {
    minHeight: '160px',
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
    border: '1px solid white',
  };
  return (
    <div style={cardsContainerStyle}>
      {cards.map((card, index) => (
        <Card key={card.cardValue} card={card} />
      ))}
    </div>
  );
}
