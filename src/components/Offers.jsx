import { useEffect, useState } from "react";

import { HEADERS, base_URL } from "../assets/helper";

import { BiSolidOffer } from "react-icons/bi";
import { GiCommercialAirplane } from "react-icons/gi";
import { RiHotelBedLine } from "react-icons/ri";
import { BsTaxiFrontFill } from "react-icons/bs";
import OffersCard from "./OffersCard";
import Loader from "./Loader";
import { ToastContainer } from "react-toastify";

function Offers() {
  const [allOffers, setAllOffers] = useState([]);
  const [flightOffers, setFlightOffers] = useState([]);
  const [cabOffers, setCabOffers] = useState([]);
  const [hotelOffers, setHotelOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState("All Offers");

  useEffect(function () {
    getAllOffers();
  }, []);

  // GETTING ALL OFFERS
  async function getAllOffers() {
    setIsLoading(true);
    try {
      const res = await fetch(`${base_URL}/offers`, {
        method: "GET",
        headers: HEADERS,
      });

      const resData = await res.json();

      // console.log(resData?.data?.offers);

      setAllOffers(resData?.data?.offers);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // GETTING INDIVIDUAL OFFERS DATA
  async function getIndividualOffers(item) {
    if (item === "flights" && flightOffers.length !== 0) return;
    if (item === "hotels" && hotelOffers.length !== 0) return;
    if (item === "cabs" && cabOffers.length !== 0) return;

    const offerType = item.toUpperCase();
    // console.log(offerType);
    setIsLoading(true);
    try {
      const res = await fetch(
        `${base_URL}/offers?filter={"type":"${offerType}"}`,
        {
          method: "GET",
          headers: HEADERS,
        }
      );

      const resData = await res.json();

      // console.log(resData?.data?.offers);
      if (offerType === "FLIGHTS") setFlightOffers(resData?.data?.offers);
      if (offerType === "HOTELS") setHotelOffers(resData?.data?.offers);
      if (offerType === "CABS") setCabOffers(resData?.data?.offers);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // HANDLING ACTIVE OFFERS LIST
  function handleIsActive(item) {
    setIsActive(item);
    getIndividualOffers(item);
  }

  return (
    <>
      {isLoading && <Loader />}
      <aside className="flex max-sm:flex-col mb-10">
        <nav className="px-10 mt-10 max-sm:mt-4 w-50 max-sm:w-full max-sm:px-0">
          <ul className="flex flex-col p-2 gap-8 max-sm:flex-row max-sm:pb-4  max-sm:text-sm overflow-x-auto text-center pr-2 font-medium">
            <li
              className={`flex items-center gap-1 p-2 ${
                isActive === "All Offers" ? "text-[#0E6AFF] bg-[#d5e7fc]" : ""
              }  max-sm:pr-2 hover:bg-[#d5e7fc] hover:text-[#0E6AFF]  rounded-[4px] transition transition-duration:1s cursor-pointer`}
              onClick={() => handleIsActive("All Offers")}
            >
              <BiSolidOffer size={20} />{" "}
              <span className="pl-1 whitespace-nowrap">All Offers</span>
            </li>
            <li
              className={`flex items-center gap-1 p-2 ${
                isActive === "flights" ? "text-[#0E6AFF] bg-[#d5e7fc]" : ""
              }  max-sm:pr-2 hover:bg-[#d5e7fc] hover:text-[#0E6AFF]  rounded-[4px] transition transition-duration:1s cursor-pointer`}
              onClick={() => handleIsActive("flights")}
            >
              <GiCommercialAirplane size={20} />
              <span className="pl-1 whitespace-nowrap">Flight Offers</span>
            </li>
            <li
              className={`flex items-center gap-1 p-2 ${
                isActive === "hotels" ? "text-[#0E6AFF] bg-[#d5e7fc]" : ""
              }  max-sm:pr-2 hover:bg-[#d5e7fc] hover:text-[#0E6AFF]  rounded-[4px] transition transition-duration:1s cursor-pointer`}
              onClick={() => handleIsActive("hotels")}
            >
              <RiHotelBedLine size={20} />
              <span className="pl-1 whitespace-nowrap">Hotel Offers</span>
            </li>
            <li
              className={`flex items-center gap-1 p-2 ${
                isActive === "cabs" ? "text-[#0E6AFF] bg-[#d5e7fc]" : ""
              }  max-sm:pr-2 hover:bg-[#d5e7fc] hover:text-[#0E6AFF]  rounded-[4px] transition transition-duration:1s cursor-pointer`}
              onClick={() => handleIsActive("cabs")}
            >
              <BsTaxiFrontFill size={20} />
              <span className="pl-1 whitespace-nowrap">Cab Offers</span>
            </li>
          </ul>
        </nav>

        {/* OFFERS */}
        <div className="mt-7 max-sm:mt-2">
          {isActive === "All Offers" && (
            <OffersCard offerCardData={allOffers} />
          )}
          {isActive === "flights" && (
            <OffersCard offerCardData={flightOffers} />
          )}
          {isActive === "hotels" && <OffersCard offerCardData={hotelOffers} />}
          {isActive === "cabs" && <OffersCard offerCardData={cabOffers} />}
        </div>
      </aside>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover={false}
      />
    </>
  );
}

export default Offers;
