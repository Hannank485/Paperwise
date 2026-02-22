import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AuthenticationPage from "./pages/AuthenticationPage";
import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import authApi from "./api/authApi";
function App() {
  const [dark, setDark] = useState<boolean>((): boolean => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : false;
  });
  const [auth, setAuth] = useState<null | boolean>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", JSON.stringify(dark));
  }, [dark]);
  useEffect(() => {
    async function CheckAuth() {
      try {
        await authApi.checkAuth();
        setLoading(false);
        setAuth(true);
      } catch {
        setAuth(false);
      }
    }
    CheckAuth();
  }, []);

  const handleDark = () => {
    setDark((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <main className="w-full h-dvh flex flex-col transition-colors duration-150 ease-in-out">
        <Navbar dark={dark} setDark={handleDark} />
        <Routes>
          {auth == false && !loading && (
            <Route
              path="/"
              element={<AuthenticationPage setAuth={setAuth} />}
            />
          )}
          {auth == true && !loading && (
            <Route
              path="/"
              element={
                <>
                  <h1
                    onClick={async () => {
                      await authApi.logout();
                      setAuth(false);
                    }}
                  >
                    hello
                  </h1>
                </>
              }
            />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
