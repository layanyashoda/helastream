import type { Metadata, ResolvingMetadata } from "next";

import { VideoPlayerProvider } from "@/providers/videoPlayer";

import VideoPlayer from "./_components/videoPlayer";
import MediaDetails from "./_components/currentMedia";
import Videos from "./_components/videos";

import getEpisode, { getTitle } from "@/data/videoData";

import "./page.css";

type PageProps = { params: Promise<{ id: string; title: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const id = (await params).id;

    const title = await getTitle(id);

    return {
        title: `${title.seriesTitle} ${title.episodeTitle} - Watch on HelaTV+`,
    };
}

export default async function Watch({ params }: Readonly<PageProps>) {
    const { id } = await params;
    const episode = await getEpisode(id);
    const { series } = episode;

    return (
        <>
            <main>
                <VideoPlayerProvider media={episode.media} movieId={id}>
                    <VideoPlayer duration={episode.duration} />
                </VideoPlayerProvider>

                <div className="w-[94%] mx-auto">
                    <div className="w-full 2sm:pt-8 flex flex-col lg:flex-row gap-6 pt-6">
                        <div className="flex-1 min-w-0">
                            <MediaDetails
                                movieId={id}
                                seriesId={series.id}
                                seriesTitle={series.title}
                                averageRating={series.averageRating}
                                totalRating={series.totalRating}
                                title={episode.title}
                                metaTags={episode.metaTags}
                                releaseDate={episode.releaseDate}
                                likes={episode.likes}
                                dislikes={episode.dislikes}
                                description={episode.description}
                                details={episode.details}
                            />
                        </div>

                        {(episode.prevEpisode || episode.nextEpisode) && (
                            <div className="w-full lg:w-[20rem] flex-none">
                                <Videos
                                    prevEpisode={episode.prevEpisode}
                                    nextEpisode={episode.nextEpisode}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer></footer>
        </>
    );
}
