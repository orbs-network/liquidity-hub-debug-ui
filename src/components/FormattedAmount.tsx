
import { useNumberFormatter } from '../hooks';

export function FormattedAmount({
  value,
  decimalScale,
}: {
  value?: number | string;
  decimalScale?: number;
}) {
  const result = useNumberFormatter({ value, decimalScale })?.toString();
  return <>{result}</>;
}

