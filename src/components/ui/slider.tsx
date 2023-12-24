import { ChangeEvent, useState } from 'react';
import MaterialButton from '@/components/ui/materialButton';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Slider = ({ min, max, step, onChange }: SliderProps) => {
  const [value, setValue] = useState<number>(10);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onChange(event); // 親コンポーネントに通知
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 10);
    setValue(newValue);
    onChange({ target: { value: String(newValue) } } as ChangeEvent<HTMLInputElement>);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 10);
    setValue(newValue);
    onChange({ target: { value: String(newValue) } } as ChangeEvent<HTMLInputElement>);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <MaterialButton text={'-'} onClick={handleDecrement}></MaterialButton>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        step="10"
        style={{ flex: 1 }}
      />
      <MaterialButton text={'+'} onClick={handleIncrement}></MaterialButton>
    </div>
  );
};

export default Slider;
