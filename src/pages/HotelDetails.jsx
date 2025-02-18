import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { HEADERS, base_URL } from "../assets/helper";
import {
  MdOutlineFastfood,
  MdOutlineLocalBar,
  MdOutlineFreeCancellation,
} from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoRestaurantOutline } from "react-icons/io5";
import { CgGym } from "react-icons/cg";
import { FaWifi, FaSwimmer, FaSpa } from "react-icons/fa";
import { BiBed } from "react-icons/bi";

import Loader from "../components/Loader";
import PageNotFound from "../pages/PageNotFound";

function amenityIcons(amenities) {
  switch (amenities.toLowerCase()) {
    case "restaurant":
      return <IoRestaurantOutline size={22} />;
    case "gym":
      return <CgGym size={22} />;
    case "free wifi":
      return <FaWifi size={22} />;
    case "swimming pool":
      return <FaSwimmer size={22} />;
    case "spa":
      return <FaSpa size={22} />;
    case "bar":
      return <MdOutlineLocalBar size={22} />;
    default:
      return null;
  }
}

export default function HotelDetails() {
  const [hotelData, setHotelData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageIndex, setImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("general");
  const imageRef = useRef(null);
  const generalRef = useRef(null);
  const amenitiesRef = useRef(null);
  const roomsRef = useRef(null);
  const params = useParams();
  const [searchParams] = useSearchParams();

  const hotelID = params.hotelID;
  const city = searchParams.get("city");
  const checkInDate = searchParams.get("chk_in");
  const checkOutDate = searchParams.get("chk_out");
  const guests = searchParams.get("guests");
  const rooms = searchParams.get("rooms");

  const navigate = useNavigate();

  function handleNavigate(selectedRoomId) {
    navigate(
      `/hotels/confirmation/${selectedRoomId}?chk_in=${checkInDate}&chk_out=${checkOutDate}&guests=${guests}&rooms=${rooms}`,
      {
        state: { hotelData },
      }
    );
  }

  function handleMovetoNextImg() {
    setImgIndex((nextIndex) =>
      nextIndex < hotelData?.images?.length - 1 ? nextIndex + 1 : 0
    );
  }

  function handleMovetoPrevImg() {
    setImgIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : hotelData?.images?.length - 1
    );
  }

  function handleMouseEnter() {
    imageRef.current?.querySelector(".left-button")?.classList.add("visible");
    imageRef.current?.querySelector(".right-button")?.classList.add("visible");
  }

  function handleMouseLeave() {
    imageRef.current.querySelector(".left-button").classList.remove("visible");
    imageRef.current.querySelector(".right-button").classList.remove("visible");
    setImgIndex(0);
  }

  useEffect(function () {
    async function getHotelDetails() {
      setIsError(false);
      setIsLoading(true);
      try {
        const res = await fetch(`${base_URL}/hotel/${hotelID}`, {
          method: "GET",
          headers: HEADERS,
        });
        const resData = await res.json();

        if (resData?.status === "fail") throw new Error(resData?.message);

        if (resData?.message === "success") {
          const dataOfHotel = resData?.data;
          setHotelData(dataOfHotel);
        }
      } catch (err) {
        setIsError(true);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    getHotelDetails();
  }, []);

  // console.log(hotelID);
  // console.log(hotelData);

  // console.log(location);

  if (isLoading) return <Loader />;

  if (!isLoading && isError) return <PageNotFound />;

  return (
    <>
      <div className="mb-10">
        <div className="border-b pt-4 px-12 sticky top-24 max-sm:top-32 z-20 bg-white">
          <ul className="flex gap-7 px-7">
            <li>
              <button
                onClick={() => {
                  generalRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });

                  setActiveTab("general");
                }}
                className={
                  activeTab === "general" ? "border-b-2 border-black" : ""
                }
              >
                General
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  // amenitiesRef.current?.scrollIntoView({
                  //   behavior: "smooth",
                  //   block: "end",
                  // });
                  if (!roomsRef) return;
                  window.scroll({
                    top: amenitiesRef.current.offsetTop - 150,
                    behavior: "smooth",
                  });

                  setActiveTab("amenities");
                }}
                className={
                  activeTab === "amenities" ? "border-b-2 border-black" : ""
                }
              >
                Amenities
              </button>
            </li>
            {/* <li>Rules</li> */}
            <li>
              <button
                onClick={() => {
                  // roomsRef.current?.scrollIntoView({
                  //   behavior: "smooth",
                  //   block: "start",
                  // });
                  if (!roomsRef) return;
                  window.scroll({
                    top: roomsRef.current.offsetTop - 150,
                    behavior: "smooth",
                  });

                  setActiveTab("rooms");
                }}
                className={
                  activeTab === "rooms" ? "border-b-2 border-black" : ""
                }
              >
                Rooms
              </button>
            </li>
          </ul>
        </div>

        <div className="flex justify-between gap-7 px-20 max-sm:p-10 max-sm:flex-col mt-7">
          <div className="w-11/12 flex flex-col gap-10">
            {/* /// GENERAL */}

            <div ref={generalRef} className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold">{hotelData?.name}</h1>
              <p className="text-stone-500">
                5-star Hotel &middot; {hotelData?.location}
              </p>

              <div className="flex items-center gap-2 ">
                <p className="bg-[#EBF8F4] rounded-md p-1 w-fit font-semibold">
                  <span className="text-[#0FA670]">
                    {hotelData?.rating?.toFixed(1)}
                  </span>
                </p>
                <p className="font-semibold border-b">600+ ratings</p>
              </div>

              <div className="flex gap-2 items-start pt-4">
                <MdOutlineFastfood size={22} />
                <div>
                  <p className="font-medium">Free breakfast on select plans </p>
                  <p className="text-stone-500 text-sm">
                    Some plans include free breakfast
                  </p>
                </div>
              </div>
            </div>

            {/* /// AMENITIES */}

            <div ref={amenitiesRef}>
              <p className="text-2xl font-semibold pb-4">Amenities</p>
              <div>
                {hotelData?.amenities?.map((amenity, index) => (
                  <p key={index} className="flex items-center gap-7 p-3">
                    <span>{amenityIcons(amenity)}</span> <span>{amenity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* /// PROPERTY RULES */}
            {/* <div>
            <p className="text-2xl font-semibold pb-4">Property Rules</p>
          </div> */}
          </div>

          {/* /// HOTEL IMAGE & SELECT ROOM BTN */}

          <div
            className="w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={imageRef}
          >
            <div className="relative">
              <div onClick={handleMovetoPrevImg}>
                <button className="absolute z-10 top-1/2 left-3 transform -translate-y-1/2 p-1 bg-slate-100 rounded-full left-button">
                  <FaAngleLeft size={24} />
                </button>
              </div>
              <img
                src={hotelData?.images?.at(imageIndex)}
                alt={hotelData?.name}
                className="h-96 max-sm:h-44 w-full object-cover rounded-lg"
              />
              <span className="absolute z-10 transform -translate-y-1/2 bottom-0 right-6 p-2  text-xs bg-slate-50 rounded-full px-2">
                {imageIndex + 1} / {hotelData?.images?.length}
              </span>

              <div onClick={handleMovetoNextImg}>
                <button className="absolute z-10 top-1/2 right-3 transform -translate-y-1/2 p-1 bg-slate-100 rounded-full right-button">
                  <FaAngleRight size={24} />
                </button>
              </div>
            </div>

            <div className="mt-7 border rounded-md  p-5 flex justify-between">
              <div className="flex gap-1 items-center">
                <p className="font-semibold text-2xl">
                  &#8377;{Math.trunc(hotelData?.avgCostPerNight)}
                </p>
                <p className="text-sm">&#43;</p>
                <p className="text-sm ">
                  &#8377;{Math.trunc(hotelData?.avgCostPerNight / 7.76)}
                </p>
                <p className="text-xs ">
                  <span>tax</span>{" "}
                  <span className="text-stone-500">/ night</span>
                </p>
              </div>
              <button
                onClick={() => {
                  // roomsRef.current?.scrollIntoView({
                  //   behavior: "smooth",
                  // });
                  if (!roomsRef) return;
                  window.scroll({
                    top: roomsRef.current.offsetTop - 150,
                    behavior: "smooth",
                  });
                  setActiveTab("rooms");
                }}
                className="bg-[#FF4F17] p-2 rounded-md text-sm text-white font-semibold"
              >
                Select Room
              </button>
            </div>
          </div>
        </div>

        {/* /// ROOMS AVAILABLE */}

        <div className="my-7 px-20 max-sm:p-10 ">
          <p id="rooms" ref={roomsRef} className="text-2xl font-semibold pb-4">
            Rooms Available
          </p>
          <div className="flex flex-wrap justify-evenly gap-10 mt-7">
            {hotelData?.rooms?.map((room) => (
              <RoomsAvialableCard
                key={room["_id"]}
                roomDetails={room}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RoomsAvialableCard({ roomDetails, onNavigate }) {
  // console.log(roomDetails?._id);

  return (
    <div className="border p-4 text-start rounded-md shadow-sm flex flex-col gap-3">
      <p className="text-xl font-medium">
        {roomDetails?.roomType} <span>Room</span>
      </p>
      <p className="text-stone-500 text-sm">
        {roomDetails?.roomSize?.toFixed(1)} sq.ft
      </p>
      <p className="flex items-center gap-2">
        <BiBed size={20} />
        {roomDetails?.bedDetail}
      </p>
      <p className="flex items-center gap-2">
        <MdOutlineFreeCancellation size={20} />
        {roomDetails?.cancellationPolicy}
      </p>
      <p>
        <span className="text-lg font-medium">
          &#8377; {roomDetails?.costPerNight}
        </span>
        <span className="text-stone-500"> / night</span>
      </p>
      <div className="pt-3">
        <button
          onClick={() => onNavigate(roomDetails?._id)}
          className="w-full bg-[#ff4f17] px-7 rounded-md py-2 font-semibold text-white"
        >
          Book
        </button>
      </div>
    </div>
  );
}
