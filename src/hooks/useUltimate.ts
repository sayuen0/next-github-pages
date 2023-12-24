import { useEffect, useState } from 'react';
import { UltimateTexasHoldem } from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import { Player } from '@/lib/domain/model/players/player';
import { PokerCard } from '@/lib/domain/model/cards/card';
import { RandomPokerCardGenerator } from '@/lib/domain/model/cards/randomCardGenerator';

export const useUltimate = () => {
  const [game, setGame] = useState<UltimateTexasHoldem | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [dealerCards, setDealerCards] = useState<PokerCard[]>([]);
  const [playerCards, setPlayerCards] = useState<PokerCard[]>([]);
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([]);
  const [blind, setBlind] = useState(0);

  function generateRandomCards(count: number): PokerCard[] {
    return Array.from({ length: count }, () =>
      RandomPokerCardGenerator.getRandomCard(true),
    );
  }

  useEffect(() => {
    // ゲームとプレイヤーの初期化
    const newPlayer = new Player('Player1', 30000);
    const newGame = new UltimateTexasHoldem(new Player('Dealer', 1000000), newPlayer);
    setGame(newGame);
    setPlayer(newPlayer);

    newGame.startNewRound();
  }, []);

  return {
    game,
    player,
    dealerCards,
    playerCards,
    setPlayerCards,
    communityCards,
    blind,
    setBlind,
  };
};
