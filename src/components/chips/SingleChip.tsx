import { useState } from 'react';
import { getResourcePath } from '@/utils/publicResource';
import { ChipValue } from '@/lib/domain/model/chips/chip';

interface SingleChipProps {
  value: ChipValue;
}

export default function SingleChip({ value }: SingleChipProps) {
  const [size, setSize] = useState({ width: 100, height: 100 }); // 初期サイズを設定
  return (
    <div>
      {
        <img
          src={getResourcePath(`/static/img/chips/${value}.svg`)}
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
          alt={`${value}.svg`}
        />
      }
    </div>
  );
}
