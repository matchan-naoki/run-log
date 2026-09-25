import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function RunResult() {
const navigate = useNavigate();
const location = useLocation();
const { id } = useParams();

const currentUserEmail =
  localStorage.getItem("currentUserEmail");

const savedRuns =
  JSON.parse(
    localStorage.getItem(`runs_${currentUserEmail}`)
  ) || [];

const run =
  location.state?.run ||
  savedRuns.find(
    (item) => String(item.id) === String(id)
  );
  // 今回以外のRUN
const pastRuns = savedRuns.filter(
  (item) => String(item.id) !== String(run?.id)
);

// ペースを秒に変換する
const paceToSeconds = (pace) => {
  if (!pace || pace === "--:--") return Infinity;

  const [minutes, seconds] = pace.split(":").map(Number);

  return minutes * 60 + seconds;
};

// 過去のベストペース
const bestPastPace = Math.min(
  ...pastRuns.map((item) => paceToSeconds(item.pace))
);

// 今回が自己ベストか
const isNewRecord =
  pastRuns.length > 0 &&
  paceToSeconds(run?.pace) < bestPastPace;

  return (
    <div className="min-h-screen bg-black px-6 text-white">
        
       {isNewRecord && (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    {Array.from({ length: 40 }).map((_, index) => (
      <span
        key={index}
        className="absolute -top-10 h-3 w-2 animate-[confetti_3s_linear_forwards]"
        style={{
          left: `${(index * 17) % 100}%`,
          backgroundColor: [
            "#fb923c",
            "#facc15",
            "#3b82f6",
            "#a855f7",
            "#22c55e",
            "#ec4899",
          ][index % 6],
          animationDelay: `${(index % 10) * 0.15}s`,
          animationDuration: `${2.5 + (index % 5) * 0.3}s`,
        }}
      />
    ))}
  </div>
)}

      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center">

        {/* 完了 */}
<div className="mt-12 text-center">
    <p className="text-6xl font-black mb-4">🏁</p>
  <p className="text-6xl font-black">
    
    {run?.distance ?? "0.00"}
    <span className="ml-2 text-xl text-gray-400">
      KM
    </span>
  </p>

  {/* 開始時刻 */}
  {run?.startTime && (
    <p className="mt-3 text-sm font-bold text-gray-400">
      {run.startTime} START
    </p>
  )}
</div>

{/* NEW RECORD */}
{isNewRecord && (
  <div className="mt-6 animate-bounce text-center">
    <p className="bg-gradient-to-r from-orange-400 via-yellow-300 to-purple-500 bg-clip-text text-2xl font-black text-transparent">
      ✨ NEW RECORD! ✨
    </p>

    <p className="mt-2 text-xs font-bold tracking-[0.25em] text-gray-400">
      PERSONAL BEST
    </p>
  </div>
)}

{/* TIME / PACE */}
<div className="mt-10 grid grid-cols-2 border-y border-gray-800 py-6">
  <div className="text-center">
    <p className="text-xs font-bold text-gray-500">
      TIME
    </p>

    <p className="mt-2 text-2xl font-black">
      {run?.time ?? "00:00"}
    </p>
  </div>

  <div className="border-l border-gray-800 text-center">
    <p className="text-xs font-bold text-gray-500">
      AVG. PACE
    </p>

    <p className="mt-2 text-2xl font-black">
      {run?.pace ?? "--:--"}
      <span className="ml-1 text-xs text-gray-500">
        /KM
      </span>
    </p>
  </div>
</div>

{/* SPLITS */}
{run?.splits?.length > 0 && (
  <div className="mt-10">

    <p className="text-xs font-bold tracking-[0.3em] text-gray-500">
      SPLITS
    </p>

    <div className="mt-4 overflow-hidden rounded-2xl bg-gray-900">

      {run.splits.map((split) => (
        <div
          key={split.kilometer}
          className="flex items-center justify-between border-b border-gray-800 px-5 py-4 last:border-b-0"
        >
          <p className="font-bold text-gray-400">
            {split.kilometer} KM
          </p>

          <p className="text-xl font-black">
            {split.time}
          </p>
        </div>
      ))}

    </div>

  </div>
)}

        {/* 完了ボタン */}
        <button
          onClick={() => navigate("/")}
          className="mt-12 w-full cursor-pointer rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 py-4 font-black text-white transition active:scale-95"
        >
          完了
        </button>

      </main>

    </div>
  );
}

export default RunResult;