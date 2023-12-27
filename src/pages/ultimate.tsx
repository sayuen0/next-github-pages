// Ultimate コンポーネント
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';
import { useState } from 'react';
import CardBlock from '@/components/cardBlock/cardBlock';

export default function Ultimate() {
  const {
    game,
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

  const [sliderDisabled, setSliderDisabled] = useState(false);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(event.target.value); // Update the state with the new slider value
    setBlind(v);
  };

  const handleBet = (betType: string, multiplier?: 3 | 4) => {
    if (!game || !player || !dealer) {
      console.error('Game, player, or dealer is not initialized.');
      return;
    }

    switch (betType) {
      case 'start':
        console.log('no more bet');
        game.betBlindAndAnti(player, blind);
        setBlind(blind);
        game.betTrips(player, blind);
        game.startNewRound();
        game.dealPreFlop();
        setPlayerCards(player.holeCard);

        // disable slider
        setSliderDisabled(true);

        break;
      case 'preFlop':
        console.log('bet on preflop');
        game.betPreFlop(player, multiplier!);
        game.dealFlop();
        setCommunityCards(game.communityCards);
        break;
      case 'checkPreFlop':
        game.dealFlop();
        setCommunityCards(game.communityCards);
        break;
      case 'flop':
        game.betFlop(player);
        game.dealTurnRiver();
        setCommunityCards(game.communityCards);
        break;
      case 'checkFlop':
        console.log('check on flop');
        game.dealTurnRiver();
        setCommunityCards([]);
        setCommunityCards(game.communityCards);
        break;
      case 'turnRiver':
        game.betTurnRiver(player);
        game.openDealerCard();
        setDealerCards(dealer.holeCard);
        break;
      case 'fold':
        game.fold(player);
        game.openDealerCard();
        setDealerCards(dealer.holeCard);
        break;
      default:
        console.error('Invalid bet type.');
        break;
    }
  };

  return (
    <div>
      <Table>
        <CardBlock cards={dealerCards} />
        <CardBlock cards={communityCards} />
        <CardBlock cards={playerCards} />
      </Table>
      {player && (
        <div>
          <h2>{player.getName()}</h2>
          <p>スタック: {player.getStack()}</p>
        </div>
      )}
      {player && (
        <Slider
          disabled={sliderDisabled}
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
          <button onClick={() => handleBet('start')}>スタート</button>
          <br />
          <button onClick={() => handleBet('preFlop', 3)}>ベット*3</button>
          <button onClick={() => handleBet('preFlop', 4)}>ベット*4</button>
          <button onClick={() => handleBet('checkPreFlop')}>チェック</button>
          <br />
          <button onClick={() => handleBet('flop')}>ベット*2</button>
          <button onClick={() => handleBet('checkFlop')}>チェック</button>
          <br />
          <button onClick={() => handleBet('turnRiver')}>ベット</button>
          <button onClick={() => handleBet('fold')}>フォールド</button>
        </div>
      )}
    </div>
  );
}
