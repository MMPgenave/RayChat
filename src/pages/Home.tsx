import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className=" mt-6 w-8 m-auto flex gap-4 items-center">
      <Link to="/client">/client</Link>
      <Link to="/agent">/agent</Link>
    </div>
  );
}
