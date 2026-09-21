import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth";
import { AppRoutes } from "@/routes";

/**
 * Ponto de entrada da aplicação.
 * Envolve a árvore com o AuthProvider e o sistema de roteamento desacoplado.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
