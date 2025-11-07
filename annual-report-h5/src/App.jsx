import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import { reportData } from "./data/reportData";
import CoverPage from "./components/CoverPage";
import IntroPage from "./components/IntroPage";
import StatsPage from "./components/StatsPage";
import MilestonePage from "./components/MilestonePage";
import FavoritePage from "./components/FavoritePage";
import TopArtistsPage from "./components/TopArtistsPage";
import MoodPage from "./components/MoodPage";
import TimeDistributionPage from "./components/TimeDistributionPage";
import DiscoveryPage from "./components/DiscoveryPage";
import SummaryPage from "./components/SummaryPage";
import AudioManager from "./utils/AudioManager";

import "swiper/css";
import "swiper/css/pagination";
import "./styles/App.scss";

const pageComponents = {
  cover: CoverPage,
  intro: IntroPage,
  stats: StatsPage,
  milestone: MilestonePage,
  favorite: FavoritePage,
  topArtists: TopArtistsPage,
  mood: MoodPage,
  timeDistribution: TimeDistributionPage,
  discovery: DiscoveryPage,
  summary: SummaryPage,
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    AudioManager.init();
  }, []);

  const handleMusicToggle = () => {
    const playing = AudioManager.toggle();
    setIsPlaying(playing);
  };

  const handleSlideChange = (swiper) => {
    setCurrentPage(swiper.activeIndex);
  };

  return (
    <div className="app">
      {/* 音乐控制按钮 */}
      <button
        className={`music-control ${isPlaying ? "playing" : ""}`}
        onClick={handleMusicToggle}
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>

      {/* 页面指示器 */}
      <div className="page-indicator">
        {currentPage + 1} / {reportData.pages.length}
      </div>

      {/* Swiper 轮播 */}
      <Swiper
        direction="vertical"
        slidesPerView={1}
        mousewheel={{
          sensitivity: 1,
          releaseOnEdges: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Mousewheel, Pagination]}
        onSlideChange={handleSlideChange}
        className="swiper-container"
        speed={1000}
      >
        {reportData.pages.map((page, index) => {
          const PageComponent = pageComponents[page.type];
          return (
            <SwiperSlide key={page.id}>
              <PageComponent data={page} isActive={currentPage === index} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default App;
