import { BetTable } from '@/lib/domain/model/game/texasHoldem/ultimate/betTable';
import { Player } from '@/lib/domain/model/players/player';

describe('BetTable', () => {
  describe('.betBlindAndAnti', () => {
    let betTable: BetTable;
    let player: Player;

    beforeEach(() => {
      player = new Player('Test Player', 1000);
      betTable = new BetTable([player]);
    });

    it('should correctly bet blind and anti', () => {
      const singleAmount = 50;
      betTable.betBlindAndAnti(player, singleAmount);
      expect(player.getStack()).toBe(900);
      // betTableからbetRecordを取得して確認する
    });

    it('should handle odd stack correctly', () => {
      const player = new Player('Test Player', 1001); // 奇数スタック
      const betTable = new BetTable([player]);
      const singleAmount = 50; // ブラインドとアンティにそれぞれ50ずつベットする予定

      betTable.betBlindAndAnti(player, singleAmount);

      // 1001 - 100 = 901 (1点が返却される)
      expect(player.getStack()).toBe(901);
      const betRecord = betTable.getBetRecord(player);
      expect(betRecord).toBeDefined();
      expect(betRecord.blind).toBe(50); // ブラインド
      expect(betRecord.anti).toBe(50); // アンティ
    });
  });

  describe('.betTrips', () => {
    let player: Player;
    let betTable: BetTable;
    const initialStack = 1000;
    const betAmount = 50;

    beforeEach(() => {
      player = new Player('Test Player', initialStack);
      betTable = new BetTable([player]);
    });

    it('should correctly bet trips', () => {
      betTable.betTrips(player, betAmount);

      const betRecord = betTable.getBetRecord(player);
      expect(player.getStack()).toBe(initialStack - betAmount); // スタックからベット額が引かれる
      expect(betRecord.trips).toBe(betAmount); // トリップスベットが正しく記録される
    });
  });

  describe('.betPreFlop', () => {
    let betTable: BetTable;
    let player: Player;

    beforeEach(() => {
      player = new Player('Test Player', 1000);
      betTable = new BetTable([player]);
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
    let betTable: BetTable;
    let player: Player;
    beforeEach(() => {
      player = new Player('Test Player', 1000);
      betTable = new BetTable([player]);
      betTable.betBlindAndAnti(player, 50);
    });

    it('should correctly bet at flop', () => {
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
    let betTable: BetTable;
    let player: Player;
    beforeEach(() => {
      player = new Player('Test Player', 1000);
      betTable = new BetTable([player]);
      betTable.betBlindAndAnti(player, 50);
    });

    it('should correctly bet at turn or river', () => {
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

  describe('.calculateAntiDistribution', () => {
    let betTable: BetTable;

    beforeEach(() => {
      betTable = new BetTable([new Player('Test Player', 1000)]);
    });

    const testCases = [
      { anti: 100, isDealerQualified: false, win: false, expected: 100 },
      { anti: 100, isDealerQualified: false, win: true, expected: 100 },
      { anti: 100, isDealerQualified: true, win: false, expected: 0 },
      { anti: 100, isDealerQualified: true, win: true, expected: 200 },
    ];

    testCases.forEach(({ anti, isDealerQualified, win, expected }) => {
      it(`should calculate correct distribution for anti=${anti}, dealerQualified=${isDealerQualified}, win=${win}`, () => {
        const result = betTable.calculateAntiDistribution(anti, isDealerQualified, win);
        expect(result).toBe(expected);
      });
    });
  });
});
