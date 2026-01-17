import WatchAction from "./watchAction";
import { WatchlistButton } from "@/components/watchlist-button";

import "./common.css";

const ContentActionButtons: React.FC<{
    tabIndex?: number;
    watchActionText: string;
    watchActionhref: string;
    className?: string;
    movieId: string;
}> = ({ tabIndex, watchActionText, watchActionhref, className = "", movieId }) => {
    return (
        <div
            className={`relative flex justify-center gap-x-2.5 md:justify-start lg:gap-x-2.5 ${className}`}
        >
            <WatchAction
                tabIndex={tabIndex}
                watchActionhref={watchActionhref}
                watchActionText={watchActionText}
            />

            <div className="flex items-center">
                <WatchlistButton movieId={movieId} variant="icon" className="app-transition-colors flex w-[50px] items-center justify-center border-2 border-[var(--pill-color)] bg-[var(--pill-color)] text-[var(--app-icon-primary)] hover:border-[var(--app-background-crunchyroll-orange)] hover:text-[var(--app-background-crunchyroll-orange)] h-[50px]" />
            </div>
        </div>
    );
};

export default ContentActionButtons;
