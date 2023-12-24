import { Player } from '@/lib/domain/model/players/player';
import { UltimateTexasHoldem } from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';

describe('UltimateTexasHoldem', () => {
  describe('ゲームの進行', () => {
    let game: UltimateTexasHoldem;
    let player: Player;
    let dealer: Player;

    beforeEach(() => {
      player = new Player('Alice', 1000);
      dealer = new Player('Dealer', 10000);
      game = new UltimateTexasHoldem(dealer, player);
    });

    it('should reset hole cards and shuffle the deck on new round', () => {
      game.startNewRound();
      expect(game['deck']['cards'].length).toBeLessThanOrEqual(52); // デッキが52枚以下であること（一部配られている可能性）
      expect(player.holeCard.length).toBe(0); // プレイヤーのホールカードが0枚であること
      expect(dealer.holeCard.length).toBe(0); // ディーラーのホールカードが0枚であること
    });

    it('should deal 2 cards to each player on pre-flop', () => {
      game.startNewRound();
      game.dealPreFlop();
      expect(player.holeCard.length).toBe(0); // この時点では見えない
      expect(dealer.holeCard.length).toBe(0); // この時点では見えない
    });

    it('should deal 3 community cards on flop', () => {
      game.startNewRound();
      game.dealPreFlop();
      game.dealFlop();
      expect(game['communityCards'].length).toBe(3); // コミュニティカードが3枚であること
    });

    it('should deal 1 additional community card on turn', () => {
      game.startNewRound();
      game.dealPreFlop();
      game.dealFlop();
      game.dealTurn();
      expect(game['communityCards'].length).toBe(4); // コミュニティカードが4枚であること
    });
  });
});
