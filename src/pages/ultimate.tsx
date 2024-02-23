// Ultimate コンポーネント
import Table from '@/components/table/table';
import {
  GamePhase,
  getGamePhaseString,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { GameResult } from '@/lib/domain/model/game/texasHoldem/ultimate/types';
import { useContext, useState } from 'react';
import ActionButton from '@/components/ui/actionButton';
import CardBlock from '@/components/cardBlock/cardBlock';
import { saveScore } from '@/lib/storage/localStorage';
import ResultBoard from '@/components/resultBoard';
import {
  BetActionType,
  GameContext,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimateContext';

export default function Ultimate() {
  // const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const v = Number(event.target.value); // Update the state with the new slider value
  //   setBlind(v);
  //   setTrips(v);
  // };

  const { state, dispatch } = useContext(GameContext);
  const {
    game,
    gameState,
    player,
    playerStack,
    dealer,
    dealerCards,
    playerCards,
    communityCards,
    blind,
    trips,
    bet,
  } = state;

  const [result, setResult] = useState<GameResult | null>(null);

  const handleBet = (betType: BetActionType, multiplier?: 3 | 4) => {
    dispatch({
      type: betType,
      payload: { multiplier },
    });
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
          <>
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
          </>
        }
      ></Table>
      {/*{player && (*/}
      {/*  <Slider*/}
      {/*    disabled={gameState !== GamePhase.Start}*/}
      {/*    min={10}*/}
      {/*    // maxはスタックの6分の1の10の倍数で切り捨て*/}
      {/*    max={Math.floor(playerStack / 60) * 10}*/}
      {/*    step={10}*/}
      {/*    onChange={handleSliderChange}*/}
      {/*  />*/}
      {/*)}*/}
      {player && game && dealer && (
        <div>
          {gameState === GamePhase.Start && (
            <ActionButton
              style={{ width: '30%', background: '#8bc34a', color: 'white' }}
              message="スタート"
              onClick={() => handleBet('START')}
            />
          )}
          {gameState === GamePhase.PreFlop && (
            <>
              <ActionButton
                style={{ width: '30%', background: '#4fc3f7', color: 'white' }}
                message="チェック"
                onClick={() => handleBet('CHECK_PREFLOP')}
              />
              <ActionButton
                style={{ width: '30%', background: '#ff5722', color: 'white' }}
                message="ベット*3"
                onClick={() => handleBet('BET_PREFLOP', 3)}
              />
              <ActionButton
                style={{ width: '30%', background: '#c62828', color: 'white' }}
                message="ベット*4"
                onClick={() => handleBet('BET_PREFLOP', 4)}
              />
            </>
          )}
          {gameState === GamePhase.Flop && (
            <>
              <ActionButton
                style={{ width: '30%', background: '#4fc3f7', color: 'white' }}
                message="チェック"
                onClick={() => handleBet('CHECK_FLOP')}
              />

              {bet === 0 && (
                <ActionButton
                  style={{ width: '30%', background: '#ff9800', color: 'white' }}
                  message="ベット*2"
                  onClick={() => handleBet('BET_FLOP')}
                />
              )}
            </>
          )}
          {gameState === GamePhase.TurnRiver && (
            <>
              {bet === 0 ? (
                <>
                  <ActionButton
                    style={{ width: '30%', background: '#aed581' }}
                    message="ベット"
                    onClick={() => handleBet('BET_TURN_RIVER')}
                  />
                  <ActionButton
                    style={{ width: '30%', background: 'gray' }}
                    message="フォールド"
                    onClick={() => handleBet('FOLD')}
                  />
                </>
              ) : (
                <>
                  <ActionButton
                    style={{ width: '30%', background: '#4fc3f7', color: 'white' }}
                    message="チェック"
                    onClick={() => handleBet('CHECK_TURN_RIVER')}
                  />
                </>
              )}
            </>
          )}
          {gameState === GamePhase.ShowDown && (
            <>
              <ActionButton
                style={{ width: '30%', background: '#8bc34a', color: 'white' }}
                message="リスタート"
                onClick={() => handleBet('RESTART')}
              />
            </>
          )}
        </div>
      )}
      <p>{getGamePhaseString(game?.gameState ?? GamePhase.Start)}</p>
      {result && <ResultBoard result={result} />}
      {player && (
        <ActionButton
          onClick={() => {
            if (window.confirm('リバイしますか？\n※進行中のゲームの状態は失われます')) {
              handleBet('RESTART');
              player.addToStack(300);
              saveScore({ name: player.name, stack: player.getStack() });
            }
          }}
          message="リバイ"
        ></ActionButton>
      )}
    </div>
  );
}
