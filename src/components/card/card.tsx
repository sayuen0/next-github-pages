import { convertSuitToDirectoryName, PokerCard } from '@/lib/domain/model/cards/card';
import Image from 'next/image';
import styles from './card.module.scss';

interface CardProps {
  card: PokerCard;
}

// Card コンポーネント
export default function Card({ card }: CardProps) {
  const imagePath = card.visible
    ? `/static/img/cards/${convertSuitToDirectoryName(card.suit)}/${
        card.numberSymbol
      }.svg`
    : '/static/img/card/back/10.svg';

  return (
    <div className={styles.cardContainer}>
      <Image
        src={imagePath}
        alt={card.visible ? card.cardValue : ''}
        layout="responsive"
        width={500} // アスペクト比に基づく任意の値
        height={726} // アスペクト比に基づく任意の値
      />
    </div>
  );
}
