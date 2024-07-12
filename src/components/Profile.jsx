import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router";

export default function Profile() {
  const location = useLocation();
  const paramPage = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const handleNavigation = (to) => {
    navigate(`${to}`);
  };

  const sidebarPages = ["Profile", "Account"];
  return (
    <div className="w-full h-full px-7 py-7 overflow-y-scroll">
      <div>
        <p className="font-semibold text-2xl mb-2">Settings</p>
        <p className=" text-slate-700">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className=" bg-slate-400 w-full h-lineBreakHeight my-6" />
      <div className="flex gap-5">
        <div className="flex flex-col w-full font-semibold basis-1/5">
          {sidebarPages.map((page, index) => (
            <div
              className={`px-3 py-2 rounded-md w-full cursor-pointer ${
                (!paramPage && page === "Profile") ||
                paramPage === page.toLowerCase()
                  ? "bg-slate-100"
                  : "bg-white"
              }`}
              onClick={() =>
                handleNavigation(page === "Profile" ? "" : page.toLowerCase())
              }
            >
              <p>{page}</p>
            </div>
          ))}
        </div>
        <div className="basis-4/5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
