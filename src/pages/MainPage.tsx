import { Page } from "@/components/Page";
import { useNavigateWithParams } from "@/hooks";
import { ROUTES } from "@/config";



export const MainPage = () => {
  return (
    <Page>
      <div className="grid grid-cols-2 gap-4 max-w-[500px] justify-center items-stretch mx-auto mt-10">
        <Product label="Liquidity Hub" path={ROUTES.liquidityHub.root} />
        <Product label="Twap" path={ROUTES.twap.root} />
      </div>
    </Page>
  );
};


const Product = ({ label, path }: { label: string; path: string }) => {
  const navigate = useNavigateWithParams();

  return (
    <div className="flex flex-col gap-2 cursor-pointer bg-slate-800/50 border border-border rounded-lg text-white p-10 hover:bg-slate-800/70 transition-all duration-300" onClick={() => navigate(path)}>
      <p className="text-lg font-bold text-center">{label}</p>
    </div>
  );
};
