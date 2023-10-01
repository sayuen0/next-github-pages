import { useState } from 'react';
import { getResourcePath } from '@/utils/publicResource';

export default function SingleChip() {
  const [size, setSize] = useState({ width: 100, height: 100 }); // 初期サイズを設定

  return (
    <div>
      {
        <img
          src={getResourcePath('/static/img/chips/500.svg')}
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
          alt="500.svg"
        />
      }
    </div>
  );
}
