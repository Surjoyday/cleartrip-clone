import { NavLink, useLocation, Link } from "react-router-dom";
import { PiAirplaneTiltLight, PiAirplaneTiltFill } from "react-icons/pi";

import { RiHotelLine, RiHotelFill } from "react-icons/ri";
import { MdOutlineLocalOffer, MdLocalOffer } from "react-icons/md";
import { PiSuitcaseLight } from "react-icons/pi";

export default function SideNavbar() {
  const loaction = useLocation();

  // console.log(loaction);

  return (
    <nav className="flex flex-col max-sm:w-full w-40">
      <ul className="list-none cursor-pointer flex flex-col gap-8 max-sm:flex-row font-medium overflow-x-auto">
        <li title="Flights">
          <NavLink
            to={"flights"}
            className={({ isActive }) =>
              `flex gap-1 p-3  max-sm:pr-2 hover:bg-[#d5e7fc] hover:text-[#0E6AFF]  rounded-[4px] transition transition-duration:1s ${
                isActive ? "bg-[#d5e7fc]" : ""
              }`
            }
          >
            {loaction.pathname === "/flights" ? (
              <>
                <div className="flex gap-4">
                  <PiAirplaneTiltFill size={24} className="text-[#0E6AFF]" />
                  <p className=" text-[#0E6AFF]">Flights</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <PiAirplaneTiltLight size={24} /> <p>Flights</p>
                </div>
              </>
            )}
          </NavLink>
        </li>
        <li title="Hotels">
          <NavLink
            to={"hotels"}
            className={({ isActive }) =>
              `flex gap-1 p-3 max-sm:pr-0 hover:bg-[#d5e7fc] hover:text-[#0E6AFF]  rounded-[4px] transition transition-duration:1s ${
                isActive ? "bg-[#d5e7fc]" : ""
              }`
            }
          >
            {loaction.pathname === "/hotels" ? (
              <>
                <div className="flex gap-4">
                  <RiHotelFill size={24} className="text-[#0E6AFF]" />
                  <p className=" text-[#0E6AFF] pr-2">Hotels</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <RiHotelLine size={24} /> <p>Hotels</p>
                </div>
              </>
            )}
          </NavLink>
        </li>
        <li title="Offers">
          <Link
            to={"offers"}
            className={`flex gap-1 p-3 max-sm:pr-0 hover:bg-[#d5e7fc] hover:text-[#0E6AFF] rounded-[4px]  transition transition-duration:1s `}
          >
            <div className="flex gap-4">
              <MdOutlineLocalOffer size={24} /> <p>Offers</p>
            </div>
          </Link>
        </li>

        <li title="My Trips">
          <Link
            to={"mytrips"}
            className={`flex gap-1 p-3 max-sm:pr-0 hover:bg-[#d5e7fc] hover:text-[#0E6AFF] rounded-[4px]  transition transition-duration:1s `}
          >
            <div className="flex gap-4">
              <PiSuitcaseLight size={24} />
              <p className="whitespace-nowrap">My trips</p>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
