import {
  actionCreatePreset,
  actionGetAllPresetsForUser,
} from "@/actions/presets";
import { Preset } from "@/prisma/generated/zod";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { PresetCreateInputSchema } from "@/prisma/generated/zod";
import { z } from "zod";
type PresetCreate = z.infer<typeof PresetCreateInputSchema>;

interface PresetsContextProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  selectPreset: (id: string) => void;
  addPreset: (preset: Preset) => void;
  loading: boolean;
}

const PresetsContext = createContext<PresetsContextProps | undefined>(
  undefined
);

export const PresetsProvider = ({ children }: { children: ReactNode }) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        setLoading(true);
        const fetchetPresets = await actionGetAllPresetsForUser(
          "66d6edd4f3aeb2c0285644e1"
        );
        setPresets(fetchetPresets);
      } catch (error) {
        console.error("Error fetching presets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  const selectPreset = (id: string) => {
    const preset = presets.find((p) => p.id === id) || null;
    setSelectedPreset(preset);
  };

  const addPreset = async (preset: PresetCreate) => {
    const newPreset = await actionCreatePreset(
      "66d6edd4f3aeb2c0285644e1",
      preset.name,
      preset.focusTime,
      preset.breakTime
    );
    setPresets((prevPresets) => [...prevPresets, newPreset]);
    return newPreset;
  };

  return (
    <PresetsContext.Provider
      value={{
        presets,
        selectedPreset,
        selectPreset,
        addPreset,
        loading,
      }}
    >
      {children}
    </PresetsContext.Provider>
  );
};

export const usePresetsContext = () => {
  const context = useContext(PresetsContext);
  if (context === undefined) {
    throw new Error("usePresetsContext must be used within a PresetsProvider");
  }
  return context;
};

export default PresetsContext;