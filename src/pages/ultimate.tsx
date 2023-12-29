// Ultimate コンポーネント
import Table from '@/components/table/table';
import { useUltimate } from '@/hooks/useUltimate';
import Slider from '@/components/ui/slider';
import {
  GameState,
  getGameStateString,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { prettyPrint } from '@/lib/domain/model/game/texasHoldem/ultimate/types';
import { useState } from 'react';
import ActionButton from '@/components/ui/actionButton';
import CardBlock from '@/components/cardBlock/cardBlock';
import { saveScore } from '@/lib/storage/localStorage';

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
        // プレイだけリセット(選択があった場合blindなどは前回の値に戻す)
        setBet(0);

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

    // ローカルストレージに保存
    saveScore({ name: player!.name, stack: player!.getStack() });

    // プレイヤーの現在のスタックを反映
    setPlayerStack(player!.getStack());
  };

  return (
    <div>
      <Table
        cardBlocks={
          <>
            <CardBlock cards={dealerCards} />
            <CardBlock cards={communityCards} style={{ justifyContent: 'flex-start' }} />
            <CardBlock cards={playerCards} />
          </>
        }
        betTable={
          <ul style={{ color: 'white', listStyle: 'none', paddingLeft: '5px' }}>
            <li>
              <span>Blind: {blind}</span>
            </li>
            <li>
              <span>Anti: {blind}</span>
            </li>
            <li>
              <span>Trips: {trips}</span>
            </li>
            <li>
              <span>Bet: {bet}</span>
            </li>
            <li>
              <span>合計: {blind * 2 + trips + bet}</span>
            </li>
            {player && (
              <li>
                {player.name} <span> スタック: {playerStack}</span>
              </li>
            )}
          </ul>
        }
      ></Table>
      {player && (
        <Slider
          disabled={gameState !== GameState.Start}
          min={10}
          // maxはスタックの6分の1の10の倍数で切り捨て
          max={Math.floor(playerStack / 60) * 10}
          step={10}
          onChange={handleSliderChange}
        />
      )}
      {player && game && dealer && (
        <div>
          {gameState === GameState.Start && (
            <ActionButton
              style={{ width: '30%', background: '#8bc34a', color: 'white' }}
              message="スタート"
              onClick={() => handleBet('start')}
            />
          )}
          {gameState === GameState.PreFlop && (
            <>
              <ActionButton
                style={{ width: '30%', background: '#4fc3f7', color: 'white' }}
                message="チェック"
                onClick={() => handleBet('checkPreFlop')}
              />
              <ActionButton
                style={{ width: '30%', background: '#ff5722', color: 'white' }}
                message="ベット*3"
                onClick={() => handleBet('betPreFlop', 3)}
              />
              <ActionButton
                style={{ width: '30%', background: '#c62828', color: 'white' }}
                message="ベット*4"
                onClick={() => handleBet('betPreFlop', 4)}
              />
            </>
          )}
          {gameState === GameState.Flop && (
            <>
              <ActionButton
                style={{ width: '30%', background: '#4fc3f7', color: 'white' }}
                message="チェック"
                onClick={() => handleBet('checkFlop')}
              />

              {bet === 0 && (
                <ActionButton
                  style={{ width: '30%', background: '#ff9800', color: 'white' }}
                  message="ベット*2"
                  onClick={() => handleBet('betFlop')}
                />
              )}
            </>
          )}
          {gameState === GameState.TurnRiver && (
            <>
              {bet === 0 ? (
                <>
                  <ActionButton
                    style={{ width: '30%', background: '#aed581' }}
                    message="ベット"
                    onClick={() => handleBet('betTurnRiver')}
                  />
                  <ActionButton
                    style={{ width: '30%', background: 'gray' }}
                    message="フォールド"
                    onClick={() => handleBet('fold')}
                  />
                </>
              ) : (
                <>
                  <ActionButton
                    style={{ width: '30%', background: '#4fc3f7', color: 'white' }}
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
                style={{ width: '30%', background: '#8bc34a', color: 'white' }}
                message="リスタート"
                onClick={() => handleBet('restart')}
              />
            </>
          )}
        </div>
      )}
      <p>{getGameStateString(game?.gameState ?? GameState.Start)}</p>
      <p>{resultMessage}</p>
    </div>
  );
}
