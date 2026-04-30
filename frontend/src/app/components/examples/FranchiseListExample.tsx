import { useEffect } from "react";
import { useApi } from "@/hooks";
import { franchiseService } from "@/services";
import { Franchise } from "@/types";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Exemplo de componente que usa a integração melhorada
 */
export function FranchiseListExample() {
  // Ajustado: Pegamos 'user' em vez de 'isAuthenticated'
  const { user } = useAuth();

  // Criamos uma constante local para manter a lógica do restante do componente
  const isAuthenticated = !!user;

  const {
    data: franchises,
    isLoading,
    error,
    execute,
    clearError,
  } = useApi<Franchise[]>([]);

  // Carregar franquias quando o componente monta
  useEffect(() => {
    if (isAuthenticated) {
      execute(franchiseService.list());
    }
  }, [isAuthenticated, execute]);

  // Renderizar diferentes estados
  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-bold text-yellow-800 uppercase text-xs">
          Acesso Restrito
        </p>
        <p className="text-yellow-700">
          Você precisa estar autenticado para ver as franquias.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <p className="mt-2 text-gray-500 font-black uppercase text-[10px]">
          Carregando...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700 font-black uppercase text-sm">
          Erro ao carregar franquias
        </p>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>

        {error.errors && (
          <ul className="text-red-600 text-[10px] mt-2 font-mono bg-white/50 p-2 rounded">
            {Object.entries(error.errors).map(([field, messages]) => (
              <li key={field}>
                <span className="font-black uppercase">{field}:</span>{" "}
                {messages.join(", ")}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={clearError}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] hover:bg-red-700 transition-all"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
          Franquias <span className="text-orange-600">Ativas</span>
        </h2>
        <span className="text-[10px] bg-gray-200 px-2 py-1 rounded font-black uppercase">
          Total: {franchises?.length || 0}
        </span>
      </div>

      {franchises && franchises.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-300">
          <p className="text-gray-400 font-bold">
            Nenhuma franquia encontrada no sistema.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {franchises?.map((franchise) => (
            <div
              key={franchise.id}
              className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black text-gray-900 uppercase">
                  {franchise.nome}
                </h3>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                    franchise.ativo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {franchise.ativo ? "Ativa" : "Inativa"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {franchise.endereco}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  CNPJ: {franchise.cnpj}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                <button className="text-[10px] font-black text-orange-600 uppercase hover:underline">
                  Gerenciar Unidade →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FranchiseListExample;
