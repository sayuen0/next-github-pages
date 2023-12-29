// Ultimate コンポーネント
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';
import CardBlock from '@/components/cardBlock/cardBlock';
import {
  GameState,
  getGameStateString,
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

  const handleBet = (
    betType:
      | 'start'
      | 'betPreFlop'
      | 'checkPreFlop'
      | 'betFlop'
      | 'checkFlop'
      | 'betTurnRiver'
      | 'checkTurnRiver'
      | 'fold'
      | 'restart',
    multiplier?: 3 | 4,
  ) => {
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
      case 'betPreFlop':
        // ベットしてテーブルに反映
        setBet(game.betPreFlop(player, multiplier!));
        game.dealFlop();
        setCommunityCards(game.communityCards);
        break;
      case 'checkPreFlop':
        game.dealFlop();
        setCommunityCards(game.communityCards);
        break;
      case 'betFlop':
        setBet(game.betFlop(player));
        game.dealTurnRiver();
        setCommunityCards(game.communityCards);
        break;
      case 'checkFlop':
        game.dealTurnRiver();
        setCommunityCards(game.communityCards);
        break;
      case 'betTurnRiver':
        setBet(game.betTurnRiver(player));
        // ショーダウン
        game.showDown();
        setDealerCards(dealer.holeCard);

        finishRound(game);

        break;
      case 'checkTurnRiver':
        // ショーダウン
        game.showDown();
        setDealerCards(dealer.holeCard);

        finishRound(game);
        break;
      case 'fold':
        game.fold(player);
        // 一応ショーダウン
        game.showDown();
        setDealerCards(dealer.holeCard);

        finishRound(game);
        break;
      case 'restart':
        game.startNewRound();
        // カードをリセット
        setPlayerCards([]), setCommunityCards([]), setDealerCards([]);
        // ブラインドなどをリセット
        setBlind(10);
        setTrips(10);
        setBet(0);
        break;
      default:
        console.error('Invalid bet type.');
        return;
    }
    const newGameState = game.gameState;
    setGameState(newGameState);
    console.log(game.gameState, gameState); // 2 1 とずれている
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
        <span>現在のblind額: {blind}</span> | <span>現在のアンティ額: {blind}</span> |{' '}
        <span>現在のTrips額: {trips}</span>
      </p>
      {gameState >= GameState.PreFlop && <p>ベット額: {bet}</p>}
      <p>テーブル合計: {blind * 2 + trips + bet}</p>
      <p>{getGameStateString(gameState)}</p>
      {player && game && dealer && (
        <div>
          {gameState === GameState.Start && (
            <button onClick={() => handleBet('start')}>スタート</button>
          )}
          {gameState === GameState.PreFlop && (
            <>
              <button onClick={() => handleBet('betPreFlop', 3)}>ベット*3</button>
              <button onClick={() => handleBet('betPreFlop', 4)}>ベット*4</button>
              <button onClick={() => handleBet('checkPreFlop')}>チェック</button>
            </>
          )}
          {gameState === GameState.Flop && (
            <>
              {bet === 0 && (
                <button onClick={() => handleBet('betFlop')}>ベット*2</button>
              )}
              <button onClick={() => handleBet('checkFlop')}>チェック</button>
            </>
          )}
          {gameState === GameState.TurnRiver && (
            <>
              {bet === 0 ? (
                <>
                  <button onClick={() => handleBet('betTurnRiver')}>ベット</button>
                  <button onClick={() => handleBet('fold')}>フォールド</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleBet('checkTurnRiver')}>チェック</button>
                </>
              )}
            </>
          )}
          {gameState === GameState.ShowDown && (
            <>
              <button onClick={() => handleBet('restart')}>リスタート</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
