import { useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


// ========================================
// 走ったルート全体が見えるようにする
// ========================================
function FitRoute({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) {
      return;
    }

    // GPS地点が1個だけの場合
    if (positions.length === 1) {
      map.setView(
        positions[0],
        17
      );

      return;
    }

    // 走ったルート全体を表示
    map.fitBounds(
      positions,
      {
        padding: [30, 30],
      }
    );
  }, [positions, map]);

  return null;
}


// ========================================
// RunDetail
// ========================================
function RunDetail() {
  const navigate =
    useNavigate();

  // URLのidを取得
  // /history/12345
  //          ↑これ
  const { id } =
    useParams();


  // ========================================
  // ログイン中ユーザー
  // ========================================
  const currentUserEmail =
    localStorage.getItem(
      "currentUserEmail"
    );


  // ========================================
  // RUN一覧を取得
  // ========================================
  const runs =
    JSON.parse(
      localStorage.getItem(
        `runs_${currentUserEmail}`
      )
    ) || [];


  // ========================================
  // URLのidと同じRUNを探す
  // ========================================
  const run =
    runs.find(
      (item) =>
        String(item.id) ===
        String(id)
    );


  // ========================================
  // RUNが見つからない場合
  // ========================================
  if (!run) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6">

        <p className="text-5xl">
          🏃
        </p>

        <h1 className="mt-5 text-xl font-black">
          記録が見つかりません
        </h1>

        <button
          onClick={() =>
            navigate("/history")
          }
          className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white"
        >
          履歴へ戻る
        </button>

      </div>
    );
  }


  // ========================================
  // GPSルート
  // ========================================
  const route =
    run.route || [];


  // Leaflet用に変換
  const routePositions =
    route.map(
      (point) => [
        point.latitude,
        point.longitude,
      ]
    );


  // ========================================
  // SPLITS
  // ========================================
  const splits =
    run.splits || [];


  // ========================================
  // 画面
  // ========================================
  return (
    <div className="min-h-screen bg-gray-100">


      {/* =========================
          HEADER
      ========================= */}
      <header className="sticky top-0 z-[2000] flex items-center px-4 py-4 shadow-sm bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500">

        <button
          onClick={() =>
            navigate("/history")
          }
          className="text-2xl font-bold cursor-pointer text-white"
        >
          ←
        </button>


        <h1 className="ml-5 text-xl font-black text-white">
          RUN DETAIL
        </h1>

      </header>


      <main>


        {/* =========================
            MAP
        ========================= */}
        {routePositions.length > 0 ? (

          <div className="h-[350px] w-full">

            <MapContainer
              center={
                routePositions[0]
              }
              zoom={16}
              className="h-full w-full"
              zoomControl={false}
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* 走ったルート */}
              {routePositions.length >
                1 && (

                <Polyline
                  positions={
                    routePositions
                  }
                  pathOptions={{
                    color:
                      "#3b82f6",

                    weight:
                      6,
                  }}
                />

              )}


              {/* ルート全体を表示 */}
              <FitRoute
                positions={
                  routePositions
                }
              />

            </MapContainer>

          </div>

        ) : (

          // 古いRUNなど
          // GPSデータがない場合
          <div className="flex h-[250px] items-center justify-center bg-gray-200">

            <div className="text-center">

              <p className="text-4xl">
                🗺️
              </p>

              <p className="mt-3 text-sm font-bold text-gray-500">
                MAPデータがありません
              </p>

            </div>

          </div>

        )}


        {/* =========================
            RUN情報
        ========================= */}
        <div className="px-5 pb-12">


          {/* 日付 */}
{/* 日付・開始時刻 */}
<div className="pt-6">

  <p className="text-sm font-bold text-gray-500">
    {run.date}
  </p>

  {run.startTime && (
    <p className="mt-1 text-xs font-bold text-gray-400">
      {run.startTime} START
    </p>
  )}

  <h2 className="mt-2 text-xl font-black">
    {run.title}
  </h2>

</div>


          {/* =====================
              DISTANCE
          ===================== */}
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-xs font-bold tracking-[0.25em] text-gray-400">
              DISTANCE
            </p>


            <p className="mt-2 text-5xl font-black">

              {run.distance}

              <span className="ml-2 text-lg text-gray-400">
                KM
              </span>

            </p>

          </div>


          {/* =====================
              TIME / PACE
          ===================== */}
          <div className="mt-4 grid grid-cols-2 rounded-3xl bg-white p-6 shadow-sm">


            {/* TIME */}
            <div className="border-r border-gray-200">

              <p className="text-xs font-bold text-gray-400">
                TIME
              </p>

              <p className="mt-2 text-2xl font-black">
                {run.time}
              </p>

            </div>


            {/* PACE */}
            <div className="pl-6">

              <p className="text-xs font-bold text-gray-400">
                AVG. PACE
              </p>

              <p className="mt-2 text-2xl font-black">

                {run.pace}

                <span className="ml-1 text-xs text-gray-400">
                  /KM
                </span>

              </p>

            </div>

          </div>


          {/* =====================
              SPLITS
          ===================== */}
          <div className="mt-8">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-xs font-bold tracking-[0.25em] text-gray-400">
                  SPLITS
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  1kmごとのタイム
                </h2>

              </div>

            </div>


            {/* SPLITがある */}
            {splits.length > 0 ? (

              <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm">


                {/* 見出し */}
                <div className="grid grid-cols-2 border-b border-gray-100 px-6 py-3">

                  <p className="text-xs font-bold text-gray-400">
                    KM
                  </p>

                  <p className="text-right text-xs font-bold text-gray-400">
                    TIME
                  </p>

                </div>


                {/* SPLIT一覧 */}
                {splits.map(
                  (split) => (

                    <div
                      key={
                        split.kilometer
                      }
                      className="grid grid-cols-2 border-b border-gray-100 px-6 py-5 last:border-b-0"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 font-black">
                          {
                            split.kilometer
                          }
                        </div>

                        <p className="font-bold">
                          {
                            split.kilometer
                          } KM
                        </p>

                      </div>


                      <p className="text-right text-xl font-black">
                        {
                          split.time
                        }
                      </p>

                    </div>

                  )
                )}

              </div>

            ) : (

              // 古いRUNなど
              <div className="mt-4 rounded-3xl bg-white p-8 text-center shadow-sm">

                <p className="text-3xl">
                  ⏱️
                </p>

                <p className="mt-3 font-bold text-gray-500">
                  SPLITデータがありません
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  1km以上走ると記録されます
                </p>

              </div>

            )}

          </div>


          {/* =====================
              履歴へ戻る
          ===================== */}
          <button
            onClick={() =>
              navigate("/history")
            }
            className="cursor-pointer mt-10 w-full rounded-2xl bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 py-4 font-black text-white"
          >
            履歴へ戻る
          </button>

        </div>

      </main>

    </div>
  );
}

export default RunDetail;