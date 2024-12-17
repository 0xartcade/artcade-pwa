import { GAME_TYPES } from "@/config/game-registry";
import { ACTIVE_GAME } from "@/config/active-game";
import dynamic from "next/dynamic";

export function GameArea({ gameType }: { gameType: string }) {
  const activeGameType = GAME_TYPES[ACTIVE_GAME.type];
  console.log(ACTIVE_GAME);
  console.log(GAME_TYPES);
  console.log(activeGameType);
  const GameComponent = dynamic(
    () => import(`@/components/${activeGameType.path}`),
    {
      loading: () => <div className="w-full h-full bg-black" />,
    }
  );

  return (
    <div className="w-full h-full">
      <GameComponent />
    </div>
  );
}
