import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // デモ用管理者
  const ADMIN_EMAIL = "admin@runlog.com";
  const ADMIN_PASSWORD = "runlog123";

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "メールアドレスとパスワードを入力してください"
      );
      return;
    }

    // =========================
    // 管理者
    // =========================

    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "admin");
      localStorage.setItem(
        "currentUserEmail",
        ADMIN_EMAIL
      );

      // 管理者プロフィールがなければ作成
      const adminProfileKey =
        `profile_${ADMIN_EMAIL}`;

      if (!localStorage.getItem(adminProfileKey)) {
        const adminProfile = {
          name: "RUN LOG Admin",
          level: 1,
          message: "RUN LOG 管理者",
          goal: "",
          goalMessage: "",
          goalDistance: 50,
        };

        localStorage.setItem(
          adminProfileKey,
          JSON.stringify(adminProfile)
        );
      }

      // 管理者のRUNデータ
      if (
        !localStorage.getItem(
          `runs_${ADMIN_EMAIL}`
        )
      ) {
        localStorage.setItem(
          `runs_${ADMIN_EMAIL}`,
          JSON.stringify([])
        );
      }

      window.location.href = "/";
      return;
    }

    // =========================
    // 一般ユーザー
    // =========================

    const users =
      JSON.parse(localStorage.getItem("runLogUsers")) || [];

    const user = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!user) {
      setError(
        "メールアドレスまたはパスワードが違います"
      );
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "user");

    localStorage.setItem(
      "currentUserEmail",
      user.email
    );

    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">

        <div className="mb-10 text-center">
        <h1 className="bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500 bg-clip-text text-4xl font-black text-transparent">
  RUN LOG
</h1>

          <p className="mt-2 text-sm text-gray-500">
            走ることで、もっと自由になれる。
          </p>
        </div>

        <h2 className="text-2xl font-bold">
          おかえりなさい。
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          ログインして今日のランを始めよう。
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8"
        >

          <div>
            <label className="text-sm font-bold">
              メールアドレス
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="runlog@example.com"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-black"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-bold">
              パスワード
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="パスワード"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-black"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 w-full cursor-pointer rounded-xl bg-black py-4 font-bold text-white hover:bg-gray-800"
          >
            ログイン
          </button>

        </form>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">

          <p className="text-sm text-gray-500">
            RUN LOGは初めてですか？
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-2 cursor-pointer font-bold hover:underline"
          >
            新規登録
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;