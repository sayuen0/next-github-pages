// Ultimate コンポーネント
import Card from '@/components/cards/card';
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';

export default function Ultimate() {
  const { game, player, dealerCards, playerCards, communityCards } = useUltimate();
  const cardsContainerStyle = {
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
  };

  return (
    <div>
      <Table>
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
      </Table>
      {player && (
        <div>
          <h2>{player.getName()}</h2>
          <p>スタック: {player.getStack()}</p>
        </div>
      )}
    </div>
  );
}
