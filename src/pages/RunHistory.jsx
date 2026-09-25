import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

function RunHistory() {
  const navigate = useNavigate();

  // ログイン中のユーザー
  const currentUserEmail =
    localStorage.getItem("currentUserEmail");

  // 保存されているランニング記録
  const [runs, setRuns] = useState(() => {
    const savedRuns =
      localStorage.getItem(
        `runs_${currentUserEmail}`
      );

    return savedRuns
      ? JSON.parse(savedRuns)
      : [];
  });
  const [filter, setFilter] = useState("month");
  // ========================================
// 今月のRUNだけ取り出す
// ========================================

const now = new Date();

const filteredRuns = runs.filter((run) => {

  // 「すべて」が選ばれている場合
  if (filter === "all") {
    return true;
  }

  // RUNした日付
  const runDate = new Date(run.date);

  // 今月のRUNだけ残す
  return (
    runDate.getFullYear() === now.getFullYear() &&
    runDate.getMonth() === now.getMonth()
  );
});

  // 削除確認中のRUN
  const [deleteRun, setDeleteRun] =
    useState(null);

  // ========================================
  // RUNを削除
  // ========================================
  const handleDelete = () => {
    if (!deleteRun) {
      return;
    }

    // 選んだRUN以外を残す
    const newRuns = runs.filter(
      (run) =>
        run.id !== deleteRun.id
    );

    // Reactのstateを更新
    setRuns(newRuns);

    // localStorageも更新
    localStorage.setItem(
      `runs_${currentUserEmail}`,
      JSON.stringify(newRuns)
    );

    // 削除確認を閉じる
    setDeleteRun(null);
  };

  // 新しい記録を上にする
const displayRuns =
  filteredRuns.slice().reverse();

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 px-5 py-4 shadow-md">

        <button
          onClick={() =>
            navigate("/")
          }
          className="text-xl font-bold text-white cursor-pointer"
        >
          ←
        </button>

        <h1 className="ml-5 text-xl font-black text-white">
          ランニング履歴
        </h1>

      </header>


      <main className="p-5">

        {/* タイトル */}
        <div className="mb-6">

          <h2 className="text-2xl font-black">
            YOUR RUNS
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredRuns.length} RUN
          </p>

        </div>
        {/* =====================================
    今月 / すべて 切り替え
===================================== */}
<div className="mb-6 flex rounded-xl bg-gray-200 p-1">

  <button
    onClick={() => setFilter("month")}
    className={`flex-1 cursor-pointer rounded-lg py-2 font-bold transition ${
      filter === "month"
        ? "bg-white text-blue-500 shadow-sm"
        : "text-gray-500"
    }`}
  >
    今月
  </button>

  <button
    onClick={() => setFilter("all")}
    className={`flex-1 cursor-pointer rounded-lg py-2 font-bold transition ${
      filter === "all"
        ? "bg-white text-blue-500 shadow-sm"
        : "text-gray-500"
    }`}
  >
    すべて
  </button>

</div>


        {/* 記録がない場合 */}
        {displayRuns.length === 0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <p className="text-5xl">
              🏃‍♂️
            </p>

            <h3 className="mt-4 text-lg font-bold">
  {filter === "month"
    ? "今月のランニング記録はありません"
    : "まだ記録がありません"}
</h3>

            <p className="mt-2 text-sm text-gray-500">
  {filter === "month"
    ? "今月もランニングを記録してみよう！"
    : "最初のランニングを記録してみよう！"}
</p>

            <button
              onClick={() =>
                navigate("/")
              }
              className="cursor-pointer mt-6 rounded-xl bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white"
            >
              HOMEへ
            </button>

          </div>

        ) : (

          <div className="flex flex-col gap-4">

            {displayRuns.map((run) => (

              <div
                key={run.id}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >

                {/* ==================================
                    詳細ページへ行く部分
                ================================== */}
                <button
                  onClick={() =>
                    navigate(
                      `/history/${run.id}`
                    )
                  }
                  className="w-full text-left transition active:scale-[0.98]"
                >

                  {/* 日付 */}
{/* 日付・開始時刻 */}
<div className="flex items-center justify-between">

  <div>
    <p className="text-sm font-bold text-gray-500">
      {run.date}
    </p>

    {run.startTime && (
      <p className="mt-1 text-xs font-bold text-gray-400">
        {run.startTime} START
      </p>
    )}
  </div>

  <span className="text-2xl text-gray-400">
    ›
  </span>

</div>


                  {/* タイトル */}
                  <h3 className="mt-2 text-lg font-black">
                    {run.title}
                  </h3>


                  {/* 距離 */}
                  <div className="mt-5">

                    <p className="text-4xl font-black">

                      {run.distance}

                      <span className="ml-1 text-base text-gray-500">
                        KM
                      </span>

                    </p>

                  </div>


                  {/* TIME / PACE */}
                  <div className="mt-5 grid grid-cols-2">

                    <div>

                      <p className="text-xs font-bold text-gray-400">
                        TIME
                      </p>

                      <p className="mt-1 text-lg font-black">
                        {run.time}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs font-bold text-gray-400">
                        AVG. PACE
                      </p>

                      <p className="mt-1 text-lg font-black">

                        {run.pace}

                        <span className="ml-1 text-xs text-gray-500">
                          /KM
                        </span>

                      </p>

                    </div>

                  </div>

                </button>


                {/* ==================================
                    下のボタン
                ================================== */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                  <button
                    onClick={() =>
                      navigate(
                        `/history/${run.id}`
                      )
                    }
                    className="text-sm font-bold text-blue-500 cursor-pointer"
                  >
                    詳細を見る →
                  </button>


                  {/* 削除ボタン */}
                  <button
                    onClick={() =>
                      setDeleteRun(run)
                    }
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 cursor-pointer"
                  >
                    削除
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>


      {/* ========================================
          削除確認画面
      ======================================== */}
      {deleteRun && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-6">

          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">

            <div className="text-center">

              <p className="text-4xl">
                🗑️
              </p>

              <h2 className="mt-4 text-xl font-black">
                この記録を削除しますか？
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                削除した記録は元に戻せません
              </p>

            </div>


            {/* 削除するRUN */}
            <div className="mt-6 rounded-2xl bg-gray-100 p-4">

              <p className="text-sm text-gray-500">
                {deleteRun.date}
              </p>

              <p className="mt-1 text-2xl font-black">
                {deleteRun.distance} KM
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {deleteRun.time}
              </p>

            </div>


            {/* ボタン */}
            <div className="mt-6 grid grid-cols-2 gap-3">

              {/* キャンセル */}
              <button
                onClick={() =>
                  setDeleteRun(null)
                }
                className="rounded-xl bg-gray-200 py-3 font-bold"
              >
                キャンセル
              </button>


              {/* 本当に削除 */}
              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-500 py-3 font-bold text-white cursor-pointer"
              >
                削除する
              </button>

            </div>

          </div>

        </div>

      )}
<BottomNav />
    </div>
  );
}

export default RunHistory;