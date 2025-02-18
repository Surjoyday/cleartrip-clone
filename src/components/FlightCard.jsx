import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdOutlineCircle } from "react-icons/md";
import { GoClock } from "react-icons/go";
import { useLocation, useSearchParams } from "react-router-dom";
import { airlineImages, formatDates } from "../assets/helper";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function FlightCard({ flight }) {
  // console.log(flight);
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const travelClass = searchParams.get("travel_class");
  const urlState = location.state;
  const fromLocation = urlState.origin;
  const toLocation = urlState.destination;
  const travellers = urlState.tarvellers;
  const date = urlState.dateInput;

  // console.log(travellers);
  // console.log(urlState);
  const { token } = useAuth();

  const imageSrc = flight?.flightID.split("-").at(0).slice(0, 2);

  const numSeats = travellers.adults + travellers.children + travellers.infants;

  // console.log(numSeats);

  function handleNavigate() {
    if (token) {
      navigate(`/flights/itinerary/${flight._id}`, {
        state: {
          fromLocation,
          toLocation,
          travellers,
          numSeats,
          date,
          imageSrc,
          travelClass,
        },
      });
    } else if (!token) {
      toast.warn("You must log in to continue");
    }
  }

  return (
    <div
      className={`flex flex-col gap-2 shadow-sm transition-all duration-300 mb-7 ${
        isOpen && "border rounded-md pb-2"
      } `}
    >
      <div
        className={`card-container flex gap-12 items-center justify-around border border-stone-200 rounded-md  p-4 ${
          isOpen ? "border-none " : ""
        } `}
      >
        <div className="flight-id max-sm:text-xs">
          <img
            src={airlineImages[imageSrc].at(0)}
            alt={`${airlineImages[imageSrc].at(1)}-img`}
            width={50}
            height={50}
          />
          <p className="pt-1 font-semibold">{airlineImages[imageSrc].at(1)}</p>
          <p className="text-sm text-stone-500">
            {flight.flightID.split("-").at(0)}
          </p>
          <p
            className="text-[#3366CC] text-sm cursor-pointer max-sm:hidden"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "Hide details" : "Flight details"}
          </p>
        </div>

        <div className="flex items-center gap-24 departure-diration-arrival max-sm:flex-col max-sm:gap-10">
          <div className="text-xl departure-time">
            <p>{flight.departureTime}</p>
          </div>

          <div className="w-20 text-center duration-stops ">
            <p className="pb-1">{flight.duration}h</p>
            <div className="relative flex border border-stone-400 justify-evenly">
              {[...Array(flight.stops)].map((_, index) => (
                <span
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/3"
                  style={{ marginLeft: `${index * 30}px` }}
                >
                  <MdOutlineCircle
                    size={11}
                    className="bg-white text-[#FF4F17]"
                  />
                </span>
              ))}
            </div>
            <p className="pt-1 text-stone-400">
              {flight.stops === 0 ? "non-stop" : flight.stops + " stop"}
            </p>
          </div>

          <div className="text-xl arrival-time">
            <p>{flight.arrivalTime}</p>
          </div>
        </div>

        <div className="flex items-center seats-price-book-btn gap-7 max-sm:flex-col">
          <div className="flex flex-col w-20 gap-2 price-seats whitespace-nowrap ">
            <p className="self-end text-2xl font-bold max-sm:text-xl">
              &#8377; {flight.ticketPrice}
            </p>
            <p
              className={`self-end max-sm:text-sm ${
                flight.availableSeats <= 70 ? "text-[red]" : "text-[#0FA670]"
              }`}
            >
              {flight.availableSeats} seats left
            </p>
          </div>

          <div className="bg-[#FF4F17] text-[white] p-1 rounded-lg w-20  text-center">
            <button onClick={handleNavigate}>Book</button>
          </div>
        </div>
      </div>

      {/* /// FLIGHT DETAILS */}
      {isOpen && <FlightDetails flight={flight} imageSrc={imageSrc} />}
    </div>
  );
}

function FlightDetails({ flight, imageSrc }) {
  const loaction = useLocation();
  const [searchParams] = useSearchParams();

  const urlState = loaction.state;
  return (
    <>
      <div className="w-11/12 p-2 m-auto border rounded-md flight-details max-sm:hidden">
        <div className="flex gap-2 pb-1 border-b-2 flight-details-row-1">
          <span className="font-semibold">{urlState?.origin?.city}</span>
          <span className="font-semibold">&rarr;</span>
          <span className="font-semibold">{urlState?.destination?.city}</span>
          <span className="text-stone-500">
            {formatDates(new Date(urlState?.dateInput))}
          </span>
        </div>

        <div className="flex items-start gap-2 pt-4 flight-details-row-2 justify-evenly">
          <div className="flex flex-col gap-2 details-col-1">
            <img
              src={airlineImages[imageSrc].at(0)}
              alt={`${airlineImages[imageSrc].at(1)}-img`}
              width={30}
              height={30}
            />
            <p className="text-sm">{airlineImages[imageSrc].at(1)}</p>
            <p className="flex flex-col">
              <span className="text-xs">
                {flight?.flightID?.split("-").at(0)}
              </span>
              <span className="text-xs">
                {searchParams.get("travel_class")}
              </span>
            </p>
          </div>
          <div className="details-col-2">
            <div className="flex gap-2">
              <p>{urlState?.origin?.cityCode}</p>
              <p className="font-semibold">{flight?.departureTime}</p>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              {formatDates(new Date(urlState?.dateInput))}{" "}
              {new Date().getFullYear()}
            </p>
            <p className="mt-1 text-xs text-stone-600 w-min ">
              {urlState?.origin?.airportName}
            </p>
          </div>
          <div className="flex flex-col items-center pt-2 details-col-3">
            <GoClock size={18} />
            <p className="pt-1 text-sm">{flight?.duration}:00h</p>
          </div>

          <div className="details-col-4">
            <div className="flex gap-2">
              <p>{urlState?.destination?.cityCode}</p>
              <p className="font-semibold">{flight?.arrivalTime}</p>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              {formatDates(new Date(urlState?.dateInput))}{" "}
              {new Date().getFullYear()}
            </p>
            <p className="mt-1 text-xs text-stone-600 w-min">
              {urlState?.destination?.airportName}
            </p>
          </div>

          <div className="details-col-5">
            <p className="flex justify-between gap-2 text-xs">
              Check-In Baggage{" "}
              <span className="text-stone-500">{`15kg(1 piece) / adult`}</span>
            </p>
            <p className="flex justify-between gap-2 text-xs">
              Cabin Baggage <span className="text-stone-500">7kg / adult</span>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover={false}
      />
    </>
  );
}
