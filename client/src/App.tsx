import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AuthenticationPage from "./pages/AuthenticationPage";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import authApi from "./api/authApi";
import Home from "./pages/Home";
import SidebarComp from "./components/SidebarComp";
import { SidebarProvider } from "./components/ui/sidebar";
import { SidebarTrigger } from "./components/ui/sidebar";
import Sessions from "./pages/Sessions";

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
      <SidebarProvider>
        <main className="w-full h-dvh flex flex-row transition-colors duration-150 ease-in-out relative">
          {auth && (
            <div>
              <SidebarComp setAuth={setAuth} />
            </div>
          )}

          <div className="flex flex-col h-full w-full relative">
            <nav
              className="w-full flex pt-4 pb-2 px-2 border-b  top-0    backdrop-blur-2xl"
              style={{
                justifyContent: auth ? "space-between" : "flex-end",
                position: auth ? "sticky" : "fixed",
              }}
            >
              {auth && (
                <SidebarTrigger className=" hover:bg-accent! hover:text-white! rounded-md cursor-pointer!" />
              )}

              <p
                className="hover:bg-accent hover:text-white p-2 rounded-2xl cursor-pointer w-fit self-end"
                onClick={() => handleDark()}
              >
                {dark ? <Sun /> : <Moon />}
              </p>
            </nav>
            <div className="flex-1">
              <Routes>
                {auth == false && !loading && (
                  <Route
                    path="/"
                    element={<AuthenticationPage setAuth={setAuth} />}
                  />
                )}
                {auth == true && !loading && (
                  <>
                    <Route
                      path="/"
                      element={
                        <>
                          <Home />
                        </>
                      }
                    />
                    <Route
                      path="/session"
                      element={
                        <>
                          <Sessions />
                        </>
                      }
                    />
                  </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
