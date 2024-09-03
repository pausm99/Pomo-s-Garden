import { usePresetsContext } from "@/contexts/PresetsContext";
import { useTimerContext } from "@/contexts/TimerContext";
import { Preset as PresetType } from "@/prisma/generated/zod";

type PresetProps = {
  preset: PresetType;
};

export default function Preset({ preset }: PresetProps) {
  const { selectPreset, selectedPreset } = usePresetsContext();
  const { hasStarted } = useTimerContext();

  const handleSelectPreset = () => {
    if (!hasStarted) selectPreset(preset.id);
  };

  return (
    <div
      onClick={handleSelectPreset}
      style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1)" }}
      className={`${hasStarted ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-between items-center ${
        selectedPreset?.id === preset.id ? "bg-white" : "bg-zinc-100"
      } text-zinc-900 rounded-lg p-2.5`}
    >
      <span>{preset.name}</span>
      <div>
        <span>{preset.focusTime}</span>/<span>{preset.breakTime}</span>
      </div>
    </div>
  );
}