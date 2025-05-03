import { Input } from "../ui/input";

type DateRange = {
  start: string | undefined;
  end: string | undefined;
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="date"
        value={value?.start || ""}
        onChange={(e) => onChange({ ...value, start: e.target.value })}
      />
      <Input
        type="date"
        value={value?.end || ""}
        onChange={(e) => onChange({ ...value, end: e.target.value })}
      />
    </div>
  );
}

export default DateRangePicker;
