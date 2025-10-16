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

  const renderModule = (slot: number) => {
    const moduleType = modules[slot];
    if (!moduleType) {
      return <EmptyModule onAddClick={() => handleAddModuleClick(slot)} />;
    }

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
        return <EmptyModule onAddClick={() => handleAddModuleClick(slot)} />;
    }
  };

  const getLayoutClasses = () => {
    switch (selectedLayout) {
      case "2-modules":
        return "grid grid-cols-2 gap-2";
      case "3-modules-a":
        return "grid grid-cols-2 gap-2";
      case "3-modules-b":
        return "grid grid-cols-2 gap-2";
      case "4-modules":
        return "grid grid-cols-2 gap-2";
      default:
        return "grid grid-cols-2 gap-2";
    }
  };

  const renderLayout = () => {
    if (!selectedLayout) return null;

    const layoutClasses = getLayoutClasses();

    switch (selectedLayout) {
      case "2-modules":
        return (
          <div className={layoutClasses}>
            {renderModule(0)}
            {renderModule(1)}
          </div>
        );
      case "3-modules-a":
        return (
          <div className={layoutClasses}>
            <div className="row-span-2">{renderModule(0)}</div>
            {renderModule(1)}
            {renderModule(2)}
          </div>
        );
      case "3-modules-b":
        return (
          <div className={layoutClasses}>
            {renderModule(0)}
            {renderModule(1)}
            <div className="row-span-2">{renderModule(2)}</div>
          </div>
        );
      case "4-modules":
        return (
          <div className={layoutClasses}>
            {renderModule(0)}
            {renderModule(1)}
            {renderModule(2)}
            {renderModule(3)}
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

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Index;
