import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <StrictMode>
   <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={clientId!}>
    <App />
  </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
  </Provider>

)
