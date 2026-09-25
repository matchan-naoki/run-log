import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-20 items-center justify-around">

        {/* 履歴 */}
<button
  onClick={() => navigate("/history")}
  className={`flex flex-col items-center gap-1 cursor-pointer ${
    location.pathname === "/history"
      ? "text-blue-500"
      : "text-gray-400"
  }`}
>
  <span className="text-2xl">📋</span>

  <span
    className={`border-b-2 pb-1 text-xs font-bold ${
      location.pathname === "/history"
        ? "border-blue-500"
        : "border-transparent"
    }`}
  >
    HISTORY
  </span>
</button>

        {/* RUN */}
        <button
          onClick={() => navigate("/running")}
          className="cursor-pointer -mt-10 flex h-30 w-30 flex-col items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 text-white shadow-xl"
        >
          <span className="text-4xl">🏃</span>
          <span className="text-sm font-black mt-2">
  RUN
</span>
        </button>

        {/* プロフィール */}
<button
  onClick={() => navigate("/profile")}
  className={`flex flex-col items-center gap-1 cursor-pointer ${
    location.pathname === "/profile"
      ? "text-blue-500"
      : "text-gray-400"
  }`}
>
  <span className="text-2xl">👤</span>

  <span
    className={`border-b-2 pb-1 text-xs font-bold ${
      location.pathname === "/profile"
        ? "border-blue-500"
        : "border-transparent"
    }`}
  >
    PROFILE
  </span>
</button>

      </div>
    </nav>
  );
}

export default BottomNav;