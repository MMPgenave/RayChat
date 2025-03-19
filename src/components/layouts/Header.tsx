import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <div className=" mt-6  m-auto flex gap-4 items-center border-b-2 mb-10 w-full justify-center pb-2">
      <NavLink to="/client" className=" hover:text-blue-400" dir="ltr">
        /client
      </NavLink>
      <NavLink to="/agent" className=" hover:text-blue-400" dir="ltr">
        /agent
      </NavLink>
    </div>
  );
}
