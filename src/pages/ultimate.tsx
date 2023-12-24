// Ultimate コンポーネント
import Card from '@/components/cards/card';
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';

export default function Ultimate() {
  const { game, player, dealerCards, playerCards, communityCards, blind, setBlind } =
    useUltimate();
  const cardsContainerStyle = {
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(event.target.value); // Update the state with the new slider value
    setBlind(v);
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
      {player && (
        <Slider
          min={10}
          max={player.getStack() / 6}
          step={10}
          onChange={handleSliderChange}
        />
      )}
      <p>現在のベット額: {blind}</p>
    </div>
  );
}
