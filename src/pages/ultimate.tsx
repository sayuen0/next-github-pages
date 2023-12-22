// Ultimate コンポーネント
import Card from '@/components/cards/card';
import { RandomPokerCardGenerator } from '@/lib/domain/model/cards/randomCardGenerator';

export default function Ultimate() {
  const cardsContainerStyle = {
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
  };

  return (
    <div>
      <h1>Ultimate</h1>
      <div style={cardsContainerStyle}>
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
      </div>
      <div style={cardsContainerStyle}>
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
      </div>
      <div style={cardsContainerStyle}>
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
        <Card card={RandomPokerCardGenerator.getRandomCard()} />
      </div>
    </div>
  );
}
