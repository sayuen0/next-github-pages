import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';
import {
  GamePhase,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { Player } from '@/lib/domain/model/players/player';
import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  DistributionResult,
  GameResult,
} from '@/lib/domain/model/game/texasHoldem/ultimate/types';

// 状態の型定義
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
  const newScore = { name: 'Player', stack: 1000 };
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
    trips: 10,
    bet: 0,
    result: null,
  };
}

// レデューサー関数
const gameReducer = (state: GameState, action: BetAction): GameState => {
  const { game, player, dealer } = state;
  if (!game || !player || !dealer) {
    console.error('Game, player, or dealer is not initialized.');
    return state;
  }

  switch (action.type) {
    case 'START':
      if (!game || !player || !dealer) {
        console.error('Game, player, or dealer is not initialized.');
        return state;
      }

      // ブラインドとアンティをベット
      const newBlind = state.blind;
      game.betBlindAndAnti(player, newBlind);
      // トリップスをベット
      const newTrips = game.betTrips(player, newBlind);

      // ラウンドを開始(シャッフルする)
      game.startNewRound();
      const newPlayerStack = player.getStack();

      // プレイヤーに2枚くばる
      game.dealPreFlop();
      const newPlayerCards = player.holeCard;

      return {
        ...state,
        gamePhase: game.gamePhase,
        blind: newBlind,
        trips: newTrips,
        playerStack: newPlayerStack,
        playerCards: newPlayerCards,
      };
    case 'BET_PREFLOP':
      // ベットしてテーブルに反映
      const newBet = game.betPreFlop(player, action.payload?.multiplier!);
      const newStack = player.getStack();
      game.dealFlop();
      const newCommunityCards = game.communityCards;
      return {
        ...state,
        gamePhase: game.gamePhase,
        bet: newBet,
        playerStack: newStack,
        communityCards: newCommunityCards,
      };
    case 'CHECK_PREFLOP':
      game.dealFlop();
      return {
        ...state,
        gamePhase: game.gamePhase,
        communityCards: game.communityCards,
      };
    case 'BET_FLOP':
      const bet = game.betFlop(player);
      const playerStackPreFlop = player.getStack();
      game.dealTurnRiver();
      return {
        ...state,
        gamePhase: game.gamePhase,
        bet,
        playerStack: playerStackPreFlop,
        communityCards: game.communityCards,
      };
    case 'CHECK_FLOP':
      game.dealTurnRiver();
      return {
        ...state,
        gamePhase: game.gamePhase,
        communityCards: game.communityCards,
      };
    case 'BET_TURN_RIVER':
      const betTurnRiver = game.betTurnRiver(player);
      game.showDown();
      const newDealerCards = dealer.holeCard;
      const { result, playerStack, distributionResults } = finishRound(game, player);

      return {
        ...state,
        gamePhase: game.gamePhase,
        bet: betTurnRiver,
        playerStack: playerStack,
        dealerCards: newDealerCards,
        result,
        distributionResults,
      };
    case 'CHECK_TURN_RIVER':
      game.showDown();
      const newDealerCardsCheck = dealer.holeCard;
      const {
        result: resultCheck,
        playerStack: playerStackCheck,
        distributionResults: distributionResultsCheck,
      } = finishRound(game, player);

      return {
        ...state,
        gamePhase: game.gamePhase,
        dealerCards: newDealerCardsCheck,
        result: resultCheck,
        playerStack: playerStackCheck,
        distributionResults: distributionResultsCheck,
      };
    case 'FOLD':
      game.fold(player);
      game.showDown();
      const newDealerCardsFold = dealer.holeCard;
      const {
        result: resultFold,
        playerStack: playerStackFold,
        distributionResults: distributionResultsFold,
      } = finishRound(game, player);

      return {
        ...state,
        gamePhase: game.gamePhase,
        dealerCards: newDealerCardsFold,
        result: resultFold,
        playerStack: playerStackFold,
        distributionResults: distributionResultsFold,
      };
    case 'RESTART':
      game.startNewRound();
      return {
        ...state,
        gamePhase: game.gamePhase,
        playerCards: [],
        communityCards: [],
        dealerCards: [],
        bet: 0,
        trips: 0,
        result: null,
        distributionResults: undefined,
      };

    default:
      console.error('Invalid action type');
      return state;
  }
};

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

export type BetActionType =
  | 'START'
  | 'BET_PREFLOP'
  | 'CHECK_PREFLOP'
  | 'BET_FLOP'
  | 'CHECK_FLOP'
  | 'BET_TURN_RIVER'
  | 'CHECK_TURN_RIVER'
  | 'FOLD'
  | 'RESTART';

interface BetAction {
  type: BetActionType;
  payload?: {
    multiplier?: 3 | 4;
  };
}

interface GameProviderProps {
  children: ReactNode;
}

interface GameContextType {
  state: GameState;
  dispatch: Dispatch<BetAction>;
}

export const GameContext = createContext<GameContextType>({
  // 初期状態とディスパッチ関数を提供
  state: initializeGameState(),
  dispatch: () => {}, // ダミーのディスパッチ関数
});

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initializeGameState());

  return (
    <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
  );
};
