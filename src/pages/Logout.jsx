import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  // =========================
  // ログアウト
  // =========================
  const handleLogout = () => {
    // ログイン状態を削除
    localStorage.removeItem("isLoggedIn");

    // admin / user の情報を削除
    localStorage.removeItem("role");

    // ログイン画面へ
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-sm text-center">

        {/* アイコン */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-4xl">
          👋
        </div>

        {/* タイトル */}
        <h1 className="mt-6 text-2xl font-black">
          ログアウトしますか？
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          ログアウトすると、もう一度ログインが必要になります。
        </p>

        {/* ログアウト */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full cursor-pointer rounded-xl bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 py-4 font-bold text-white"
        >
          ログアウト
        </button>

        {/* キャンセル */}
        <button
          onClick={() => navigate("/profile")}
          className="mt-3 w-full cursor-pointer rounded-xl bg-red-200 py-4 font-bold hover:bg-red-300 text-red-500"
        >
          キャンセル
        </button>

      </div>

    </div>
  );
}

export default Logout;