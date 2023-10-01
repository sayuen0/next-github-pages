import React, { useRef, useState } from 'react';
import SingleChip from '@/components/chips/SingleChip';
import { Chip } from '@/lib/domain/model/chips/chip'; // Chip class should be imported
import SortButton from '@/components/chips/SortButton';

export default function MultiChipsPage() {
  const initialChipArray = Chip.getRandomizedArray(30);
  const initialChipArrayRef = useRef(initialChipArray); // useRef to hold the initial state

  const [chipArray, setChipArray] = useState<Chip[]>(initialChipArrayRef.current);

  const handleSortToggle = (isSorted: boolean) => {
    if (isSorted) {
      const sortedChipArray = [...chipArray].sort((a, b) => a.value - b.value); // Sort the chipArray
      setChipArray(sortedChipArray);
    } else {
      setChipArray([...initialChipArrayRef.current]); // Reset the chipArray to the initial state
    }
  };

  return (
    <div className={'flex flex-wrap'}>
      <SortButton onToggle={handleSortToggle} />
      {chipArray.map(
        (
          c,
          index, // Use chipArray to map the Chips
        ) => (
          <div className={`transform -translate-x-${index % 10}`} key={c.id}>
            <SingleChip value={c.value} />
          </div>
        ),
      )}
    </div>
  );
}
