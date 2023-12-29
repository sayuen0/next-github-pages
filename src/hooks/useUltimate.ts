import { useEffect, useState } from 'react';
import {
  GameState,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { Player } from '@/lib/domain/model/players/player';
import { PokerCard } from '@/lib/domain/model/cards/card';

export const useUltimate = () => {
  const [game, setGame] = useState<UltimateTexasHoldem | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerStack, setPlayerStack] = useState(0);
  const [dealer, setDealer] = useState<Player | null>(null);
  const [dealerCards, setDealerCards] = useState<PokerCard[]>([]);
  const [playerCards, setPlayerCards] = useState<PokerCard[]>([]);
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([]);
  const [blind, setBlind] = useState(10);
  const [trips, setTrips] = useState(0);

  useEffect(() => {
    // ゲームとプレイヤーの初期化
    const newPlayer = new Player('Player1', 30000);
    const dealer = new Player('Dealer', 1000000);
    const newGame = new UltimateTexasHoldem(dealer, newPlayer);
    setPlayer(newPlayer);
    setDealer(dealer);
    setGame(newGame);
    setPlayerStack(newPlayer.getStack());

    newGame.startNewRound();
  }, []);

  return {
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
  };
};
