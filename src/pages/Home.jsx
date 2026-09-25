import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MonthlyChart from "./MonthlyChart";
import BottomNav from "./BottomNav";
import RunningCalendar from "./RunningCalendar";

import run1 from "../assets/running1.png";
import run2 from "../assets/running2.png";
import run3 from "../assets/running3.png";
import run4 from "../assets/running4.png";
import run5 from "../assets/running5.png";

function Home() {
  const navigate = useNavigate();

  // ========================================
  // スライダー画像
  // ========================================
  const images = [
    run1,
    run2,
    run3,
    run4,
    run5,
  ];

  // 最後に1枚目を追加
  const sliderImages = [
    ...images,
    images[0],
  ];

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isTransitioning, setIsTransitioning] =
    useState(true);

  // ========================================
  // 次の画像
  // ========================================
const nextSlide = () => {
  setIsTransitioning(true);

  setCurrentIndex((prev) => {
    if (prev >= images.length) {
      return 1;
    }

    return prev + 1;
  });
};

  // ========================================
  // 前の画像
  // ========================================
  const prevSlide = () => {
    setIsTransitioning(true);

    setCurrentIndex((prev) => {
      if (prev === 0) {
        return images.length - 1;
      }

      return prev - 1;
    });
  };

  // ========================================
  // 3秒ごとに自動スライド
  // ========================================
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // ========================================
  // 最後まで行ったら1枚目に戻す
  // ========================================
  const handleTransitionEnd = () => {
    if (currentIndex === images.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // ========================================
  // ログイン中のユーザー
  // ========================================
  const currentUserEmail =
    localStorage.getItem("currentUserEmail");

  // ========================================
  // ユーザーのRUNデータ
  // ========================================
  const [runs] = useState(() => {
    const savedRuns =
      localStorage.getItem(
        `runs_${currentUserEmail}`
      );

    return savedRuns
      ? JSON.parse(savedRuns)
      : [];
  });

  // ========================================
  // ユーザーのプロフィール
  // ========================================
  const profile =
    JSON.parse(
      localStorage.getItem(
        `profile_${currentUserEmail}`
      )
    ) || {
      goalDistance: 50,
    };

// ========================================
// 今月のRUNだけ取り出す
// ========================================

const now = new Date();

const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const monthlyRuns = runs.filter((run) => {

  const runDate = new Date(run.date);

  return (
    runDate.getFullYear() === currentYear &&
    runDate.getMonth() === currentMonth
  );
});


// ========================================
// 今月の合計距離
// ========================================

const totalDistance = monthlyRuns.reduce(
  (total, run) =>
    total + Number(run.distance),
  0
);


// ========================================
// 今月のRUN回数
// ========================================

const totalRuns = monthlyRuns.length;


// ========================================
// 今月の合計時間
// ========================================

const totalMinutes = monthlyRuns.reduce(
  (total, run) =>
    total +
    Number(run.durationMinutes || 0),
  0
);

  // ========================================
  // 平均ペース
  // ========================================
  const averagePaceNumber =
    totalDistance > 0
      ? totalMinutes / totalDistance
      : 0;

  const paceMinutes =
    Math.floor(averagePaceNumber);

  const paceSeconds =
    Math.round(
      (averagePaceNumber - paceMinutes) * 60
    );

  const averagePace =
    totalDistance > 0
      ? `${paceMinutes}:${String(
          paceSeconds
        ).padStart(2, "0")}`
      : "--";

  // ========================================
  // 月間目標
  // ========================================
  const currentDistance = totalDistance;

  const goalDistance =
    Number(profile.goalDistance) || 50;

  const goalPercent =
    goalDistance > 0
      ? Math.min(
          (currentDistance / goalDistance) *
            100,
          100
        )
      : 0;

  // ========================================
  // 最近のRUN 3件
  // ========================================
  const recentRuns = runs
    .slice()
    .reverse()
    .slice(0, 3);
    // ========================================
// 連続ランニング日数（STREAK）
// ========================================

const runDates = [
  ...new Set(runs.map((run) => run.date)),
].sort((a, b) => new Date(b) - new Date(a));

let streak = 0;

if (runDates.length > 0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestRunDate = new Date(runDates[0]);
  latestRunDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (today - latestRunDate) / (1000 * 60 * 60 * 24)
  );

  // 今日か昨日に走っていればSTREAKを継続
  if (diffDays <= 1) {
    streak = 1;

    for (let i = 1; i < runDates.length; i++) {
      const previousDate = new Date(runDates[i - 1]);
      const currentDate = new Date(runDates[i]);

      previousDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      const difference = Math.round(
        (previousDate - currentDate) /
          (1000 * 60 * 60 * 24)
      );

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
}

  // ========================================
  // TOPへ戻る
  // ========================================
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
// 過去最高STREAK
// ========================================

let longestStreak = 0;
let currentStreakCount = 0;

// 古い日付 → 新しい日付に並べる
const ascendingDates = [...runDates].reverse();

if (ascendingDates.length > 0) {
  currentStreakCount = 1;
  longestStreak = 1;

  for (let i = 1; i < ascendingDates.length; i++) {
    const previousDate = new Date(ascendingDates[i - 1]);
    const currentDate = new Date(ascendingDates[i]);

    previousDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const difference = Math.round(
      (currentDate - previousDate) /
        (1000 * 60 * 60 * 24)
    );

    if (difference === 1) {
      currentStreakCount++;

      longestStreak = Math.max(
        longestStreak,
        currentStreakCount
      );
    } else {
      currentStreakCount = 1;
    }
  }
}

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* =====================================
          HEADER
      ===================================== */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 py-4 shadow-lg">

        {/* RUN LOG */}
        <h1 className="ml-4 bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 bg-clip-text text-xl font-black text-transparent">
          RUN LOG
        </h1>

        <nav>
          <ul className="flex items-center gap-5">

            {/* TOP */}
            <li
              onClick={scrollToTop}
              className="cursor-pointer font-bold hover:text-blue-400 hover:underline"
            >
              TOP
            </li>

            {/* HISTORY */}
            <li
              onClick={() =>
                navigate("/history")
              }
              className="cursor-pointer text-2xl hover:scale-110"
            >
              🏃‍♂️
            </li>

            {/* PROFILE */}
            <li
              onClick={() =>
                navigate("/profile")
              }
              className="mr-4 cursor-pointer text-2xl hover:scale-110"
            >
              👤
            </li>

          </ul>
        </nav>

      </header>

      <main>

        {/* =====================================
            HERO / SLIDER
        ===================================== */}
        <section className="relative overflow-hidden">

          {/* ==============================
              スライダー画像
          ============================== */}
          <div
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-700 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${
                currentIndex * 100
              }%)`,
            }}
            onTransitionEnd={
              handleTransitionEnd
            }
          >

            {sliderImages.map(
              (image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`ランニング${
                    index + 1
                  }`}
                  className="h-[500px] w-full shrink-0 object-cover"
                />
              )
            )}

          </div>

          {/* ==============================
              写真を少し暗くする
          ============================== */}
          <div className="pointer-events-none absolute inset-0 bg-black/30" />

          {/* ==============================
              写真の上に文字
          ============================== */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end px-6 pb-12 text-white">

            <h2 className="md:text-3xl font-black leading-tight drop-shadow-lg text-xl">
              走ることで、
              <br />
              もっと自由になれる。
            </h2>

            <p className="mt-4 text-base font-medium drop-shadow-lg text-yellow-300">
              今日も、いい一日をはじめよう。
            </p>

            {/* Running STARTだけ押せるようにする */}
            <button
  onClick={() => navigate("/running")}
  className="pointer-events-auto mt-6 w-fit cursor-pointer rounded-full px-7 py-3 font-bold bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 shadow-lg transition hover:scale-105 hover:bg-green-200"
>
  Running START
</button>

          </div>

          {/* ==============================
              左ボタン
          ============================== */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 px-3 py-2 text-white hover:bg-black/50"
          >
            ←
          </button>

          {/* ==============================
              右ボタン
          ============================== */}
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 px-3 py-2 text-white hover:bg-black/50"
          >
            →
          </button>

          {/* ==============================
              スライダーの丸
          ============================== */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">

            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                }}
                className={`h-2 w-2 cursor-pointer rounded-full ${
                  currentIndex %
                    images.length ===
                  index
                    ? "bg-white"
                    : "bg-white/50"
                }`}
              />
            ))}

          </div>

        </section>

        {/* STREAK */}
<section className="px-5 pt-8">
  <div className="rounded-3xl bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 p-6 text-white shadow-lg">
    <p className="text-xs font-bold tracking-[0.25em] text-white/70">
      CURRENT STREAK
    </p>

    <div className="mt-2 flex items-end gap-3">
      <span className="text-4xl">🔥</span>

      <p className="text-5xl font-black">
        {streak}
      </p>

      <p className="mb-1 font-bold">
        DAY STREAK
      </p>
    </div>

    <p className="mt-3 text-sm font-medium text-white/80">
      連続ランニング記録
    </p>

    <p className="mt-2 text-sm font-bold text-white">
  🏆 過去最高 {longestStreak} DAYS
</p>
  </div>
</section>



        {/* =====================================
            今月のランニング
        ===================================== */}
        <section className="px-5 py-8">

          <h2 className="text-xl font-bold">
            今月のランニング
          </h2>
<MonthlyChart />

<RunningCalendar />
          <div className="mt-4 grid grid-cols-3 gap-3">

            {/* 距離 */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">

              <p className="text-2xl font-black">
                {totalDistance.toFixed(1)}
              </p>

              <p className="text-xs text-gray-500">
                km
              </p>

              <p className="mt-2 text-xs font-bold">
                距離
              </p>

            </div>

            {/* 回数 */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">

              <p className="text-2xl font-black">
                {totalRuns}
              </p>

              <p className="text-xs text-gray-500">
                RUN
              </p>

              <p className="mt-2 text-xs font-bold">
                回数
              </p>

            </div>

            {/* 平均ペース */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">

              <p className="text-2xl font-black">
                {averagePace}
              </p>

              <p className="text-xs text-gray-500">
                /km
              </p>

              <p className="mt-2 text-xs font-bold">
                平均ペース
              </p>

            </div>

          </div>

        </section>

        {/* =====================================
            MONTHLY GOAL
        ===================================== */}
        <section className="px-5 pb-8">

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  MONTHLY GOAL
                </p>

                <p className="mt-1 font-bold">
                  月間目標
                </p>

              </div>

              <p>

                <span className="text-2xl font-black">
                  {currentDistance.toFixed(1)}
                </span>

                <span className="text-gray-500">
                  {" "}
                  / {goalDistance} km
                </span>

              </p>

            </div>

            {/* プログレスバー */}
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{
                  width: `${goalPercent}%`,
                }}
              />

            </div>

            <p className="mt-2 text-right text-sm font-bold">
              {Math.round(goalPercent)}%
            </p>

          </div>

        </section>

        {/* =====================================
            最近のランニング
        ===================================== */}
        <section className="px-5 pb-12">

          <h2 className="text-xl font-bold">
            最近のランニング
          </h2>

          {/* RUNが0件 */}
          {recentRuns.length === 0 ? (

            <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow-sm">

              <p className="text-4xl">
                🏃‍♂️
              </p>

              <p className="mt-3 font-bold">
                まだランニング記録がありません
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Running STARTから最初のRUNを記録しよう！
              </p>

            </div>

          ) : (

            /* RUNがある */
            <div className="mt-4 flex flex-col gap-3">

              {recentRuns.map((run) => (

                <div
                  key={run.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >

                  <p className="text-sm text-gray-500">
                    {run.date}
                  </p>

                  <h3 className="mt-1 font-bold">
                    {run.title}
                  </h3>

                  <p className="mt-3 text-2xl font-black">
                    {run.distance}
                    <span className="ml-1 text-sm">
                      km
                    </span>
                  </p>

                  <div className="mt-3 flex gap-6">

                    {run.time && (
                      <div>
                        <p className="text-xs text-gray-500">
                          タイム
                        </p>

                        <p className="font-bold">
                          {run.time}
                        </p>
                      </div>
                    )}

                    {run.pace && (
                      <div>
                        <p className="text-xs text-gray-500">
                          平均ペース
                        </p>

                        <p className="font-bold">
                          {run.pace} /km
                        </p>
                      </div>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* 履歴へ */}
          <button
            onClick={() =>
              navigate("/history")
            }
            className="mt-4 w-full cursor-pointer rounded-xl bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 py-4 font-bold transition hover:bg-gray-300 text-white"
          >
            すべてのランニング
          </button>

        </section>

      </main>

<BottomNav />
    </div>
  );
}

export default Home;