import Loader from "../components/global/loader";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader /> <span> loading ...</span>
    </div>
  );
}
