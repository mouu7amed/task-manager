import { Route, Routes } from "react-router-dom";
import { Main } from "./Main";
import { Login } from "./Authentication/Login";
import { Register } from "./Authentication/Register";
import { Dashboard } from "./Dashboard/Dashboard";
import { AuthProvider } from "../utilities/AuthProvider";
import { RequireAuth } from "../utilities/RequireAuth";
import { ForgotPassword } from "./Authentication/ForgotPassword";
import { NoMatch } from "./Utils/NoMatch";
import { Profile } from "./Dashboard/Profile/Profile";
import { Settings } from "./Dashboard/Settings/Settings";
import { Redirecting } from "./Utils/Redirecting";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login title="Login" />} />
        <Route path="/register" element={<Register title="Register" />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword title="Forgot Password" />}
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard title="Dashboard" />
            </RequireAuth>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="/redirecting"
          element={
            <RequireAuth>
              <Redirecting title="Redirecting" />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NoMatch title="Page Not Found" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
