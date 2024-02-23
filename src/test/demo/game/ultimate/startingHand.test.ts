import assert from 'node:assert';
import Deck from '@/lib/domain/model/cards/deck';
import { StartingHand } from '@/lib/domain/model/cards/holeCards';
import { HandEvaluator } from '@/lib/domain/model/hands/handEvaluator';
import { PokerCard } from '@/lib/domain/model/cards/card';
import * as fs from 'fs';
import dayjs from 'dayjs';

interface MatchResult {
  result: 'win' | 'lose' | 'tie';
  playerHand: string;
  playerCards: string[];
  opponentHand: string;
  opponentCards: string[];
}

const matchResults: MatchResult[] = [];

describe('スターティングハンド', () => {
  test('任意のプリフロップハンドでの勝率を計算する', () => {
    const startingHand = 'AA' as StartingHand;

    for (let i = 0; i < 100; i++) {
      const deck = new Deck();
      deck.shuffle();

      const [card1, card2] = deck.drawStartingHand(startingHand);

      // 相手のハンドを決定する(普通に上から2枚引く)
      const [opponentCard1, opponentCard2] = [deck.drawTop(), deck.drawTop()] as [
        PokerCard,
        PokerCard,
      ];

      // 5枚のコミュニティカードを決定する
      const communityCards = [
        deck.drawTop(),
        deck.drawTop(),
        deck.drawTop(),
        deck.drawTop(),
        deck.drawTop(),
      ] as [PokerCard, PokerCard, PokerCard, PokerCard, PokerCard];

      // プレイヤーの役を決定する
      const playerHand = HandEvaluator.evaluateHand([card1, card2, ...communityCards]);
      const opponentHand = HandEvaluator.evaluateHand([
        opponentCard1,
        opponentCard2,
        ...communityCards,
      ]);

      const playerScore = playerHand.hand.calculateScore(playerHand.cards);
      const opponentScore = opponentHand.hand.calculateScore(opponentHand.cards);
      let result: 'win' | 'lose' | 'tie';
      if (playerScore > opponentScore) {
        result = 'win';
      } else if (playerScore === opponentScore) {
        result = 'tie';
      } else {
        result = 'lose';
      }

      matchResults.push({
        result,
        playerHand: playerHand.hand.name,
        playerCards: playerHand.cards.map((card) => card.prettyCardValue),
        opponentHand: opponentHand.hand.name,
        opponentCards: opponentHand.cards.map((card) => card.prettyCardValue),
      });
    }

    let csvContent = 'Result,Player Hand,Player Cards,Opponent Hand,Opponent Cards\n';
    matchResults.forEach((match) => {
      const playerCards = match.playerCards.join(',');
      const opponentCards = match.opponentCards.join(',');
      csvContent += `${match.result},${match.playerHand},${playerCards},${match.opponentHand},${opponentCards}\n`;
    });

    const filename = dayjs().format('YYYYMMDDHHmmss');
    fs.writeFileSync(`out/startingHands/${filename}.csv`, csvContent);

    assert(true, 'スターティングハンドの勝率を計算するテストが完了しました');
  });
});
