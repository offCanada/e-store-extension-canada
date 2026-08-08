interface ToggleProps {
  on: boolean;
  onChange: (on: boolean) => void;
}

const Toggle = ({ on, onChange }: ToggleProps) => {
  return (
    <div
      onClick={() => onChange(!on)}
      class={`w-9 h-5 rounded-full cursor-pointer relative shrink-0 transition-colors ${on ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div
        class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: on ? "18px" : "2px" }}
      />
    </div>
  );
};

export default Toggle;