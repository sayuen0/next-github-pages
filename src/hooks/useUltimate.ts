import { useEffect, useState } from 'react';
import {
  GameState,
  UltimateTexasHoldem,
} from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { Player } from '@/lib/domain/model/players/player';
import { PokerCard } from '@/lib/domain/model/cards/card';
import { loadScore } from '@/lib/storage/localStorage';

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
  const [trips, setTrips] = useState(10);
  const [bet, setBet] = useState(0);

  useEffect(() => {
    // ゲームとプレイヤーの初期化
    const newScore = loadScore();
    const newPlayer = new Player(newScore.name, newScore.stack);
    const dealer = new Player('Dealer', Number.MAX_SAFE_INTEGER);
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
    bet,
    setBet,
  };
};
