import {useEffect, useState} from 'react';
import ApiClientFactory from "@/lib/apiClient/apiClient";
import {useRouter} from "next/router";
import {assertValidCard, Card} from "@/lib/domain/model/card"


export default function SingleCard() {
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);

  const router = useRouter()

  let card: Card | null = null;
  const paramCard = router.query.card as string
  try {
    if (paramCard) {
      card = assertValidCard(paramCard);
    }
  } catch (error) {
    console.error((error as any).message); // あるいはエラーメッセージをユーザーに表示させるなどの処理
  }

  const validCard: Card = card as Card;

  useEffect(() => {
    if (!card) return;

    (async () => {
      const client = ApiClientFactory.create();
      try {
        const resp = await client.getCardImage(validCard);
        const imageUrl = URL.createObjectURL(resp.data);
        setCardImageUrl(imageUrl);
      } catch (e) {
        console.error("カード画像取得に失敗しました。", e);
      }
    })(); // ここで即時実行
  }, [validCard]); // 依存配列を忘れないように


  return (
    <div>
      {cardImageUrl && <img src={cardImageUrl} alt="Card"/>}
    </div>
  );
}
