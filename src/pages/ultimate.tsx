// Ultimate コンポーネント
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';
import CardBlock from '@/components/cardBlock/cardBlock';
import {
  GameState,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';

export default function Ultimate() {
  const {
    game,
    gameState,
    setGameState,
    player,
    playerStack,
    setPlayerStack,
    dealer,
    dealerCards,
    setDealerCards,
    playerCards,
    setPlayerCards,
    communityCards,
    setCommunityCards,
    blind,
    setBlind,
    trips,
    setTrips,
    bet,
    setBet,
  } = useUltimate();

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(event.target.value); // Update the state with the new slider value
    setBlind(v);
    setTrips(v);
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
        // トリップスは一旦ブラインドと同額
        setTrips(game.betTrips(player, blind));
        game.startNewRound();
        // ベット後、スタックを反映
        setPlayerStack(player.getStack());

        // プリフロップを配る
        game.dealPreFlop();
        setPlayerCards(player.holeCard);

        break;
      case 'preFlop':
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
        setCommunityCards(game.communityCards);
        break;
      case 'turnRiver':
        game.betTurnRiver(player);
        // ショーダウン
        game.openDealerCard();
        setDealerCards(dealer.holeCard);

        finishRound(game);

        break;
      case 'fold':
        game.fold(player);
        // 一応ショーダウン
        game.openDealerCard();
        setDealerCards(dealer.holeCard);

        finishRound(game);
        break;
      default:
        console.error('Invalid bet type.');
        return;
    }
    setGameState(game.gameState);
  };

  const finishRound = (game: UltimateTexasHoldem) => {
    const result = game.defineGameResult();
    console.log(JSON.stringify(result, null, 2));

    // プレイヤーの配当を決める
    game.distributeWinnings(result);
    // プレイヤーの現在のスタックを反映
    setPlayerStack(player!.getStack());

    // ブラインドとアンティとTripsをリセット
    setBlind(0);
    setTrips(0);
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
          <p>スタック: {playerStack}</p>
        </div>
      )}
      {player && (
        <Slider
          disabled={gameState !== GameState.Start}
          min={10}
          max={playerStack / 6}
          step={10}
          onChange={handleSliderChange}
        />
      )}
      <p>
        <span>現在のベット額: {blind}</span> | <span>現在のアンティ額: {blind}</span> |{' '}
        <span>現在のTrips額: {trips}</span>
      </p>
      <p>テーブル合計: {blind * 2 + trips}</p>
      {gameState >= GameState.PreFlop && <p>ベット額: {bet}</p>}
      {player && game && dealer && (
        <div>
          {gameState === GameState.Start && (
            <button onClick={() => handleBet('start')}>スタート</button>
          )}
          {gameState === GameState.PreFlop && (
            <>
              <button onClick={() => handleBet('preFlop', 3)}>ベット*3</button>
              <button onClick={() => handleBet('preFlop', 4)}>ベット*4</button>
              <button onClick={() => handleBet('checkPreFlop')}>チェック</button>
            </>
          )}
          {gameState === GameState.Flop && (
            <>
              <button onClick={() => handleBet('flop')}>ベット*2</button>
              <button onClick={() => handleBet('checkFlop')}>チェック</button>
            </>
          )}
          {gameState === GameState.TurnRiver && (
            <>
              <button onClick={() => handleBet('turnRiver')}>ベット</button>
              <button onClick={() => handleBet('fold')}>フォールド</button>
            </>
          )}
          {gameState === GameState.ShowDown && (
            <>
              <button onClick={() => handleBet('start')}>リスタート</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
