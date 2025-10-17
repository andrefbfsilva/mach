import { useState } from "react";
import { Header } from "@/components/Header";
import { LayoutSelector, LayoutType } from "@/components/LayoutSelector";
import { ModuleSelector, ModuleType } from "@/components/ModuleSelector";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PomodoroModule } from "@/components/modules/PomodoroModule";
import { TaskModule } from "@/components/modules/TaskModule";
import { DualClockModule } from "@/components/modules/DualClockModule";
import { NotesModule } from "@/components/modules/NotesModule";
import { EmptyModule } from "@/components/modules/EmptyModule";

const Index = () => {
  const [showLayoutSelector, setShowLayoutSelector] = useState(true);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [modules, setModules] = useState<{ [key: number]: ModuleType }>({
    0: "pomodoro",
    1: "tasks",
  });

  const handleLayoutSelect = (layout: LayoutType) => {
    setSelectedLayout(layout);
    setShowLayoutSelector(false);
  };

  const handleAddModuleClick = (slot: number) => {
    setSelectedSlot(slot);
    setShowModuleSelector(true);
  };

  const handleModuleSelect = (moduleType: ModuleType) => {
    if (selectedSlot !== null) {
      setModules({ ...modules, [selectedSlot]: moduleType });
      setShowModuleSelector(false);
      setSelectedSlot(null);
    }
  };

  const handleChangeModule = (slot: number) => {
    setSelectedSlot(slot);
    setShowModuleSelector(true);
  };

  const handleRemoveModule = (slot: number) => {
    const newModules = { ...modules };
    delete newModules[slot];
    setModules(newModules);
  };

  const renderModule = (slot: number) => {
    const moduleType = modules[slot];
    if (!moduleType) {
      return <EmptyModule onAddClick={() => handleAddModuleClick(slot)} />;
    }

    const moduleContent = (() => {
      switch (moduleType) {
        case "pomodoro":
          return <PomodoroModule />;
        case "tasks":
          return <TaskModule />;
        case "clock":
          return <DualClockModule />;
        case "notes":
          return <NotesModule />;
        default:
          return null;
      }
    })();

    return (
      <div className="relative group h-full">
        {moduleContent}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 z-10">
          <button
            onClick={() => handleChangeModule(slot)}
            className="bg-primary/90 hover:bg-primary text-primary-foreground rounded px-2 py-1 text-[10px] font-semibold shadow-lg"
            title="Change Module"
          >
            CHANGE
          </button>
          <button
            onClick={() => handleRemoveModule(slot)}
            className="bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded px-2 py-1 text-[10px] font-semibold shadow-lg"
            title="Remove Module"
          >
            REMOVE
          </button>
        </div>
      </div>
    );
  };

  const getLayoutClasses = () => {
    switch (selectedLayout) {
      case "2-modules":
        return "grid grid-cols-2 gap-2 h-full";
      case "3-modules-a":
        return "grid grid-cols-2 grid-rows-2 gap-2 h-full";
      case "3-modules-b":
        return "grid grid-cols-2 grid-rows-2 gap-2 h-full";
      case "4-modules":
        return "grid grid-cols-2 grid-rows-2 gap-2 h-full";
      default:
        return "grid grid-cols-2 gap-2 h-full";
    }
  };

  const renderLayout = () => {
    if (!selectedLayout) return null;

    const layoutClasses = getLayoutClasses();

    switch (selectedLayout) {
      case "2-modules":
        return (
          <div className={layoutClasses}>
            <div className="h-full">{renderModule(0)}</div>
            <div className="h-full">{renderModule(1)}</div>
          </div>
        );
      case "3-modules-a":
        return (
          <div className={layoutClasses}>
            <div className="row-span-2 h-full">{renderModule(0)}</div>
            <div className="h-full">{renderModule(1)}</div>
            <div className="h-full">{renderModule(2)}</div>
          </div>
        );
      case "3-modules-b":
        return (
          <div className={layoutClasses}>
            <div className="h-full">{renderModule(0)}</div>
            <div className="h-full">{renderModule(1)}</div>
            <div className="row-span-2 h-full">{renderModule(2)}</div>
          </div>
        );
      case "4-modules":
        return (
          <div className={layoutClasses}>
            <div className="h-full">{renderModule(0)}</div>
            <div className="h-full">{renderModule(1)}</div>
            <div className="h-full">{renderModule(2)}</div>
            <div className="h-full">{renderModule(3)}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="flex-1 p-2">
        {renderLayout()}
      </main>

      {showLayoutSelector && (
        <LayoutSelector
          onSelectLayout={handleLayoutSelect}
          onClose={() => setShowLayoutSelector(false)}
        />
      )}

      {showModuleSelector && (
        <ModuleSelector
          onSelectModule={handleModuleSelect}
          onClose={() => {
            setShowModuleSelector(false);
            setSelectedSlot(null);
          }}
        />
      )}

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onChangeLayout={() => setShowLayoutSelector(true)}
        />
      )}
    </div>
  );
};

export default Index;
