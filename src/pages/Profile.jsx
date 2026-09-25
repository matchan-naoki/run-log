import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

function Profile() {
  const navigate = useNavigate();

  // ========================================
  // ログイン中のユーザー
  // ========================================
  const currentUserEmail =
    localStorage.getItem("currentUserEmail");

  // ========================================
  // localStorageのキー
  // ========================================
  const profileKey =
    `profile_${currentUserEmail}`;

  const profileImageKey =
    `profileImage_${currentUserEmail}`;

  const runsKey =
    `runs_${currentUserEmail}`;

  // ========================================
  // プロフィール
  // ========================================
  const [profile, setProfile] = useState(() => {
    const savedProfile =
      localStorage.getItem(profileKey);

    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          name: "RUNNER",
          message: "",
          goal: "",
          goalMessage: "",
          goalDistance: 50,
        };
  });

  // ========================================
  // プロフィール画像
  // ========================================
  const [profileImage, setProfileImage] =
    useState(() => {
      return (
        localStorage.getItem(
          profileImageKey
        ) || ""
      );
    });

  // ========================================
  // RUNデータ
  // ========================================
  const [runs] = useState(() => {
    const savedRuns =
      localStorage.getItem(runsKey);

    return savedRuns
      ? JSON.parse(savedRuns)
      : [];
  });

  // ========================================
  // 編集モード
  // ========================================
  const [isEditing, setIsEditing] =
    useState(false);

  const [editName, setEditName] =
    useState(profile.name || "");

  const [editMessage, setEditMessage] =
    useState(profile.message || "");

  const [editGoal, setEditGoal] =
    useState(profile.goal || "");

  const [
    editGoalMessage,
    setEditGoalMessage,
  ] = useState(
    profile.goalMessage || ""
  );

  const [
    editGoalDistance,
    setEditGoalDistance,
  ] = useState(
    profile.goalDistance || 50
  );

  // ========================================
  // 累計距離
  // LEVELではこっちを使う
  // ========================================
  const totalDistance = runs.reduce(
    (total, run) =>
      total + Number(run.distance || 0),
    0
  );

  // ========================================
  // 今月のRUN
  // ========================================
  const now = new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  const monthlyRuns = runs.filter(
    (run) => {
      const runDate =
        new Date(run.date);

      return (
        runDate.getFullYear() ===
          currentYear &&
        runDate.getMonth() ===
          currentMonth
      );
    }
  );

  // ========================================
  // 今月の距離
  // ========================================
  const monthlyDistance =
    monthlyRuns.reduce(
      (total, run) =>
        total +
        Number(run.distance || 0),
      0
    );

  // ========================================
  // RUN回数
  // ========================================
  const totalRuns = runs.length;

  // ========================================
  // 累計時間
  // ========================================
  const totalMinutes = runs.reduce(
    (total, run) =>
      total +
      Number(
        run.durationMinutes || 0
      ),
    0
  );

  // ========================================
  // 平均ペース
  // ========================================
  const averagePaceNumber =
    totalDistance > 0
      ? totalMinutes /
        totalDistance
      : 0;

  let paceMinutes =
    Math.floor(
      averagePaceNumber
    );

  let paceSeconds =
    Math.round(
      (averagePaceNumber -
        paceMinutes) *
        60
    );

  if (paceSeconds === 60) {
    paceMinutes += 1;
    paceSeconds = 0;
  }

  const averagePace =
    totalDistance > 0
      ? `${paceMinutes}:${String(
          paceSeconds
        ).padStart(2, "0")}`
      : "--";

  // ========================================
  // RUNNER LEVEL
  // ========================================
  const levelData = [
    {
      level: 1,
      distance: 0,
    },
    {
      level: 2,
      distance: 10,
    },
    {
      level: 3,
      distance: 25,
    },
    {
      level: 4,
      distance: 50,
    },
    {
      level: 5,
      distance: 100,
    },
    {
      level: 6,
      distance: 200,
    },
    {
      level: 7,
      distance: 300,
    },
    {
      level: 8,
      distance: 500,
    },
    {
      level: 9,
      distance: 750,
    },
    {
      level: 10,
      distance: 1000,
    },
  ];

  const currentLevelData =
    [...levelData]
      .reverse()
      .find(
        (item) =>
          totalDistance >=
          item.distance
      );

  const runnerLevel =
    currentLevelData.level;

  // ========================================
  // LEVEL称号
  // ========================================
  const levelTitles = {
    1: "BEGINNER",
    2: "STARTER",
    3: "RUNNER",
    4: "ACTIVE RUNNER",
    5: "ROAD RUNNER",
    6: "CHALLENGER",
    7: "ADVANCED RUNNER",
    8: "EXPERT RUNNER",
    9: "ELITE RUNNER",
    10: "RUN MASTER",
  };

  const runnerTitle =
    levelTitles[runnerLevel];

  // ========================================
  // LEVELごとの色
  // ========================================
  const getLevelColor = () => {
    if (runnerLevel <= 2) {
      return "text-orange-500";
    }

    if (runnerLevel <= 5) {
      return "text-blue-500";
    }

    if (runnerLevel <= 8) {
      return "text-purple-500";
    }

    if (runnerLevel === 9) {
      return "text-pink-500";
    }

    return "text-yellow-500";
  };

  const levelColor =
    getLevelColor();

  // ========================================
  // 次のLEVEL
  // ========================================
  const nextLevelData =
    levelData.find(
      (item) =>
        item.level ===
        runnerLevel + 1
    );

  const nextLevelDistance =
    nextLevelData
      ? nextLevelData.distance
      : null;

  const remainingDistance =
    nextLevelDistance
      ? Math.max(
          nextLevelDistance -
            totalDistance,
          0
        )
      : 0;

  const currentLevelStart =
    currentLevelData.distance;

  const levelProgress =
    nextLevelDistance
      ? (
          (totalDistance -
            currentLevelStart) /
          (nextLevelDistance -
            currentLevelStart)
        ) * 100
      : 100;

  // ========================================
  // PERSONAL BEST
  // ========================================

  // 最長距離
  const longestRun =
    runs.length > 0
      ? Math.max(
          ...runs.map(
            (run) =>
              Number(
                run.distance || 0
              )
          )
        )
      : 0;

  // 最速ペースを計算できるRUNだけ
  const validPaceRuns =
    runs.filter(
      (run) =>
        Number(run.distance) > 0 &&
        Number(
          run.durationMinutes
        ) > 0
    );

  const fastestPaceNumber =
    validPaceRuns.length > 0
      ? Math.min(
          ...validPaceRuns.map(
            (run) =>
              Number(
                run.durationMinutes
              ) /
              Number(run.distance)
          )
        )
      : 0;

  let fastestPaceMinutes =
    Math.floor(
      fastestPaceNumber
    );

  let fastestPaceSeconds =
    Math.round(
      (fastestPaceNumber -
        fastestPaceMinutes) *
        60
    );

  if (
    fastestPaceSeconds === 60
  ) {
    fastestPaceMinutes += 1;
    fastestPaceSeconds = 0;
  }

  const fastestPace =
    validPaceRuns.length > 0
      ? `${fastestPaceMinutes}:${String(
          fastestPaceSeconds
        ).padStart(2, "0")}`
      : "--";

  // 最長時間
  const longestTimeSeconds =
    runs.length > 0
      ? Math.max(
          ...runs.map(
            (run) =>
              Number(
                run.durationSeconds ||
                  0
              )
          )
        )
      : 0;

  const longestTimeMinutes =
    Math.floor(
      longestTimeSeconds / 60
    );

  const longestTimeRemainingSeconds =
    longestTimeSeconds % 60;

  const longestTime =
    longestTimeSeconds > 0
      ? `${longestTimeMinutes}:${String(
          longestTimeRemainingSeconds
        ).padStart(2, "0")}`
      : "--";

  // ========================================
  // MY GOAL
  // ========================================
  const goalDistance =
    Number(
      profile.goalDistance
    ) || 50;

  const goalPercent =
    goalDistance > 0
      ? (
          monthlyDistance /
          goalDistance
        ) * 100
      : 0;

  // ========================================
  // プロフィール画像変更
  // ========================================
  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onloadend = () => {
      const image =
        reader.result;

      setProfileImage(image);

      localStorage.setItem(
        profileImageKey,
        image
      );
    };

    reader.readAsDataURL(file);
  };

  // ========================================
  // プロフィール保存
  // ========================================
  const handleSave = () => {
    const updatedProfile = {
      ...profile,

      name:
        editName.trim() ||
        "RUNNER",

      message:
        editMessage.trim(),

      goal:
        editGoal.trim(),

      goalMessage:
        editGoalMessage.trim(),

      goalDistance:
        Number(
          editGoalDistance
        ) || 50,
    };

    setProfile(
      updatedProfile
    );

    localStorage.setItem(
      profileKey,
      JSON.stringify(
        updatedProfile
      )
    );

    setIsEditing(false);
  };

  // ========================================
  // 編集キャンセル
  // ========================================
  const handleCancel = () => {
    setEditName(
      profile.name || ""
    );

    setEditMessage(
      profile.message || ""
    );

    setEditGoal(
      profile.goal || ""
    );

    setEditGoalMessage(
      profile.goalMessage || ""
    );

    setEditGoalDistance(
      profile.goalDistance || 50
    );

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* =====================================
          HEADER
      ===================================== */}
<header className="sticky top-0 z-50 flex items-center bg-slate-100 px-4 py-4 shadow-sm bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500">

  {/* HOMEに戻る */}
  <button
    onClick={() => navigate("/")}
    className="mr-3 text-2xl font-bold text-white cursor-pointer"
  >
    ←
  </button>

  {/* ページタイトル */}
  <h1 className="text-lg font-black text-white">
    PROFILE
  </h1>

</header>


      <main className="mx-auto px-5 pb-16 pt-8">

        {/* =====================================
            PROFILE
        ===================================== */}
        <section className="flex flex-col items-center">

          {/* プロフィール画像 */}
          <div className="relative">

            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-200 shadow-md">

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="プロフィール"
                  className="h-full w-full object-cover"
                />

              ) : (

                <span className="text-5xl">
                  🏃‍♂️
                </span>

              )}

            </div>

            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-md">

              📷

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

            </label>

          </div>


          {/* 名前 */}
          <h2 className="mt-4 text-2xl font-black">
            {profile.name}
          </h2>


          {/* メッセージ */}
          <p className="mt-1 text-center text-sm text-gray-500">

            {profile.message
              ? profile.message
              : "今日も走ろう。"}

          </p>


          {/* =====================================
              RUNNER LEVEL
          ===================================== */}
          <div className="mt-5 flex w-full max-w-xs flex-col items-center">

            <p className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white">
              RUNNER LEVEL{" "}
              {runnerLevel}
            </p>

            {/* 称号 */}
            <p
              className={`mt-2 text-lg font-black ${levelColor}`}
            >
              {runnerTitle}
            </p>

            {/* 累計距離 */}
            <p className="mt-2 text-sm font-bold text-gray-500">
              TOTAL{" "}
              {totalDistance.toFixed(
                1
              )}{" "}
              KM
            </p>

            {/* LEVELゲージ */}
            <div className="mt-3 h-2 w-52 overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    levelProgress,
                    100
                  )}%`,
                }}
              />

            </div>

            {nextLevelDistance ? (

              <p className="mt-2 text-xs font-bold text-gray-400">
                NEXT LEVELまで あと{" "}
                {remainingDistance.toFixed(
                  1
                )}{" "}
                KM
              </p>

            ) : (

              <p className="mt-2 font-black text-yellow-500">
                MAX LEVEL 🏆
              </p>

            )}

          </div>

        </section>


        {/* =====================================
            MY RECORD
        ===================================== */}
        <section className="mt-10">

          <h2 className="mb-3 text-xl font-bold">
            MY RECORD
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {/* 今月の距離 */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">

              <p className="text-xl font-black text-blue-500">
                {monthlyDistance.toFixed(
                  1
                )}
              </p>

              <p className="text-xs text-gray-500">
                km
              </p>

              <p className="mt-2 text-xs font-bold">
                今月の距離
              </p>

            </div>


            {/* RUN回数 */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">

              <p className="text-xl font-black text-purple-500">
                {totalRuns}
              </p>

              <p className="text-xs text-gray-500">
                RUNS
              </p>

              <p className="mt-2 text-xs font-bold">
                RUN回数
              </p>

            </div>


            {/* 累計時間 */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">

              <p className="text-xl font-black text-orange-500">
                {Math.round(
                  totalMinutes
                )}
              </p>

              <p className="text-xs text-gray-500">
                MIN
              </p>

              <p className="mt-2 text-xs font-bold">
                累計時間
              </p>

            </div>


            {/* 平均ペース */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">

              <p className="text-xl font-black">
                {averagePace}
              </p>

              <p className="text-xs text-gray-500">
                /KM
              </p>

              <p className="mt-2 text-xs font-bold">
                平均ペース
              </p>

            </div>

          </div>

        </section>


        {/* =====================================
            PERSONAL BEST
        ===================================== */}
        <section className="mt-8">

          <h2 className="mb-3 text-xl font-bold">
            🏆 PERSONAL BEST
          </h2>

          {runs.length === 0 ? (

            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

              <p className="text-4xl">
                🏃‍♂️
              </p>

              <p className="mt-3 font-bold">
                まだ記録がありません
              </p>

              <p className="mt-1 text-sm text-gray-500">
                最初のランニングを記録しよう！
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

              {/* 最長距離 */}
              <div className="flex items-center justify-between border-b border-gray-100 p-5">

                <div>

                  <p className="text-xs font-bold text-gray-400">
                    LONGEST RUN
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    最長距離
                  </p>

                </div>

                <div className="text-right">

                  <span className="text-2xl font-black text-blue-500">
                    {longestRun.toFixed(
                      2
                    )}
                  </span>

                  <span className="ml-1 text-sm font-bold text-gray-400">
                    KM
                  </span>

                </div>

              </div>


              {/* 最速ペース */}
              <div className="flex items-center justify-between border-b border-gray-100 p-5">

                <div>

                  <p className="text-xs font-bold text-gray-400">
                    FASTEST PACE
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    最速ペース
                  </p>

                </div>

                <div className="text-right">

                  <span className="text-2xl font-black text-purple-500">
                    {fastestPace}
                  </span>

                  <span className="ml-1 text-sm font-bold text-gray-400">
                    /KM
                  </span>

                </div>

              </div>


              {/* 最長時間 */}
              <div className="flex items-center justify-between p-5">

                <div>

                  <p className="text-xs font-bold text-gray-400">
                    LONGEST TIME
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    最長時間
                  </p>

                </div>

                <div className="text-right">

                  <span className="text-2xl font-black text-orange-500">
                    {longestTime}
                  </span>

                </div>

              </div>

            </div>

          )}

        </section>


        {/* =====================================
            MY GOAL
        ===================================== */}
        <section className="mt-8">

          <h2 className="mb-3 text-xl font-bold">
            🎯 MY GOAL
          </h2>

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <h3 className="text-lg font-bold">

              {profile.goal
                ? profile.goal
                : "目標を設定しよう"}

            </h3>

            <p className="mt-1 text-sm text-gray-500">

              {profile.goalMessage
                ? profile.goalMessage
                : "プロフィール編集から目標を設定できます。"}

            </p>


            <div className="mt-6 flex items-end justify-between">

              <p className="font-bold">
                今月
              </p>

              <p>

                <span className="text-2xl font-black text-blue-500">
                  {monthlyDistance.toFixed(
                    1
                  )}
                </span>

                <span className="text-gray-500">
                  {" "}
                  / {goalDistance} km
                </span>

              </p>

            </div>


            {/* プログレスバー */}
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    goalPercent,
                    100
                  )}%`,
                }}
              />

            </div>


            <p className="mt-2 text-right text-sm font-bold text-purple-500">
              {Math.min(
                Math.round(
                  goalPercent
                ),
                100
              )}
              %
            </p>


            {/* 残り距離 */}
            {monthlyDistance >=
            goalDistance ? (

              <p className="mt-3 text-center font-black text-purple-500">
                GOAL ACHIEVED 🎉
              </p>

            ) : (

              <p className="mt-3 text-center text-sm font-bold text-gray-500">

                あと{" "}

                <span className="text-orange-500">
                  {Math.max(
                    goalDistance -
                      monthlyDistance,
                    0
                  ).toFixed(1)}{" "}
                  KM
                </span>

                {" "}🔥

              </p>

            )}

          </div>

        </section>


        {/* =====================================
            PROFILE EDIT
        ===================================== */}
        <section className="mt-8">

          {!isEditing ? (

            <button
              onClick={() =>
                setIsEditing(true)
              }
              className="w-full rounded-2xl bg-white py-4 font-bold shadow-sm transition active:scale-[0.98]"
            >
              プロフィールを編集
            </button>

          ) : (

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <h2 className="text-lg font-black">
                プロフィール編集
              </h2>

              {/* 名前 */}
              <div className="mt-5">

                <label className="text-sm font-bold">
                  名前
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(event) =>
                    setEditName(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              {/* ひとこと */}
              <div className="mt-4">

                <label className="text-sm font-bold">
                  ひとこと
                </label>

                <input
                  type="text"
                  value={editMessage}
                  onChange={(event) =>
                    setEditMessage(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              {/* 目標 */}
              <div className="mt-4">

                <label className="text-sm font-bold">
                  目標
                </label>

                <input
                  type="text"
                  value={editGoal}
                  onChange={(event) =>
                    setEditGoal(
                      event.target.value
                    )
                  }
                  placeholder="例：ハーフマラソン完走"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              {/* 目標メッセージ */}
              <div className="mt-4">

                <label className="text-sm font-bold">
                  目標メッセージ
                </label>

                <input
                  type="text"
                  value={
                    editGoalMessage
                  }
                  onChange={(event) =>
                    setEditGoalMessage(
                      event.target.value
                    )
                  }
                  placeholder="例：1月の大会に向けて頑張る！"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              {/* 月間目標距離 */}
              <div className="mt-4">

                <label className="text-sm font-bold">
                  月間目標距離（km）
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    editGoalDistance
                  }
                  onChange={(event) =>
                    setEditGoalDistance(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>


              {/* ボタン */}
              <div className="mt-6 flex gap-3">

                <button
                  onClick={
                    handleCancel
                  }
                  className="flex-1 rounded-xl bg-red-200 py-3 font-bold hover:bg-red-300 text-red-500 cursor-pointer"
                >
                  キャンセル
                </button>

                <button
                  onClick={
                    handleSave
                  }
                  className="cursor-pointer flex-1 rounded-xl bg-black py-3 font-bold text-white bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500"
                >
                  保存
                </button>

              </div>

            </div>

          )}

        </section>


        {/* =====================================
            LOGOUT
        ===================================== */}
        <button
          onClick={() =>
            navigate("/logout")
          }
          className="mt-6 w-full rounded-2xl py-4 font-bold text-red-500 cursor-pointer"
        >
          ログアウト
        </button>

      </main>
<BottomNav />
    </div>
  );
}

export default Profile;