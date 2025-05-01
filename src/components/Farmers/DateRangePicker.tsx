import { Input } from "../ui/input";


type DateRange = {
    start: Date | undefined;
    end: Date | undefined;
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
          value={value?.start?.toISOString().substring(0, 10) || ""}
          onChange={(e) => onChange({ ...value, start: new Date(e.target.value) })}
        />
        <Input
          type="date"
          value={value?.end?.toISOString().substring(0, 10) || ""}
          onChange={(e) => onChange({ ...value, end: new Date(e.target.value) })}
        />
      </div>
    );
  }

  export default DateRangePicker;
  