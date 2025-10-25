import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { React } from "react";
import { Toaster } from "react-hot-toast";

const App = () => (
  <BrowserRouter>
    <AppRoutes />
    {/* ToastContainer*/}
    <Toaster position="top-center" reverseOrder={false} />
  </BrowserRouter>
);

export default App;
