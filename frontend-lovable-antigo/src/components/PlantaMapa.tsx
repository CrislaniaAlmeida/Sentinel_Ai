import { cameras } from "@/data/sentinel";
import { cn } from "@/lib/utils";

type Props = {
  trajeto?: string[];
  cameraSelecionada?: string;
  onSelecionarCamera?: (id: string) => void;
  className?: string;
};

export function PlantaMapa({ trajeto = [], cameraSelecionada, onSelecionarCamera, className }: Props) {
  const pontos = trajeto
    .map((id) => cameras.find((c) => c.id === id))
    .filter((c): c is (typeof cameras)[number] => Boolean(c));

  const linha = pontos.map((c) => `${c.x},${c.y}`).join(" ");

  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-border bg-secondary/40", className)}>
      <div className="absolute inset-0 grade-tatica opacity-60" />

      {/* contornos da planta */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-border" />
        <rect x="14" y="34" width="34" height="30" fill="currentColor" className="text-muted/40" />
        <rect x="52" y="40" width="30" height="26" fill="currentColor" className="text-muted/30" />
        <rect x="14" y="10" width="20" height="16" fill="currentColor" className="text-muted/30" />

        {pontos.length > 1 && (
          <polyline
            points={linha}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeDasharray="3 2"
            strokeLinecap="round"
            className="animate-pulse text-primary"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {cameras.map((camera) => {
        const indice = trajeto.indexOf(camera.id);
        const noTrajeto = indice >= 0;
        return (
          <button
            key={camera.id}
            type="button"
            onClick={() => onSelecionarCamera?.(camera.id)}
            style={{ left: `${camera.x}%`, top: `${camera.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            title={`${camera.id} — ${camera.nome}`}
          >
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-[10px] font-semibold transition-all",
                camera.status === "offline"
                  ? "border-destructive/60 bg-destructive/15 text-destructive"
                  : noTrajeto
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                cameraSelecionada === camera.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              )}
            >
              {noTrajeto ? indice + 1 : camera.id.slice(-2)}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-2 left-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-primary" /> trajeto
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-muted-foreground" /> câmera
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-destructive" /> offline
        </span>
      </div>
    </div>
  );
}
