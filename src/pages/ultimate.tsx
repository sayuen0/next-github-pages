// Ultimate コンポーネント
import Card from '@/components/cards/card';
import { PokerCard } from '@/lib/domain/model/card';

export default function Ultimate() {
  const cardsContainerStyle = {
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
  };

  return (
    <div>
      <h1>Ultimate</h1>
      <p>Ultimate</p>
      <div style={cardsContainerStyle}>
        <Card card={new PokerCard('AH')} />
        <Card card={new PokerCard('KC')} />
        <Card card={new PokerCard('JH')} />
        <Card card={new PokerCard('0D')} />
        <Card card={new PokerCard('8D')} />
      </div>
    </div>
  );
}
