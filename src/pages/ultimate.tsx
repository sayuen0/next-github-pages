// Ultimate コンポーネント
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';
import CardBlock from '@/components/cardBlock/cardBlock';
import {
  GameState,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { prettyPrint } from '@/lib/domain/model/game/texasHoldem/ultimate/types';
import { useState } from 'react';
import ActionButton from '@/components/ui/actionButton';

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

  const [resultMessage, setResultMessage] = useState('');

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
        setPlayerStack(player.getStack());
        game.dealFlop();
        setCommunityCards(game.communityCards);
        break;
      case 'checkPreFlop':
        game.dealFlop();
        setCommunityCards(game.communityCards);
        break;
      case 'betFlop':
        setBet(game.betFlop(player));
        setPlayerStack(player.getStack());
        game.dealTurnRiver();
        setCommunityCards(game.communityCards);
        break;
      case 'checkFlop':
        game.dealTurnRiver();
        setCommunityCards(game.communityCards);
        break;
      case 'betTurnRiver':
        setBet(game.betTurnRiver(player));
        setPlayerStack(player.getStack());
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
        setBlind(10), setTrips(10), setBet(0);

        setResultMessage('');
        break;
      default:
        console.error('Invalid bet type.');
        return;
    }
    const newGameState = game.gameState;
    setGameState(newGameState);
  };

  const finishRound = (game: UltimateTexasHoldem) => {
    const result = game.defineGameResult();
    setResultMessage(prettyPrint(result));

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
        <CardBlock cards={communityCards} style={{ justifyContent: 'flex-start' }} />
        <CardBlock cards={playerCards} />
      </Table>
      {player && (
        <div>
          <p>
            {player.name} <span> スタック: {playerStack}</span>
          </p>
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
        <span>現在のTrips額: {trips}</span> | <span>ベット額: {bet}</span> |{' '}
        <span>テーブル合計: {blind * 2 + trips + bet}</span>
      </p>
      <p>{resultMessage}</p>
      {player && game && dealer && (
        <div>
          {gameState === GameState.Start && (
            <ActionButton
              style={{ width: '30%' }}
              message="スタート"
              onClick={() => handleBet('start')}
            />
          )}
          {gameState === GameState.PreFlop && (
            <>
              <ActionButton
                style={{ width: '30%' }}
                message="ベット*4"
                onClick={() => handleBet('betPreFlop', 4)}
              />
              <ActionButton
                style={{ width: '30%' }}
                message="ベット*3"
                onClick={() => handleBet('betPreFlop', 3)}
              />
              <ActionButton
                style={{ width: '30%' }}
                message="チェック"
                onClick={() => handleBet('checkPreFlop')}
              />
            </>
          )}
          {gameState === GameState.Flop && (
            <>
              {bet === 0 && (
                <ActionButton
                  style={{ width: '30%' }}
                  message="ベット*2"
                  onClick={() => handleBet('betFlop')}
                />
              )}
              <ActionButton
                style={{ width: '30%' }}
                message="チェック"
                onClick={() => handleBet('checkFlop')}
              />
            </>
          )}
          {gameState === GameState.TurnRiver && (
            <>
              {bet === 0 ? (
                <>
                  <ActionButton
                    style={{ width: '30%' }}
                    message="ベット"
                    onClick={() => handleBet('betTurnRiver')}
                  />
                  <ActionButton
                    style={{ width: '30%' }}
                    message="フォールド"
                    onClick={() => handleBet('fold')}
                  />
                </>
              ) : (
                <>
                  <ActionButton
                    style={{ width: '30%' }}
                    message="チェック"
                    onClick={() => handleBet('checkTurnRiver')}
                  />
                </>
              )}
            </>
          )}
          {gameState === GameState.ShowDown && (
            <>
              <ActionButton
                style={{ width: '30%' }}
                message="リスタート"
                onClick={() => handleBet('restart')}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
