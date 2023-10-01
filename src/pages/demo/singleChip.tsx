import { useState } from 'react';

export default function SingleChip() {
  const [size, setSize] = useState({ width: 100, height: 100 }); // 初期サイズを設定

  // TODO: コインの画像を取得する
  // TODO: ドロップダウンを用意し、その額のコインの計算をするようにする
  // TODO: 100円単位での自由入力を設け、その額のコインを最大桁数で表示するようにする
  return (
    <div>
      {
        <img
          src="/static/img/chips/500.svg"
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
          alt="500.svg"
        />
      }
    </div>
  );
}
