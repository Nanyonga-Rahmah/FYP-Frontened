import { Input } from "../ui/input";

type DateRange = {
  start: Date | null;
  end: Date | null;
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
        value={value?.start ? value.start.toISOString().substring(0, 10) : ""}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onChange({ ...value, start: date });
        }}
      />
      <Input
        type="date"
        value={value?.end ? value.end.toISOString().substring(0, 10) : ""}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onChange({ ...value, end: date });
        }}
      />
    </div>
  );
}

export default DateRangePicker;
