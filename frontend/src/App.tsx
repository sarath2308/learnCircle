import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { connectSocket } from "./socket/socket";

const App = () => {
  // App.tsx or Layout.tsx
  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        {/* ToastContainer*/}
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </>
  );
};

export default App;
