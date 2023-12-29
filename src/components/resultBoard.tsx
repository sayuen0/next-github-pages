import { GameResult } from '@/lib/domain/model/game/texasHoldem/ultimate/types';

interface Props {
  result: GameResult;
}

export default function ResultBoard({ result }: Props) {
  return (
    <>
      <ul>
        {/*プレイヤーのスコア*/}
        {result.playerResults.map((r) => {
          return (
            <li key={r.player.id}>
              {r.player.name}: [{r.hand.cards.map((c) => c.prettyCardValue).join(', ')}]
              {r.hand.hand.name}({r.result == 'win' && '勝利'}
              {r.result == 'tie' && '引き分け'}
              {r.result == 'lose' && '敗北'})
            </li>
          );
        })}
        {/*ディーラーのスコア*/}
        <li>
          ディーラー:{' '}
          {`[${result.dealerResult.cards.map((c) => c.prettyCardValue).join(', ')}] ${
            result.dealerResult.hand.name
          } `}{' '}
          ({result.dealerQualified ? 'クオリファイ' : 'ノンクオリファイ'})
        </li>
      </ul>
    </>
  );
}
