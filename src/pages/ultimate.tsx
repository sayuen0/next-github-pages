// Ultimate コンポーネント
import Table from '@/components/table/table';
import {
  GamePhase,
  getGamePhaseString,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { useEffect, useState } from 'react';
import ActionButton from '@/components/ui/actionButton';
import CardBlock from '@/components/cardBlock/cardBlock';
import ResultBoard from '@/components/resultBoard';
import { Player } from '@/lib/domain/model/players/player';
import {
  DistributionResult,
  GameResult,
} from '@/lib/domain/model/game/texasHoldem/ultimate/types';
import { PokerCard } from '@/lib/domain/model/cards/card';

export type BetActionType =
  | 'TRIPS'
  | 'START'
  | 'BET_PREFLOP'
  | 'CHECK_PREFLOP'
  | 'BET_FLOP'
  | 'CHECK_FLOP'
  | 'BET_TURN_RIVER'
  | 'CHECK_TURN_RIVER'
  | 'FOLD'
  | 'RESTART';

interface GameState {
  game: UltimateTexasHoldem;
  gamePhase: GamePhase;
  player: Player;
  playerStack: number;
  dealer: Player;
  dealerCards: PokerCard[];
  playerCards: PokerCard[];
  communityCards: PokerCard[];
  blind: number;
  trips: number;
  bet: number;
  result: GameResult | null;
  distributionResults?: DistributionResult[];
}

// 初期状態
function initializeGameState(): GameState {
  const newScore = { name: 'Player', stack: 500 };
  const newPlayer = new Player(newScore.name, newScore.stack);
  const dealer = new Player('Dealer', Number.MAX_SAFE_INTEGER);
  const newGame = new UltimateTexasHoldem(dealer, newPlayer);

  newGame.startNewRound();

  return {
    game: newGame,
    gamePhase: GamePhase.Start,
    player: newPlayer,
    playerStack: newPlayer.getStack(),
    dealer: dealer,
    dealerCards: [],
    playerCards: [],
    communityCards: [],
    blind: 10,
    trips: 0,
    bet: 0,
    result: null,
  };
}

export default function Ultimate() {
  const [state, setState] = useState<GameState>(initializeGameState());
  const {
    game,
    gamePhase,
    player,
    playerStack,
    dealer,
    dealerCards,
    playerCards,
    communityCards,
    blind,
    trips,
    bet,
    result,
    distributionResults,
  } = state;

  const [betType, setBetType] = useState<BetActionType | null>(null);

  useEffect(() => {
    switch (betType) {
      case 'TRIPS':
        const trips = game.betTrips(player, state.blind);
        setState({ ...state, trips: trips, playerStack: player.getStack() });
        break;

      case 'START':
        // ブラインドとアンティをベット
        const newBlind = state.blind;
        game.betBlindAndAnti(player, newBlind);

        // ラウンドを開始(シャッフルする)
        game.startNewRound();
        const newPlayerStack = player.getStack();

        // プレイヤーに2枚くばる
        game.dealPreFlop();
        const newPlayerCards = player.holeCard;

        setState({
          ...state,
          gamePhase: game.gamePhase,
          blind: newBlind,
          playerStack: newPlayerStack,
          playerCards: newPlayerCards,
        });
        break;

      case 'BET_PREFLOP':
        // ベットしてテーブルに反映
        const newBet = game.betPreFlop(player, 4);
        const newStack = player.getStack();
        game.dealFlop();
        const newCommunityCards = game.communityCards;

        setState({
          ...state,
          gamePhase: game.gamePhase,
          bet: newBet,
          playerStack: newStack,
          communityCards: newCommunityCards,
        });
        break;

      case 'CHECK_PREFLOP':
        game.dealFlop();
        setState({
          ...state,
          gamePhase: game.gamePhase,
          communityCards: game.communityCards,
        });
        break;

      case 'BET_FLOP':
        const bet = game.betFlop(player);
        const playerStackPreFlop = player.getStack();
        game.dealTurnRiver();
        setState({
          ...state,
          gamePhase: game.gamePhase,
          bet,
          playerStack: playerStackPreFlop,
          communityCards: game.communityCards,
        });
        break;

      case 'CHECK_FLOP':
        game.dealTurnRiver();
        setState({
          ...state,
          gamePhase: game.gamePhase,
          communityCards: game.communityCards,
        });
        break;

      case 'BET_TURN_RIVER':
        const betTurnRiver = game.betTurnRiver(player);
        game.showDown();
        const newDealerCards = dealer.holeCard;
        const { result, playerStack, distributionResults } = finishRound(game, player);

        setState({
          ...state,
          gamePhase: game.gamePhase,
          bet: betTurnRiver,
          playerStack: playerStack,
          dealerCards: newDealerCards,
          result,
          distributionResults,
        });
        break;

      case 'CHECK_TURN_RIVER':
        game.showDown();
        const newDealerCardsCheck = dealer.holeCard;
        const {
          result: resultCheck,
          playerStack: playerStackCheck,
          distributionResults: distributionResultsCheck,
        } = finishRound(game, player);

        setState({
          ...state,
          gamePhase: game.gamePhase,
          dealerCards: newDealerCardsCheck,
          result: resultCheck,
          playerStack: playerStackCheck,
          distributionResults: distributionResultsCheck,
        });
        break;
      case 'FOLD':
        game.fold(player);
        game.showDown();
        const newDealerCardsFold = dealer.holeCard;
        const {
          result: resultFold,
          playerStack: playerStackFold,
          distributionResults: distributionResultsFold,
        } = finishRound(game, player);

        setState({
          ...state,
          gamePhase: game.gamePhase,
          dealerCards: newDealerCardsFold,
          result: resultFold,
          playerStack: playerStackFold,
          distributionResults: distributionResultsFold,
        });
        break;
      case 'RESTART':
        game.startNewRound();
        setState({
          ...state,
          gamePhase: game.gamePhase,
          playerCards: [],
          communityCards: [],
          dealerCards: [],
          bet: 0,
          trips: 0,
          result: null,
          distributionResults: undefined,
        });
        break;

      default:
        break;
    }
  }, [betType]);

  const finishRound = (
    game: UltimateTexasHoldem,
    player: Player,
  ): {
    result: GameResult;
    playerStack: number;
    distributionResults: DistributionResult[];
  } => {
    const result = game.defineGameResult();

    // プレイヤーの配当を決める
    const distributionResults = game.distributeWinnings(result);

    // プレイヤーの現在のスタックを反映
    const newPlayerStack = player.getStack();

    return { result, playerStack: newPlayerStack, distributionResults };
  };

  const handleBet = (betType: BetActionType, multiplier?: 3 | 4) => {
    setBetType(betType);
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
      {player && game && dealer && (
        <div>
          {gamePhase === GamePhase.Start && (
            <>
              <ActionButton
                style={{ width: '30%', background: '#8bc34a', color: 'white' }}
                message="スタート"
                onClick={() => handleBet('START')}
              />
              {trips === 0 && (
                <ActionButton
                  style={{ width: '30%', background: 'orange', color: 'black' }}
                  message="Trips"
                  onClick={() => handleBet('TRIPS')}
                />
              )}
            </>
          )}
          {gamePhase === GamePhase.PreFlop && (
            <>
              <ActionButton
                style={{ width: '30%', background: '#4fc3f7', color: 'white' }}
                message="チェック"
                onClick={() => handleBet('CHECK_PREFLOP')}
              />
              {/*<ActionButton*/}
              {/*  style={{ width: '30%', background: '#ff5722', color: 'white' }}*/}
              {/*  message="ベット*3"*/}
              {/*  onClick={() => handleBet('BET_PREFLOP', 3)}*/}
              {/*/>*/}
              <ActionButton
                style={{ width: '30%', background: '#c62828', color: 'white' }}
                message="ベット*4"
                onClick={() => handleBet('BET_PREFLOP', 4)}
              />
            </>
          )}
          {gamePhase === GamePhase.Flop && (
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
          {gamePhase === GamePhase.TurnRiver && (
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
          {gamePhase === GamePhase.ShowDown && (
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
      <p>{getGamePhaseString(game?.gamePhase ?? GamePhase.Start)}</p>
      {result && <ResultBoard result={result} />}
      {distributionResults && (
        <p>
          {JSON.stringify((({ playerName, ...rest }) => rest)(distributionResults[0]))}
        </p>
      )}
      {player && (
        <ActionButton
          onClick={() => {
            if (window.confirm('リバイしますか？\n※進行中のゲームの状態は失われます')) {
              handleBet('RESTART');
              player.addToStack(300);
            }
          }}
          message="リバイ"
        ></ActionButton>
      )}
    </div>
  );
}
