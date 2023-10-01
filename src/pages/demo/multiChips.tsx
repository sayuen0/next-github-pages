import React from 'react';
import SingleChip from '@/components/chips/SingleChip';
import { Chip } from '@/lib/domain/model/chips/chip';

export default function MultiChipsPage() {
  // Define array of chip values
  const chips = Chip.shuffle(30);

  return (
    <div>
      {chips.map((c, index) => (
        <SingleChip key={index} value={c.value} /> // Render the SingleChip component
      ))}
    </div>
  );
}
