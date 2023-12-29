import { ChangeEvent, useState } from 'react';
import MaterialButton from '@/components/ui/materialButton';

interface SliderProps {
  disabled: boolean;
  min: number;
  max: number;
  step: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Slider = ({ disabled, min, max, step, onChange }: SliderProps) => {
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
    <>
      <div>現在の値: {value}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MaterialButton
          disabled={disabled}
          text={'-'}
          onClick={handleDecrement}
        ></MaterialButton>
        <input
          disabled={disabled}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          step={step}
          style={{ flex: 1 }}
        />
        <MaterialButton
          disabled={disabled}
          text={'+'}
          onClick={handleIncrement}
        ></MaterialButton>
      </div>
    </>
  );
};

export default Slider;
