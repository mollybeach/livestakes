// path: pages/index.tsx    /* or app/page.tsx if you’re on the App Router */
import Head from "next/head";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

/**
 * Home page – pixel-window aesthetic
 *
 * Depends on global Tailwind helpers:
 * @layer utilities {
 *   .font-pixel            { font-family: "Press Start 2P", system-ui, monospace; }
 *   .shadow-window-pixel   { box-shadow: 4px 4px 0 0 #000; }
 * }
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>livestakes.fun | AI-Powered Livestream Betting Platform</title>
        <meta
          name="description"
          content="Watch hackathon livestreams and bet on them with AI-generated opportunities."
        />
        <meta
          name="keywords"
          content="livestream betting, AI predictions, realtime markets, hackathon"
        />
        <meta
          property="og:title"
          content="livestakes.fun | AI-Powered Livestream Betting"
        />
        <meta
          property="og:description"
          content="Watch livestreams and place on-chain predictions in real time."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="livestakes.fun | Smart Betting on Live Streams"
        />
        <meta
          name="twitter:description"
          content="AI-powered betting on livestreams. Watch, predict, earn."
        />
      </Head>

      {/* ---------------------------------------------------------------- */}
      {/*  Retro pastel shell                                              */}
      {/* ---------------------------------------------------------------- */}
      <div className="min-h-screen bg-pink-200 text-purple-900 font-pixel">
        <Hero />
      </div>
    </>
  );
}
