import { BetTable } from '@/lib/domain/model/game/texasHoldem/ultimate/betTable';
import { Player } from '@/lib/domain/model/players/player';

describe('BetTable', () => {
  let betTable: BetTable;
  let player: Player;

  beforeEach(() => {
    player = new Player('Test Player', 1000);
    betTable = new BetTable([player]);
  });

  describe('.betBlindAndAnti', () => {
    it('should correctly bet blind and anti', () => {
      const singleAmount = 50;
      betTable.betBlindAndAnti(player, singleAmount);
      expect(player.getStack()).toBe(900);
      // betTableからbetRecordを取得して確認する
    });
  });

  describe('.betPreFlop', () => {
    beforeEach(() => {
      betTable.betBlindAndAnti(player, 50); // ブラインドとアンティのベット
    });

    const testCases = [
      { betMultiplier: 3, expectedPlayBet: 150, expectedStack: 750 },
      { betMultiplier: 4, expectedPlayBet: 200, expectedStack: 700 },
    ];

    testCases.forEach(({ betMultiplier, expectedPlayBet, expectedStack }) => {
      it(`should bet ${betMultiplier} times the blind bet`, () => {
        betTable.betPreFlop(player, betMultiplier as 3 | 4);
        // betTableからbetRecordを取得して確認する
        expect(player.getStack()).toBe(expectedStack);

        const betRecord = betTable['betBlocks'].find((b) => b.playerID === player.id);
        expect(betRecord?.play).toBe(expectedPlayBet);
      });
    });
  });

  describe('.betFlop', () => {
    it('should correctly bet at flop', () => {
      const player = new Player('Test Player', 1000);
      const betTable = new BetTable([player]);
      betTable.betBlindAndAnti(player, 50);

      betTable.betFlop(player);

      expect(player.getStack()).toBe(800); // 50 * 2 (blind and anti) + 100 (flop bet) = 200 deducted
      const betRecord = betTable.getBetRecord(player);
      expect(betRecord.play).toBe(100); // Flop bet should be double the blind
    });

    it('should not allow betting if already bet at PreFlop', () => {
      // PreFlopでベット
      betTable.betPreFlop(player, 3);

      // Flopで再度ベットしようとする
      betTable.betFlop(player);

      const betRecord = betTable.getBetRecord(player);
      expect(betRecord.play).toBe(150); // プリフロップでのベットのみが反映される
    });
  });

  describe('.betTurnRiver', () => {
    it('should correctly bet at turn or river', () => {
      const player = new Player('Test Player', 1000);
      const betTable = new BetTable([player]);
      betTable.betBlindAndAnti(player, 50);

      betTable.betTurnRiver(player);

      expect(player.getStack()).toBe(850); // 50 * 2 (blind and anti) + 50 (turn/river bet) = 150 deducted
      const betRecord = betTable.getBetRecord(player);
      expect(betRecord.play).toBe(50); // Turn/River bet should be equal to the blind
    });

    it('should not allow betting if already bet at PreFlop', () => {
      // PreFlopでベット
      betTable.betPreFlop(player, 4);

      // Turn/Riverで再度ベットしようとする
      betTable.betTurnRiver(player);

      const betRecord = betTable.getBetRecord(player);
      expect(betRecord.play).toBe(200); // プリフロップでのベットのみが反映される
    });
  });
});
