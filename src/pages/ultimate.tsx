// Ultimate コンポーネント
import Card from '@/components/cards/card';
import { RandomPokerCardGenerator } from '@/lib/domain/model/cards/randomCardGenerator';
import { useEffect, useState } from 'react';
import { PokerCard } from '@/lib/domain/model/cards/card';
import Table from '@/components/table/table';
import { Player } from '@/lib/domain/model/players/player';
import { UltimateTexasHoldem } from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';

export default function Ultimate() {
  const [game, setGame] = useState<UltimateTexasHoldem | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [dealerCards, setDealerCards] = useState<PokerCard[]>([]);
  const [playerCards, setPlayerCards] = useState<PokerCard[]>([]);
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([]);

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

    setDealerCards(generateRandomCards(2));
    setPlayerCards(generateRandomCards(2));
    setCommunityCards(generateRandomCards(5));
    // その他のゲームセットアップ処理
  }, []);

  const cardsContainerStyle = {
    display: 'flex', // フレックスボックスを適用
    justifyContent: 'center', // 中央揃え
    FlexWrap: 'wrap', // 必要に応じて折り返し
  };

  return (
    <div>
      <Table>
        <div style={cardsContainerStyle}>
          {dealerCards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
        <div style={cardsContainerStyle}>
          {communityCards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
        <div style={cardsContainerStyle}>
          {playerCards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
      </Table>
      {player && (
        <div>
          <h2>{player.getName()}</h2>
          <p>スタック: {player.getStack()}</p>
        </div>
      )}
    </div>
  );
}
