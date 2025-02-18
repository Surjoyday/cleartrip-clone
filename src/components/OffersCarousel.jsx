import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { HEADERS, base_URL, moreOffers } from "../assets/helper";
import Loader from "./Loader";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaLessThan, FaGreaterThan } from "react-icons/fa6";

const carouselSettings = {
  // dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  // arrows: false,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

const carouselSettingsForMoreOffers = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  pauseOnHover: true,
};

function PrevArrow({ onClick }) {
  return (
    <div
      className="next-arrow absolute bottom-2 left-4 transform -translate-y-1/2  z-10 cursor-pointer text-[white]"
      onClick={onClick}
    >
      <FaLessThan size={15} className="cursor:pointer" />
    </div>
  );
}

function NextArrow({ onClick }) {
  return (
    <div
      className="next-arrow absolute bottom-2 right-4 transform -translate-y-1/2  z-10 cursor-pointer text-[white]"
      onClick={onClick}
    >
      <FaGreaterThan size={15} className="cursor:pointer" />
    </div>
  );
}

export default function OffersCarousel() {
  const [flightOffers, setFlightOffers] = useState([]);
  const [hotelOffers, setHotelOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  // console.log(location.pathname);

  useEffect(
    function () {
      getOffers();
    },
    [location.pathname]
  );

  // GETTING THE OFFERS BASED ON PAGE
  async function getOffers() {
    if (
      (location.pathname === "/flights" && flightOffers.length > 0) ||
      (location.pathname === "/hotels" && hotelOffers.length > 0)
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const extractedOfferType = location.pathname.slice(1).toUpperCase();
      const res = await fetch(
        `${base_URL}/offers?limit=5&filter={"type":"${extractedOfferType}"}`,
        {
          method: "GET",
          headers: HEADERS,
        }
      );

      if (!res.ok) throw new Error("Client Side Error of Carousel Data");

      const resData = await res.json();

      const offers = resData?.data?.offers;

      if (location.pathname === "/flights") setFlightOffers(offers);
      if (location.pathname === "/hotels") setHotelOffers(offers);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <div className="flex flex-col gap-12 max-sm:items-center mb-5 p-4">
          <div className="card border-stone-400  w-[250px] max-h-max overflow-x-hidden rounded-xl overflow-y-hidden">
            <Slider {...carouselSettings}>
              {location.pathname === "/flights"
                ? flightOffers?.map((offers) => (
                    <div key={offers._id} className="relative">
                      <img
                        src={offers.newHeroUrl}
                        alt={`${offers.type}-img`}
                        className="w-full h-full  object-contain  rounded-xl contrast-[.70]"
                      />
                      <p className="absolute top-0 bottom-10 w-full h-full p-4 font-semibold flex flex-col">
                        <span className="text-white">{offers.pTl}</span>
                        <span className="text-white text-xs pt-2">
                          {offers.pTx}
                        </span>
                        <span className="text-white pt-8">
                          {offers.offerPersuasion} <span> &rarr;</span>
                        </span>
                      </p>
                    </div>
                  ))
                : location.pathname === "/hotels"
                ? hotelOffers?.map((offers) => (
                    <div key={offers._id} className="relative ">
                      <img
                        src={offers.newHeroUrl}
                        alt={`${offers.type}-img`}
                        className="w-full h-full  object-contain  rounded-xl contrast-[.70]"
                      />
                      <p className="absolute top-0 bottom-10 w-full h-full p-4 font-semibold flex flex-col">
                        <span className="text-white">{offers.pTl}</span>
                        <span className="text-white text-xs pt-2">
                          {offers.pTx}
                        </span>
                        <span className="text-white pt-8">
                          {offers.offerPersuasion} <span> &rarr;</span>
                        </span>
                      </p>
                    </div>
                  ))
                : null}
            </Slider>
          </div>

          <div className="max-sm:none flex flex-col">
            <h1 className="text-xl font-semibold mb-2">More Offers</h1>
            <div className="w-[250px] h-[145px] border border-grey-400 rounded-xl ">
              <Slider {...carouselSettingsForMoreOffers}>
                {moreOffers?.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-4 pb-2 mt-2 mb-3 h-[120px] flex flex-col"
                  >
                    <h3 className="font-bold">{offer.title}</h3>
                    <p className="mt-4 mb-2">{offer.para}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
