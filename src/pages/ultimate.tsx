// Ultimate コンポーネント
import Card from '@/components/cards/card';
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';

export default function Ultimate() {
  const {
    game,
    player,
    dealerCards,
    playerCards,
    setPlayerCards,
    communityCards,
    blind,
    setBlind,
  } = useUltimate();
  const cardsContainerStyle = {
    minHeight: '160px',
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
    border: '1px solid white',
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
          <p>スタック: {player.getStack() - blind * 3}</p>
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
      <p>現在のアンティ額: {blind}</p>
      {player && game && (
        <button
          onClick={() => {
            game.betTable.betBlindAndAnti(player, blind);
            game.betTable.betTrips(player, blind);
            game.startNewRound();
            game.dealPreFlop();
            setPlayerCards(player.holeCard);
          }}
        >
          スタート
        </button>
      )}
    </div>
  );
}
