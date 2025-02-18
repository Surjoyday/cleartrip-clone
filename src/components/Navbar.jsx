import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import { Popover } from "@mui/material";

import { Logo } from "./Logo";
import LoginPage from "../pages/LoginPage";
import { formatDates } from "../assets/helper";

import { MdFlight, MdHotel } from "react-icons/md";
import {
  PiArrowsLeftRightBold,
  PiCalendarBlankLight,
  PiUserCircleLight,
  PiSuitcaseLight,
  PiSignOutLight,
} from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import {
  IoPersonOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";

export default function Navbar() {
  const { showLoginSignupModal, handleLogout, token, name } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const location = useLocation();

  const urlState = location.state;

  // console.log(urlState?.tarvellers);

  return (
    <>
      <nav
        className={` sticky top-0 bg-white z-20 ${
          location.pathname === "/hotels/results" ? "" : "shadow"
        }`}
      >
        <div className="mx-8 py-4 nav-width px-5 max-sm:px-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo />

              {/* /// BASED ON PAGES SHOWING THE FLIGHT AND HOTEL ICON FOR ROUTE */}
              {(location.pathname === "/offers" ||
                location.pathname.includes("/mytrips") ||
                location.pathname === "/flights/results" ||
                location.pathname === "/hotels/results") && (
                <>
                  <Link to={"/flights"}>
                    <MdFlight
                      size={23}
                      title="Flight Page"
                      className={` cursor-pointer max-sm:hidden hover:text-[#0E6AFF] ${
                        location.pathname.startsWith("/flights")
                          ? "text-[#0E6AFF]"
                          : "text-stone-500"
                      }`}
                    />
                  </Link>
                  <Link to={"/hotels"}>
                    <MdHotel
                      size={23}
                      title="Hotel Page"
                      className={`cursor-pointer max-sm:hidden hover:text-[#0E6AFF] ${
                        location.pathname.startsWith("/hotels")
                          ? "text-[#0E6AFF]"
                          : "text-stone-500"
                      }`}
                    />
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center">
              {token ? (
                <>
                  <div
                    // onClick={(e) => setAnchorEl(e.currentTarget)}
                    className="pr-3 max-sm:pr-2 cursor-pointer"
                  >
                    {name && (
                      <div
                        className="whitespace-nowrap flex gap-2 items-center"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                      >
                        <PiUserCircleLight size={23} />
                        <span className="text-md max-sm:text-sm font-medium ">
                          Hi, {name.split(" ").at(0)}
                        </span>

                        {anchorEl !== null ? (
                          <IoChevronUpOutline />
                        ) : (
                          <IoChevronDownOutline />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Popover
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <div className="w-40 cursor-pointer">
                        <div className=" flex items-center gap-4 font-medium hover:bg-slate-200 px-3 py-4">
                          <PiSuitcaseLight size={20} />
                          <Link
                            to={"mytrips"}
                            onClick={() => setAnchorEl(null)}
                          >
                            My Trips
                          </Link>
                        </div>

                        <div
                          onClick={() => {
                            handleLogout();
                            setAnchorEl(null);
                          }}
                          className="flex items-center gap-4 hover:bg-slate-200 font-medium px-3 py-4"
                        >
                          <PiSignOutLight size={20} />
                          <p>Sign out</p>
                        </div>
                      </div>
                    </Popover>
                  </div>
                </>
              ) : (
                <button
                  className={`${
                    location.pathname === "/flights" ||
                    location.pathname === "/hotels"
                      ? "bg-[#3366CC] hover:bg-[#244EAF] text-[white]"
                      : "border border-stone-400 text-black"
                  } font-medium text-base max-sm:text-xs px-2 py-2  rounded-md mx-sm:text-xs max-sm:font-normal`}
                  onClick={showLoginSignupModal}
                >
                  Login / Sign up
                </button>
              )}
            </div>
          </div>
          {location.pathname === "/flights/results" && (
            <FlightSearchSummary urlState={urlState} />
          )}
          {(location.pathname === "/hotels/results" ||
            location.pathname.includes("/hotels/itinerary/")) && (
            <HotelSearchedSummary />
          )}
        </div>
      </nav>

      <LoginPage />
    </>
  );
}

function FlightSearchSummary({ urlState }) {
  const totalTravellers =
    urlState?.tarvellers?.adults +
    urlState?.tarvellers?.children +
    urlState?.tarvellers?.infants;

  // console.log(totalTravellers);
  return (
    <>
      <div className="flight-search-criteria-summary flex">
        <div className="font-normal flex gap-12 items-center text-sm pt-3 m-auto w-100 overflow-x-auto whitespace-nowrap max-sm:mt-2">
          <p className="border rounded-[4px] p-2">One way</p>

          <div className="origin-destination-info  flex gap-5 items-center">
            <p className="border rounded-[4px] p-2 w-[200px]">
              <span>{urlState?.origin.cityCode}</span>
              <span> &ndash; </span>
              <span>{urlState?.origin.city}</span>
              <span>&sbquo; </span>
              <span>
                {urlState?.origin.country !== "India"
                  ? urlState?.origin.country
                  : "IN"}
              </span>
            </p>
            <p>
              <PiArrowsLeftRightBold size={18} className="text-[#ED6521]" />
            </p>
            <p className="border rounded-[4px] p-2 w-[200px]">
              <span>{urlState?.destination.cityCode}</span>
              <span> &ndash; </span>
              <span>{urlState?.destination.city}</span>
              <span>&sbquo; </span>
              <span>
                {urlState?.destination.country !== "India"
                  ? urlState?.destination.country
                  : "IN"}
              </span>
            </p>
          </div>

          <p className="border rounded-[4px] p-2">
            {formatDates(new Date(urlState?.dateInput))}
          </p>
          <p className="border rounded-[4px] p-2">
            {totalTravellers}{" "}
            {`${totalTravellers > 1 ? "Travellers" : "Traveller"} `}
          </p>
        </div>
      </div>
    </>
  );
}

function HotelSearchedSummary() {
  const [searchParams] = useSearchParams();

  const city = searchParams.get("city");
  const checkInDate = searchParams.get("chk_in");
  const checkOutDate = searchParams.get("chk_out");
  const guests = JSON.parse(searchParams.get("guests"));
  const rooms = searchParams.get("rooms");

  // console.log(city);
  // console.log(checkInDate);
  // console.log(checkOutDate);
  // console.log(guest);
  // console.log(rooms);

  const totalGuest = guests.reduce(
    (acc, curr) => acc + curr.adults + curr.children,
    0
  );

  // console.log(totalGuest);

  return (
    <div className="flex justify-center max-sm:text-xs">
      <div className="flex gap-3 max-sm:py-0 border rounded-md max-sm:mt-5 max-sm:overflow-x-auto">
        <div className="flex items-center gap-2 p-3  border-r-2">
          <CiLocationOn size={18} />
          <p className="font-semibold">{city}</p>
        </div>
        <div className="flex items-center gap-2 p-2 border-r-2">
          <PiCalendarBlankLight size={18} />
          <div className="flex gap-3  max-sm:text-xs whitespace-nowrap">
            <p className="font-semibold border-r-2 pr-3">
              {formatDates(new Date(checkInDate))}
            </p>
            <p className="font-semibold">
              {formatDates(new Date(checkOutDate))}
            </p>
          </div>
        </div>
        <div className="flex items-center pr-3 gap-2 max-sm:text-sm whitespace-nowrap">
          <IoPersonOutline />
          <p className="font-semibold">{`${rooms} ${
            +rooms === 1 ? "room" : "rooms"
          }`}</p>
          <span>,</span>
          <p className="font-semibold">{`${totalGuest} ${
            +totalGuest === 1 ? "guest" : "guests"
          }`}</p>
        </div>
      </div>
    </div>
  );
}
