// Ultimate コンポーネント
import Card from '@/components/cards/card';
import { RandomPokerCardGenerator } from '@/lib/domain/model/cards/randomCardGenerator';
import { useEffect, useState } from 'react';
import { PokerCard } from '@/lib/domain/model/cards/card';

export default function Ultimate() {
  const [dealerCards, setDealerCards] = useState<PokerCard[]>([]);
  const [playerCards, setPlayerCards] = useState<PokerCard[]>([]);
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([]);

  function generateRandomCards(count: number): PokerCard[] {
    return Array.from({ length: count }, () => RandomPokerCardGenerator.getRandomCard());
  }

  useEffect(() => {
    setDealerCards(generateRandomCards(2));
    setPlayerCards(generateRandomCards(2));
    setCommunityCards(generateRandomCards(5));
  }, []);

  const cardsContainerStyle = {
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
  };

  return (
    <div>
      <h1>Ultimate</h1>
      <div style={cardsContainerStyle}>
        {dealerCards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      <div style={cardsContainerStyle}>
        {communityCards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      <div style={cardsContainerStyle}>
        {playerCards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}
