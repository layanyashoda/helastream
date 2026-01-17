import { Settings } from "lucide-react";

import { useVideoPlayer } from "@/providers/videoPlayer";

import SettingsList from "./settings";
import Audio from "./audio";
import Subtitles from "./subtitles";
import QualityLevels from "./qualityLevels";

import "./index.css";

const SettingsPanel: React.FC = () => {
    const { isMediaSettingsPanelOpen, setIsMediaSettingsPanelOpen } =
        useVideoPlayer();

    function toggleMediaSettingsPanelOpen() {
        setIsMediaSettingsPanelOpen((prev) =>
            prev === "settings" ? "off" : "settings",
        );
    }

    return (
        <div className="md:relative">
            <button
                className={`text-white/90 hover:text-white transition-colors hover:scale-110 active:scale-95 ${isMediaSettingsPanelOpen !== "off" ? "rotate-90 text-white" : ""}`}
                onClick={toggleMediaSettingsPanelOpen}
            >
                <Settings className="size-6" />
            </button>

            {isMediaSettingsPanelOpen !== "off" && (
                <div className="absolute top-0 right-0 left-0 z-98 md:top-full md:bottom-0 md:left-auto">
                    <div className="settings-panel-sizer scrollbar-thin overflow-x-hidden overflow-y-auto bg-black py-2.5">
                        {isMediaSettingsPanelOpen === "settings" && <Settings />}
                        {isMediaSettingsPanelOpen === "audioTracks" && <Audio />}
                        {isMediaSettingsPanelOpen === "subtitleTracks" && <Subtitles />}
                        {isMediaSettingsPanelOpen === "qualityLevels" && <QualityLevels />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPanel;
