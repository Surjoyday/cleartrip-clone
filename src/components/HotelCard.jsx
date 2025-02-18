import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function HotelCard({ hotelData }) {
  // console.log(hotelData);

  const { token } = useAuth();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hotelID = hotelData["_id"];
  const city = searchParams.get("city");
  const checkInDate = searchParams.get("chk_in");
  const checkOutDate = searchParams.get("chk_out");
  const guests = searchParams.get("guests");
  const rooms = searchParams.get("rooms");

  function handleNavigate() {
    if (token) {
      navigate(
        `/hotels/itinerary/${hotelID}?city=${city}&chk_in=${checkInDate}&chk_out=${checkOutDate}&guests=${guests}&rooms=${rooms}`
      );
    } else if (!token) {
      toast.warn("You must log in to continue");
    }
  }

  return (
    <div className="flex flex-col pb-7">
      <HotelImages imagesArr={hotelData?.images} alt={hotelData?.name} />

      <div onClick={handleNavigate} className="cursor-pointer">
        <div className="flex justify-between pt-1">
          <p className="font-semibold">{hotelData?.name}</p>
          <p className="bg-[#EBF8F4] rounded-sm p-1 font-semibold text-sm">
            <span className="text-[#0FA670]">
              {hotelData?.rating?.toFixed(1)}
            </span>
          </p>
        </div>

        <div className="text-stone-500 text-sm">
          <p>
            5-star hotel &middot;{" "}
            <span className="">
              {hotelData?.location ===
              "Delhi, National Capital Territory of Delhi"
                ? "Delhi"
                : hotelData?.location}
            </span>
          </p>
        </div>

        <div className="flex gap-1 items-center">
          <p className="font-semibold">
            &#8377;{Math.trunc(hotelData?.avgCostPerNight)}
          </p>
          <p className="text-xs">&#43;</p>
          <p className="text-xs ">
            &#8377;{Math.trunc(hotelData?.avgCostPerNight / 7.76)}
          </p>
          <p className="text-xs ">
            <span>tax</span> <span className="text-stone-500">/ night</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function HotelImages({ imagesArr, alt }) {
  const [imgIndex, setImgIndex] = useState(0);
  const imageRef = useRef(null);

  function handleMovetoNextImg() {
    setImgIndex((nextIndex) =>
      nextIndex < imagesArr.length - 1 ? nextIndex + 1 : 0
    );
  }

  function handleMovetoPrevImg() {
    setImgIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : imagesArr.length - 1
    );
  }

  function handleMouseEnter() {
    imageRef.current.querySelector(".left-button").classList.add("visible");
    imageRef.current.querySelector(".right-button").classList.add("visible");
  }

  function handleMouseLeave() {
    imageRef.current.querySelector(".left-button").classList.remove("visible");
    imageRef.current.querySelector(".right-button").classList.remove("visible");
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={imageRef}
    >
      <div onClick={handleMovetoPrevImg}>
        <button className="absolute z-10 top-1/2 left-3 transform -translate-y-1/2 p-1 bg-slate-200 rounded-full left-button">
          <FaAngleLeft size={24} />
        </button>
      </div>
      <LazyLoadImage
        effect="blur"
        className="w-[300px] h-[250px] object-cover rounded-md contrast-[.8] transition-all ease-in"
        src={imagesArr[imgIndex]}
        alt={alt}
      />

      <button
        onClick={handleMovetoNextImg}
        className="absolute z-10 top-1/2 right-3 transform -translate-y-1/2 p-1 bg-slate-200 rounded-full right-button"
      >
        <FaAngleRight size={24} />
      </button>
    </div>
  );
}
