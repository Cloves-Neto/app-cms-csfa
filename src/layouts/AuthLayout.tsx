import { Outlet } from "react-router-dom";

/**
 * Layout de Autenticação Split-Screen.
 * Lado esquerdo: Formulário institucional clean com logo e cores da marca.
 * Lado direito: Imagem de ambientação educacional CSFA.
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] overflow-hidden">
      {/* Lado Esquerdo: Formulário de Login */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 py-10 bg-white relative z-10">
        <div className="w-full max-w-md">
          {/* Topo: Círculo Blue-Brand com Logo White */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-42 h-42 rounded-full bg-csfa-navy shadow-lg shadow-[#44abff]/25 flex items-center justify-center p-3 mb-3 hover:scale-105 transition-transform duration-200">
              <img
                src="/logo-white.svg"
                alt="Logo CSFA"
                className="w-full h-full object-cover scale-130 mb-4 mr-1 filter drop-shadow-sm"
              />
            </div>
            <h1 className="text-xl font-bold text-[#0f1e36] tracking-tight">
              Colégio São Francisco de Assis
            </h1>
            <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
              Olá! Entre com as mesmas informações que você usa no Portal.
            </p>
          </div>

          {/* Renderização do Formulário de Login */}
          <Outlet />
        </div>
      </div>

      {/* Lado Direito: Imagem da Estudante em Sala de Aula */}
      <div className="hidden lg:block lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-[#0f1e36]">
        <img
          src="/student-login.jpg"
          alt="Estudante do Colégio São Francisco de Assis"
          className="absolute inset-0 w-full h-full object-cover object-center scale-100 hover:scale-[1.02] transition-transform duration-700 ease-out"
        />
        {/* Overlay sutil de iluminação e vinheta */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e36]/30 via-transparent to-black/10 pointer-events-none" />
      </div>
    </div>
  );
}
