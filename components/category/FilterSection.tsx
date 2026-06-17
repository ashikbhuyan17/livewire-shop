import { Checkbox } from "@/components/ui/checkbox";

function FilterSection({
  title,
  options,
  selected,
  toggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  toggle: (filter: string) => void;
}) {
  return (
    <div className="border rounded-lg p-4 lg:w-72">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <Checkbox
              value={`${option}_${title}`}
              checked={selected.includes(`${option}_${title}`)}
              onCheckedChange={() => toggle(`${option}_${title}`)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterSection;
