import Image from "next/image";
import { GameArea } from "@/components/game-area";
import { GAME_TYPES, GAME_MODES } from "@/config/game-registry";
import { ACTIVE_GAME } from "@/config/active-game";

export default function Home() {
  const activeGameType = GAME_TYPES[ACTIVE_GAME.type];
  const activeGameMode = GAME_MODES[ACTIVE_GAME.mode];
  
  return (
    <main className="flex min-h-screen bg-black artcade-main">
      {/* Environment Indicator */}
      <div className="fixed bottom-2 left-2 text-xs font-mono text-white/30 z-50">
        {process.env.NODE_ENV === 'development' ? 'Local' : 
         process.env.VERCEL_ENV === 'production' ? 'Prod' :
         process.env.VERCEL_GIT_COMMIT_REF || 'Preview'}
      </div>

      {/* INFORMATION SIDEBAR */}
      <aside 
        className="hidden md:flex md:w-1/2 flex-col items-center justify-center space-y-8 p-8 info-sidebar">
        <Image
          src="/0xartcade_logo_type.png"
          alt="0xartcade logo"
          width={600}
          height={200}
          priority
          className="w-auto h-auto artcade-logo"
        />
        <div className="space-y-4 text-center artcade-info">
          <h1 className="text-white text-2xl font-semibold artcade-title">
            {activeGameMode.name}
          </h1>
          <p className="text-white/60 text-sm">
            Powered by {activeGameType.poweredBy}
          </p>
          <p className="text-white/80 text-base max-w-md leading-relaxed artcade-description">
            {activeGameMode.description}
          </p>
          
          {/* Website Link */}
          <a 
            href="https://www.0xartcade.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-8 text-sm font-mono text-white/40 hover:text-white/80 transition-colors duration-200"
          >
            www.0xartcade.xyz
          </a>
        </div>
      </aside>

      {/* Game Preview Section */}
      <section 
        className="w-full md:w-1/2 flex items-center justify-center artcade-preview-section"
        data-testid="app-preview"
      >
        <div className="relative h-full w-full flex items-center justify-center">
          {/* Desktop preview with iPhone frame */}
          <div className="hidden md:block">
            <GameArea />
          </div>

          {/* Mobile view (full screen) */}
          <div className="md:hidden h-full w-full bg-gray-950">
            <GameArea />
          </div>
        </div>
      </section>
    </main>
  );
}
