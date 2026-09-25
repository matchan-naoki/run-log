import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


// ========================================
// Leafletのマーカー設定
// ========================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ========================================
// 現在地に地図を移動
// ========================================
function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      return;
    }

    map.setView(
      [
        position.latitude,
        position.longitude,
      ],
      17
    );
  }, [position, map]);

  return null;
}


// ========================================
// Running
// ========================================
function Running() {
  const navigate = useNavigate();


  // ========================================
  // state
  // ========================================

  // 走っているか
  const [isRunning, setIsRunning] =
    useState(false);

  // 一時停止中か
  const [isPaused, setIsPaused] =
    useState(false);

  // 自動停止されたか
  const [isAutoPaused, setIsAutoPaused] =
    useState(false);

  // カウントダウン
  const [countdown, setCountdown] =
    useState(null);

  // 経過時間
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

    // ランニング開始時刻
const [startTime, setStartTime] =
  useState("");

  // 距離
  const [distance, setDistance] =
    useState(0);

  // GPSルート
  const [route, setRoute] =
    useState([]);

  // 現在地
  const [currentPosition, setCurrentPosition] =
    useState(null);

  // エラー
  const [error, setError] =
    useState("");

  // ========================================
  // ★ 追加
  // 1kmごとのSPLIT
  // ========================================
  const [splits, setSplits] =
    useState([]);


  // ========================================
  // useRef
  // ========================================

  // GPS監視ID
  const watchIdRef =
    useRef(null);

  // 長押し
  const longPressTimerRef =
    useRef(null);

  // 停止判定開始時間
  const stationaryStartRef =
    useRef(null);

  // 停止判定基準地点
  const stationaryPointRef =
    useRef(null);

  // ========================================
  // ★ 追加
  // 次に記録する距離
  //
  // 最初は1km
  // ↓
  // 次は2km
  // ↓
  // 次は3km...
  // ========================================
  const nextSplitKmRef =
    useRef(1);

  // ========================================
  // ★ 追加
  // 前回のSPLIT時点での経過時間
  // ========================================
  const lastSplitTimeRef =
    useRef(0);

  // ========================================
  // 最新の経過時間
  //
  // GPSの処理の中から
  // 最新時間を使うために用意
  // ========================================
  const elapsedSecondsRef =
    useRef(0);


  // ========================================
  // 2地点間の距離を計算
  // ========================================
  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const R = 6371;

    const toRadians = (degree) => {
      return degree * (Math.PI / 180);
    };

    const dLat =
      toRadians(lat2 - lat1);

    const dLon =
      toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };


  // ========================================
  // 時間表示
  // ========================================
  const formatTime = (seconds) => {
    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(secs).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };


  // ========================================
  // 平均ペース
  // ========================================
  const getPace = () => {
    if (
      distance <= 0 ||
      elapsedSeconds === 0
    ) {
      return "--:--";
    }

    const secondsPerKm =
      elapsedSeconds / distance;

    const minutes =
      Math.floor(
        secondsPerKm / 60
      );

    const seconds =
      Math.floor(
        secondsPerKm % 60
      );

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  };


  // ========================================
  // ★ 追加
  // SPLITを記録
  // ========================================
  const checkSplit = (
    newTotalDistance
  ) => {
    // まだ次の1kmに到達していない
    if (
      newTotalDistance <
      nextSplitKmRef.current
    ) {
      return;
    }

    // 現在の経過時間
    const currentTime =
      elapsedSecondsRef.current;

    // この1kmにかかった時間
    const splitSeconds =
      currentTime -
      lastSplitTimeRef.current;

    // 何km地点か
    const kilometer =
      nextSplitKmRef.current;

    // SPLITを作る
    const newSplit = {
      kilometer:
        kilometer,

      seconds:
        splitSeconds,

      time:
        formatTime(
          splitSeconds
        ),
    };

    // SPLITに追加
    setSplits(
      (previousSplits) => [
        ...previousSplits,
        newSplit,
      ]
    );

    // 今回の時間を記録
    lastSplitTimeRef.current =
      currentTime;

    // 次は+1km
    nextSplitKmRef.current += 1;
  };


  // ========================================
  // 自動停止判定
  // ========================================
  const checkStationary = (
    newPoint
  ) => {
    // 最初の地点
    if (
      !stationaryPointRef.current
    ) {
      stationaryPointRef.current =
        newPoint;

      stationaryStartRef.current =
        Date.now();

      return;
    }

    const basePoint =
      stationaryPointRef.current;

    // 基準地点から現在地まで
    const movedDistance =
      calculateDistance(
        basePoint.latitude,
        basePoint.longitude,
        newPoint.latitude,
        newPoint.longitude
      );

    // km → m
    const movedMeters =
      movedDistance * 1000;

    // 3m以上動いた
    if (movedMeters >= 3) {
      stationaryPointRef.current =
        newPoint;

      stationaryStartRef.current =
        Date.now();

      return;
    }

    // 3m以内にいた時間
    const stationarySeconds =
      (Date.now() -
        stationaryStartRef.current) /
      1000;

    // 3秒停止
    if (
      stationarySeconds >= 3
    ) {
      handleAutoPause();
    }
  };


  // ========================================
  // GPS計測開始
  // ========================================
  const startGpsTracking = () => {
    watchIdRef.current =
      navigator.geolocation.watchPosition(

        // GPS成功
        (position) => {
          const newPoint = {
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,

            timestamp:
              Date.now(),
          };


          // 精度が悪すぎるGPSは無視
          if (
            newPoint.accuracy > 50
          ) {
            return;
          }


          // 現在地更新
          setCurrentPosition(
            newPoint
          );


          // 自動停止判定
          checkStationary(
            newPoint
          );


          // ルート更新
          setRoute(
            (previousRoute) => {

              // 最初の地点
              if (
                previousRoute.length === 0
              ) {
                return [
                  newPoint,
                ];
              }


              const lastPoint =
                previousRoute[
                  previousRoute.length - 1
                ];


              // 前の地点からの距離
              const addedDistance =
                calculateDistance(
                  lastPoint.latitude,
                  lastPoint.longitude,
                  newPoint.latitude,
                  newPoint.longitude
                );


              // 3m未満はGPSのブレとして無視
              if (
                addedDistance < 0.003
              ) {
                return previousRoute;
              }


              // 距離を更新
              setDistance(
                (previousDistance) => {

                  const newTotalDistance =
                    previousDistance +
                    addedDistance;


                  // =========================
                  // ★ 1km到達チェック
                  // =========================
                  checkSplit(
                    newTotalDistance
                  );


                  return newTotalDistance;
                }
              );


              // ルート追加
              return [
                ...previousRoute,
                newPoint,
              ];
            }
          );
        },


        // GPS失敗
        (gpsError) => {
          console.log(
            gpsError
          );

          setError(
            "GPS情報を取得できませんでした"
          );
        },


        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
  };


  // ========================================
  // STARTボタン
  // ========================================
  const handleStart = () => {
    setError("");

    const now = new Date();

setStartTime(
  `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`
);

    if (
      !navigator.geolocation
    ) {
      setError(
        "この端末ではGPSを利用できません"
      );

      return;
    }



    navigator.geolocation.getCurrentPosition(

      // 成功
      (position) => {
        const firstPosition = {
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

          accuracy:
            position.coords.accuracy,
        };


        setCurrentPosition(
          firstPosition
        );


        startCountdown();
      },


      // 失敗
      () => {
        setError(
          "ランニングを記録するには位置情報の許可が必要です"
        );
      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  // ========================================
  // 3秒カウントダウン
  // ========================================
  const startCountdown = () => {
    setCountdown(3);

    let count = 3;

    const timer =
      setInterval(() => {
        count -= 1;

        if (
          count === 0
        ) {
          clearInterval(
            timer
          );

          setCountdown(
            null
          );

          startRunning();

        } else {
          setCountdown(
            count
          );
        }
      }, 1000);
  };


  // ========================================
  // ランニング開始
  // ========================================
  const startRunning = () => {
    setIsRunning(true);

    setIsPaused(false);

    setIsAutoPaused(false);

    setElapsedSeconds(0);

    setDistance(0);

    setRoute([]);

    // =========================
    // ★ SPLITもリセット
    // =========================
    setSplits([]);

    nextSplitKmRef.current =
      1;

    lastSplitTimeRef.current =
      0;

    elapsedSecondsRef.current =
      0;


    stationaryPointRef.current =
      null;

    stationaryStartRef.current =
      null;


    startGpsTracking();
  };


  // ========================================
  // STOP
  // 手動一時停止
  // ========================================
  const handlePause = () => {
    setIsRunning(false);

    setIsPaused(true);

    setIsAutoPaused(false);


    // GPS停止
    if (
      watchIdRef.current !== null
    ) {
      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current =
        null;
    }


    stationaryPointRef.current =
      null;

    stationaryStartRef.current =
      null;
  };


  // ========================================
  // 自動一時停止
  // ========================================
  const handleAutoPause = () => {
    setIsRunning(false);

    setIsPaused(true);

    setIsAutoPaused(true);


    if (
      watchIdRef.current !== null
    ) {
      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current =
        null;
    }


    stationaryPointRef.current =
      null;

    stationaryStartRef.current =
      null;
  };


  // ========================================
  // RESUME
  // ========================================
  const handleResume = () => {
    stationaryPointRef.current =
      null;

    stationaryStartRef.current =
      null;


    setIsAutoPaused(false);

    setIsPaused(false);

    setIsRunning(true);


    startGpsTracking();
  };


  // ========================================
  // RUN保存
  // ========================================
  const saveRun = () => {
    const currentUserEmail =
      localStorage.getItem(
        "currentUserEmail"
      );


    const runsKey =
      `runs_${currentUserEmail}`;


    const savedRuns =
      JSON.parse(
        localStorage.getItem(
          runsKey
        )
      ) || [];


    const now =
      new Date();


    const date =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      )}-${String(
        now.getDate()
      ).padStart(
        2,
        "0"
      )}`;


    // ========================================
    // 保存するRUN
    // ========================================
    const newRun = {
      id:
        Date.now(),

      title:
        "Running",

      date:
        date,

startTime,

      distance:
        Number(
          distance.toFixed(2)
        ),

      durationSeconds:
        elapsedSeconds,

      durationMinutes:
        elapsedSeconds / 60,

      time:
        formatTime(
          elapsedSeconds
        ),

      pace:
        getPace(),

      // GPSルート
      route:
        route,

      // =========================
      // ★ SPLITも保存
      // =========================
      splits:
        splits,
    };


    const newRuns = [
      ...savedRuns,
      newRun,
    ];


    localStorage.setItem(
      runsKey,
      JSON.stringify(
        newRuns
      )
    );


navigate(`/result/${newRun.id}`, {
  state: {
    run: newRun,
  },
});
  };


  // ========================================
  // 長押し開始
  // ========================================
  const startLongPress = () => {
    if (
      longPressTimerRef.current
    ) {
      clearTimeout(
        longPressTimerRef.current
      );
    }


    longPressTimerRef.current =
      setTimeout(() => {
        saveRun();
      }, 1500);
  };


  // ========================================
  // 長押しキャンセル
  // ========================================
  const cancelLongPress = () => {
    if (
      longPressTimerRef.current
    ) {
      clearTimeout(
        longPressTimerRef.current
      );

      longPressTimerRef.current =
        null;
    }
  };


  // ========================================
  // タイマー
  // ========================================
  useEffect(() => {
    if (!isRunning) {
      return;
    }


    const timer =
      setInterval(() => {
        setElapsedSeconds(
          (previous) => {
            const newTime =
              previous + 1;

            // =========================
            // ★ refにも最新時間を保存
            // =========================
            elapsedSecondsRef.current =
              newTime;

            return newTime;
          }
        );
      }, 1000);


    return () => {
      clearInterval(
        timer
      );
    };

  }, [isRunning]);


  // ========================================
  // ページを離れたらGPS停止
  // ========================================
  useEffect(() => {
    return () => {
      if (
        watchIdRef.current !== null
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }


      if (
        longPressTimerRef.current
      ) {
        clearTimeout(
          longPressTimerRef.current
        );
      }
    };

  }, []);


  // ========================================
  // 地図用ルート
  // ========================================
  const mapRoute =
    route.map(
      (point) => [
        point.latitude,
        point.longitude,
      ]
    );


  // ========================================
  // 画面
  // ========================================
  return (
    <div className="min-h-screen bg-black text-white">


      {/* =========================
          HEADER
      ========================= */}
      <header className="flex items-center justify-between px-5 py-5">

        <button
          onClick={() =>
            navigate("/")
          }
          disabled={
            isRunning ||
            isPaused
          }
          className="text-2xl font-bold disabled:opacity-30 cursor-pointer"
        >
          ←
        </button>


        <h1 className="bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 bg-clip-text text-xl font-black text-transparent">
          RUN LOG
        </h1>


        <div className="w-6" />

      </header>


      <main>


        {/* =========================
            START前
        ========================= */}
        {!isRunning &&
          !isPaused &&
          countdown === null && (

          <section className="flex flex-col items-center px-6 pt-20">

            <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
              READY
            </p>


            <h2 className="mt-3 text-4xl font-black">
              今日も走ろう。
            </h2>


            <p className="mt-4 text-center text-sm leading-6 text-gray-400">
              GPSを使って
              <br />
              距離・時間・ルートを記録します
            </p>


            <div className="mt-16 flex h-48 w-48 items-center justify-center rounded-full border-4 border-gray-800">

              <button
                onClick={
                  handleStart
                }
                className="cursor-pointer flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 text-2xl font-black shadow-xl"
              >
                START
              </button>

            </div>


            {error && (
              <p className="mt-8 rounded-xl bg-red-950 px-5 py-3 text-center text-sm font-bold text-red-300">
                {error}
              </p>
            )}

          </section>

        )}


        {/* =========================
            カウントダウン
        ========================= */}
        {countdown !== null && (

          <section className="flex flex-col items-center px-6 pt-40">

            <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
              GET READY
            </p>


            <p className="mt-5 text-9xl font-black">
              {countdown}
            </p>

          </section>

        )}


        {/* =========================
            RUNNING / PAUSED
        ========================= */}
        {(isRunning || isPaused) && (

          <section>


            {/* =====================
                MAP
            ===================== */}
            {currentPosition && (

              <div className="relative h-[300px] w-full overflow-hidden">

                <MapContainer
                  center={[
                    currentPosition.latitude,
                    currentPosition.longitude,
                  ]}
                  zoom={17}
                  className="h-full w-full"
                  zoomControl={false}
                >

                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />


                  {/* 走ったルート */}
                  {mapRoute.length > 1 && (

                    <Polyline
                      positions={
                        mapRoute
                      }
                      pathOptions={{
                        color:
                          "#3b82f6",
                        weight:
                          6,
                      }}
                    />

                  )}


                  {/* 現在地 */}
                  <Marker
                    position={[
                      currentPosition.latitude,
                      currentPosition.longitude,
                    ]}
                  />


                  <MapController
                    position={
                      currentPosition
                    }
                  />

                </MapContainer>


                {/* GPS TRACKING */}
                {isRunning && (

                  <div className="absolute left-4 top-4 z-[1000]">

                    <div className="flex items-center gap-2 rounded-full bg-black/80 px-4 py-2">

                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                      <p className="text-xs font-bold text-green-400">
                        GPS TRACKING
                      </p>

                    </div>

                  </div>

                )}


                {/* PAUSED */}
                {isPaused && (

                  <div className="absolute left-4 top-4 z-[1000]">

                    <div className="rounded-full bg-black/80 px-4 py-2">

                      <p className="text-xs font-bold text-yellow-400">
                        ⏸ PAUSED
                      </p>

                    </div>

                  </div>

                )}

              </div>

            )}


            {/* =====================
                記録
            ===================== */}
            <div className="px-6 pb-10">


              {/* AUTO PAUSE */}
              {isAutoPaused && (

                <div className="mt-6 rounded-2xl bg-yellow-950 p-4 text-center">

                  <p className="font-bold text-yellow-400">
                    ⏸ AUTO PAUSED
                  </p>

                  <p className="mt-1 text-sm text-yellow-200">
                    3秒間停止したため自動で一時停止しました
                  </p>

                </div>

              )}


              {/* DISTANCE */}
              <div className="mt-8 text-center">

                <p className="text-xs font-bold tracking-[0.3em] text-gray-500">
                  DISTANCE
                </p>

                <p className="mt-2 text-6xl font-black">
                  {distance.toFixed(
                    2
                  )}
                </p>

                <p className="mt-1 font-bold text-gray-500">
                  KM
                </p>

              </div>


              {/* TIME / PACE */}
              <div className="mt-10 grid grid-cols-2">

                <div className="border-r border-gray-800 text-center">

                  <p className="text-xs text-gray-500">
                    TIME
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {formatTime(
                      elapsedSeconds
                    )}
                  </p>

                </div>


                <div className="text-center">

                  <p className="text-xs text-gray-500">
                    AVG. PACE
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {getPace()}
                  </p>

                  <p className="text-xs text-gray-500">
                    /KM
                  </p>

                </div>

              </div>


              {/* =====================
                  ★ SPLIT表示
              ===================== */}
              {splits.length > 0 && (

                <div className="mt-10">

                  <p className="text-xs font-bold tracking-[0.25em] text-gray-500">
                    SPLITS
                  </p>


                  <div className="mt-3 overflow-hidden rounded-2xl bg-gray-900">

                    {splits.map(
                      (split) => (

                        <div
                          key={
                            split.kilometer
                          }
                          className="flex items-center justify-between border-b border-gray-800 px-5 py-4 last:border-b-0"
                        >

                          <p className="font-bold text-gray-400">
                            {
                              split.kilometer
                            } KM
                          </p>


                          <p className="text-xl font-black">
                            {
                              split.time
                            }
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* =====================
                  RUNNING中
              ===================== */}
              {isRunning && (

                <div className="mt-10 flex justify-center">

                  <button
                    onClick={
                      handlePause
                    }
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500 font-black text-white shadow-lg cursor-pointer"
                  >
                    STOP
                  </button>

                </div>

              )}


              {/* =====================
                  PAUSE中
              ===================== */}
              {isPaused && (

                <div className="mt-10">


                  {/* RESUME */}
                  <button
                    onClick={
                      handleResume
                    }
                    className="w-full rounded-2xl bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 py-4 text-lg font-black cursor-pointer"
                  >
                    ▶ RESUME
                  </button>


                  {/* 長押し終了 */}
                  <button
                    onPointerDown={
                      startLongPress
                    }
                    onPointerUp={
                      cancelLongPress
                    }
                    onPointerLeave={
                      cancelLongPress
                    }
                    onPointerCancel={
                      cancelLongPress
                    }
                    className="mt-4 w-full select-none rounded-2xl border-2 border-red-500 py-5 font-black text-red-400 cursor-pointer"
                  >
                    長押しで終了

                    <span className="mt-1 block text-xs font-normal text-gray-500">
                      HOLD TO FINISH
                    </span>

                  </button>


                  <p className="mt-3 text-center text-xs text-gray-600">
                    1.5秒間押し続けるとランニングを保存します
                  </p>

                </div>

              )}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default Running;