// Ultimate コンポーネント
import Card from '@/components/cards/card';
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';

export default function Ultimate() {
  const {
    game,
    setGame,
    player,
    dealer,
    dealerCards,
    setDealerCards,
    playerCards,
    setPlayerCards,
    communityCards,
    setCommunityCards,
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
            <Card key={card.cardValue} card={card} />
          ))}
        </div>
        <div style={{ ...cardsContainerStyle, justifyContent: 'flex-end' }}>
          {communityCards.map((card, index) => (
            <Card key={card.cardValue} card={card} />
          ))}
        </div>
        <div style={cardsContainerStyle}>
          {playerCards.map((card, index) => (
            <Card key={card.cardValue} card={card} />
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
      {player && game && dealer && (
        <div>
          <button
            onClick={() => {
              console.log('no more bet');
              game.betTable.betBlindAndAnti(player, blind);
              game.betTable.betTrips(player, blind);
              game.startNewRound();
              game.dealPreFlop();
              setPlayerCards(player.holeCard);
            }}
          >
            スタート
          </button>
          <br />
          <button
            onClick={() => {
              game.betTable.betPreFlop(player, 3);
              game.dealFlop();
              setGame(game);
              setPlayerCards(game.communityCards);
            }}
          >
            ベット*3
          </button>
          <button
            onClick={() => {
              game.betTable.betPreFlop(player, 4);
              game.dealFlop();
              setGame(game);
              setPlayerCards(game.communityCards);
            }}
          >
            ベット*4
          </button>
          <button
            onClick={() => {
              game.dealFlop();
              setGame(game);
              setCommunityCards(game.communityCards);
            }}
          >
            チェック
          </button>
          <br />
          <button
            onClick={() => {
              game.betTable.betFlop(player);
              game.dealTurnRiver();
              setCommunityCards(game.communityCards);
            }}
          >
            ベット*2
          </button>
          <button
            onClick={() => {
              game.dealTurnRiver();
              setCommunityCards(game.communityCards);
            }}
          >
            チェック
          </button>
          <br />
          <button
            onClick={() => {
              game.betTable.betTurnRiver(player);
              game.openDealerCard();
              setDealerCards(dealer.holeCard);
            }}
          >
            ベット
          </button>
          <button
            onClick={() => {
              game.fold(player);
              game.openDealerCard();
              setDealerCards(dealer.holeCard);
            }}
          >
            フォールド
          </button>
        </div>
      )}
    </div>
  );
}
