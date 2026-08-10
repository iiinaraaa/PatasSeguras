import Spinner from "./Spinner";

export default function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <Spinner size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
