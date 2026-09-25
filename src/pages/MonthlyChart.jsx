function MonthlyChart() {
  // ログインしているユーザー
  const currentUserEmail =
    localStorage.getItem("currentUserEmail");

  // 保存されているRUNを取得
  const runs =
    JSON.parse(
      localStorage.getItem(`runs_${currentUserEmail}`)
    ) || [];

  // 今日の日付
  const now = new Date();

  // 今月のRUNだけ取得
  const monthlyRuns = runs.filter((run) => {
    const runDate = new Date(run.date);

    return (
      runDate.getFullYear() === now.getFullYear() &&
      runDate.getMonth() === now.getMonth()
    );
  });

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

      {/* タイトル */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-gray-400">
            MONTHLY CHART
          </p>

          <h2 className="mt-1 text-xl font-black">
            今月の走行距離
          </h2>
        </div>

        <p className="text-2xl">
          📊
        </p>
      </div>


      {/* RUNがない場合 */}
      {monthlyRuns.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm font-bold text-gray-400">
            今月のランニング記録はありません
          </p>
        </div>
      )}


      {/* 棒グラフ */}
      {monthlyRuns.length > 0 && (
        <div className="mt-8 overflow-x-auto">

          <div className="flex h-52 min-w-max items-end gap-4 px-1">

            {monthlyRuns.map((run) => (
              <div
                key={run.id}
                className="flex w-16 flex-shrink-0 flex-col items-center justify-end"
              >

                {/* 距離 */}
                <p className="mb-2 text-xs font-black">
                  {run.distance}km
                </p>


                {/* 棒 */}
                <div
                  className="w-10 rounded-t-xl bg-gradient-to-t from-orange-400 via-blue-500 to-purple-500"
                  style={{
                    height: `${Math.max(
                      10,
                      Math.min(run.distance * 20, 150)
                    )}px`,
                  }}
                />


                {/* 日付 */}
                <p className="mt-2 text-xs font-bold text-gray-400">
                  {run.date.slice(5).replace("-", "/")}
                </p>

              </div>
            ))}

          </div>

        </div>
      )}

    </section>
  );
}

export default MonthlyChart;