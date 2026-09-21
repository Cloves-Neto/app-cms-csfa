import { Users as UsersIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface UserHeaderProps {
  onNewUserClick: () => void;
}

export function UserHeader({ onNewUserClick }: UserHeaderProps) {
  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full h-full">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1e36] flex items-center gap-2">
          <UsersIcon size={22} className="text-[#44abff]" />
          <span>Gestão de Usuários & Acessos</span>
        </h1>
        <p className="text-xs text-gray-500 font-normal mt-0.5">
          Cadastre administradores, professores e coordenação com controle granular de permissões e horários.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-start shrink-0 w-full sm:w-auto">
        <Button
          onClick={onNewUserClick}
          icon={<UserPlus size={15} className="text-[#44abff]" />}
          size="md"
        >
          Novo Usuário
        </Button>
      </div>
    </nav>
  );
}
