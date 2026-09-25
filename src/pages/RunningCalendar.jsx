import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RunningCalendar() {
    const navigate = useNavigate();
    const [selectedRun, setSelectedRun] = useState(null);
  // ========================================
  // ランニング記録を取得
  // ========================================

  const currentUserEmail =
    localStorage.getItem("currentUserEmail");

  const runs =
    JSON.parse(
      localStorage.getItem(`runs_${currentUserEmail}`)
    ) || [];

  // ========================================
  // 今月の情報
  // ========================================

const now = new Date();

const [displayDate, setDisplayDate] = useState(
  new Date(now.getFullYear(), now.getMonth(), 1)
);

const year = displayDate.getFullYear();
const month = displayDate.getMonth();

// 前の月
const previousMonth = () => {
  setDisplayDate(
    new Date(year, month - 1, 1)
  );
};

// 次の月
const nextMonth = () => {
  setDisplayDate(
    new Date(year, month + 1, 1)
  );
};

  // 今月が何日まであるか
  const lastDate = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // 今月1日の曜日
  // 0 = 日曜日、1 = 月曜日...
  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  // 1日〜月末までの配列
  const days = Array.from(
    { length: lastDate },
    (_, index) => index + 1
  );

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

      {/* タイトル */}
<div>
  <p className="text-xs font-bold tracking-[0.25em] text-gray-400">
    RUN CALENDAR
  </p>

  <div className="mt-3 flex items-center justify-between">

    <button
      onClick={previousMonth}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-black cursor-pointer"
    >
      ‹
    </button>

    <h2 className="text-xl font-black">
      {year}年{month + 1}月
    </h2>

    <button
      onClick={nextMonth}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-black cursor-pointer"
    >
      ›
    </button>

  </div>
</div>

      {/* 曜日 */}
      <div className="mt-6 grid grid-cols-7 text-center text-xs font-bold text-gray-400">
        <p>日</p>
        <p>月</p>
        <p>火</p>
        <p>水</p>
        <p>木</p>
        <p>金</p>
        <p>土</p>
      </div>

      {/* カレンダー */}
      <div className="mt-3 grid grid-cols-7 gap-y-3 text-center">

        {/* 1日までの空白 */}
        {Array.from({ length: firstDay }).map(
          (_, index) => (
            <div key={`empty-${index}`} />
          )
        )}

        {/* 1日〜月末 */}
        {days.map((day) => {
          // 2026-09-24 の形にする
          const date = `${year}-${String(
            month + 1
          ).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          // この日に走った記録があるか確認
const dayRun = runs.find(
  (run) => run.date === date
);

const hasRun = Boolean(dayRun);

          return (
            <div
              key={day}
              className="flex h-10 items-center justify-center"
            >
<button
  onClick={() => {
    if (dayRun) {
      setSelectedRun(dayRun);
    }
  }}
  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold cursor-pointer ${
    hasRun
      ? "bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 text-white shadow-md"
      : "text-gray-700"
  }`}
>
  {day}
</button>
            </div>
          );
        })}

      </div>

{selectedRun && (
  <div className="mt-6 rounded-2xl bg-gray-50 p-5">

    {/* 日付・閉じるボタン */}
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold text-gray-400">
        {selectedRun.date}
      </p>

      <button
        onClick={() => setSelectedRun(null)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-500 cursor-pointer"
      >
        ×
      </button>
    </div>

    {/* RUNデータ */}
    <div className="mt-4 grid grid-cols-3 text-center">
      <div>
        <p className="text-xs font-bold text-gray-400">
          DISTANCE
        </p>
        <p className="mt-1 font-black">
          {selectedRun.distance} km
        </p>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400">
          TIME
        </p>
        <p className="mt-1 font-black">
          {selectedRun.time}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400">
          PACE
        </p>
        <p className="mt-1 font-black">
          {selectedRun.pace}
        </p>
      </div>
    </div>

<button
  onClick={() =>
    navigate(`/history/${selectedRun.id}`)
  }
  className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 py-3 text-sm font-black text-white cursor-pointer"
>
  このRUNを見る →
</button>
  </div>
)}
    </section>
  );
}

export default RunningCalendar;