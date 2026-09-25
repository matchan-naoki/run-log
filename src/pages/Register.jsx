import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    setError("");

    // 空欄チェック
    if (!name || !email || !password) {
      setError("すべての項目を入力してください");
      return;
    }

    // 今まで登録されたユーザーを取得
    const users =
      JSON.parse(localStorage.getItem("runLogUsers")) || [];

    // 同じメールアドレスがないか確認
    const alreadyExists = users.some(
      (user) => user.email === email
    );

    if (alreadyExists) {
      setError("このメールアドレスはすでに登録されています");
      return;
    }

    // 新しいユーザー
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
    };

    // 配列に追加
    const newUsers = [...users, newUser];

    localStorage.setItem(
      "runLogUsers",
      JSON.stringify(newUsers)
    );

    // =========================
    // 初期プロフィール
    // =========================

    const initialProfile = {
      name: name,
      level: 1,
      message: "",
      goal: "",
      goalMessage: "",
      goalDistance: 50,
    };

    localStorage.setItem(
      `profile_${email}`,
      JSON.stringify(initialProfile)
    );

    // =========================
    // ランニング記録
    // =========================

    localStorage.setItem(
      `runs_${email}`,
      JSON.stringify([])
    );

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black">
            RUN LOG
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            走ることで、もっと自由になれる。
          </p>
        </div>

        <h2 className="text-2xl font-bold">
          アカウントを作成
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          RUN LOGでランニングを記録しよう。
        </p>

        <form
          onSubmit={handleRegister}
          className="mt-8"
        >

          <div>
            <label className="text-sm font-bold">
              名前
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Naoki"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-black"
            />
          </div>

          <div className="mt-5">
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
            アカウントを作成
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          すでにアカウントを持っていますか？
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-2 w-full cursor-pointer font-bold hover:underline"
        >
          ログイン
        </button>

      </div>
    </div>
  );
}

export default Register;