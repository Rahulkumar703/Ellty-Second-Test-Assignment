import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import { lazy } from "react";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import GuestRoute from "./components/guest-route";

const HomePage = lazy(() => import("./pages/home"));
const LoginPage = lazy(() => import("./pages/login"));
const SignupPage = lazy(() => import("./pages/signup"));
const StartingNumbers = lazy(() => import("./pages/starting-numbers"));

function App() {
  return (
    <AuthProvider>
      <Header />
      <main className="flex flex-col flex-1">
        <Routes>
          <Route path="/" index element={<HomePage />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />
          <Route path="/starting-numbers" element={<StartingNumbers />} />
        </Routes>
        <Toaster
          position="bottom-right"
          theme="light"
          richColors
          className="top1/2"
        />
      </main>
    </AuthProvider>
  );
}

export default App;
