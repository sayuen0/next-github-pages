import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';
import {
  GamePhase,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { Player } from '@/lib/domain/model/players/player';
import { PokerCard } from '@/lib/domain/model/cards/card';

// 状態の型定義
interface GameState {
  game: UltimateTexasHoldem | null;
  gameState: GamePhase;
  player: Player | null;
  playerStack: number;
  dealer: Player | null;
  dealerCards: PokerCard[];
  playerCards: PokerCard[];
  communityCards: PokerCard[];
  blind: number;
  trips: number;
  bet: number;
  // その他の状態...
}

// 初期状態
const initialState: GameState = {
  game: null,
  gameState: GamePhase.Start,
  player: null,
  playerStack: 0,
  dealer: null,
  dealerCards: [],
  playerCards: [],
  communityCards: [],
  blind: 10,
  trips: 10,
  bet: 0,
};

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
        bet: newBet,
        playerStack: newStack,
        communityCards: newCommunityCards,
      };
    case 'CHECK_PREFLOP':
      game.dealFlop();
      return {
        ...state,
        communityCards: game.communityCards,
      };
    case 'BET_FLOP':
      const bet = game.betFlop(player);
      const playerStack = player.getStack();
      game.dealTurnRiver();
      return {
        ...state,
        bet,
        playerStack,
        communityCards: game.communityCards,
      };
    case 'CHECK_FLOP':
      game.dealTurnRiver();
      return {
        ...state,
        communityCards: game.communityCards,
      };
    case 'BET_TURN_RIVER':
      const betTurnRiver = game.betTurnRiver(player);
      const playerStackTurnRiver = player.getStack();
      game.showDown();
      const newDealerCards = dealer.holeCard;
      return {
        ...state,
        bet: betTurnRiver,
        playerStack: playerStackTurnRiver,
        dealerCards: newDealerCards,
      };
    case 'CHECK_TURN_RIVER':
      game.showDown();
      const newDealerCardsCheck = dealer.holeCard;
      return {
        ...state,
        dealerCards: newDealerCardsCheck,
      };
    case 'FOLD':
      game.fold(player);
      game.showDown();
      const newDealerCardsFold = dealer.holeCard;
      return {
        ...state,
        dealerCards: newDealerCardsFold,
      };
    case 'RESTART':
      game.startNewRound();
      return {
        ...state,
        playerCards: [],
        communityCards: [],
        dealerCards: [],
        bet: 0,
      };

    default:
      console.error('Invalid action type');
      return state;
  }
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
  state: initialState,
  dispatch: () => {}, // ダミーのディスパッチ関数
});

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
  );
};
