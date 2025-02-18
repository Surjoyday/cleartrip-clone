import { TfiFaceSad } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className=" flex flex-col gap-4 items-center">
        <TfiFaceSad size={100} className="text-stone-600" />
        <p className="text-3xl text-stone-500">404</p>
        <p className="font-semibold text-stone-500">Page not found</p>
        <p className="text-sm text-stone-500">
          The page you are looking for doesn't exist or any other error occured
        </p>

        <button
          onClick={() => navigate("/")}
          className="py-2 px-5 bg-slate-600 rounded-md text-white cursor-pointer"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
