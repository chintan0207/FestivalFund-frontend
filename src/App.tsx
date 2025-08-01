import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import LoginPage from "./src/pages/LoginPage";
import RegisterPage from "./src/pages/RegisterPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" />
    </>
  );
};

export default App;
