import { useLocation, useNavigate } from "react-router-dom";
import {
  appOfferImage,
  getCurrentDate,
  getDayOfWeek,
  getTommorrowsDate,
  popularDestinationsImages,
} from "../assets/helper";
import { useState } from "react";

// navigate(
//   `/flights/results?from=${fromInput}&to=${toInput}&depart_date=${dateInput}&day=${day}&travel_class=${travelClass}&seats=${seats}`,
//   { state: { origin, destination, seats, dateInput } }
// );

export default function AboutSite() {
  const location = useLocation();

  const navigate = useNavigate();

  function handleNavigate(cityCode, city, country) {
    if (location.pathname === "/flights") {
      navigate(
        `/flights/results?from=${"GAU"}&to=${cityCode}&depart_date=${getCurrentDate()}&day=${getDayOfWeek(
          new Date(getCurrentDate())
        )}&travel_class=${"Economy"}&seats=${1}`,
        {
          state: {
            origin: { cityCode: "GAU", city: "Gauwahati", country: "India" },
            destination: { cityCode, city, country },
            tarvellers: { adults: 1, children: 0, infants: 0 },
            dateInput: getCurrentDate(),
          },
        }
      );
    } else if (location.pathname === "/hotels") {
      const checkIn = getCurrentDate(new Date());
      const checkOut = getTommorrowsDate(new Date());
      const guests = [{ adults: 1, children: 0 }];
      navigate(
        `/hotels/results?city=${city}&chk_in=${checkIn}&chk_out=${checkOut}&guests=${JSON.stringify(
          guests
        )}&rooms=${1}`
      );
    }
  }

  // console.log(location.pathname);

  return (
    <aside className={`${location.pathname === "/offers" && "hidden"} `}>
      <div className="popular-destinations mt-7 mb-20">
        <h2 className="text-2xl w-fit font-semibold max-sm:text-xl border-l-4 border-[#FF4F17] pl-2">
          Popular destinations
        </h2>
        <div className="flex gap-5 flex-wrap max-sm:text-sm max-sm:justify-center mt-10">
          {popularDestinationsImages?.map((destinationsCard) => (
            <div
              key={destinationsCard?.id}
              className="destination-cards relative text-white "
              onClick={() =>
                handleNavigate(
                  destinationsCard.cityCode,
                  destinationsCard.city,
                  destinationsCard.country
                )
              }
            >
              <h1 className="absolute bottom-8 left-4 font-bold">
                {destinationsCard?.place}
              </h1>
              <p className="absolute bottom-2 left-4 font-bold">
                {destinationsCard.properties}
              </p>
              <img
                className="rounded hover:contrast-125  cursor-pointer max-sm:w-[130px] max-sm:h-[130px] h-[176px] max-w-[176px]"
                src={destinationsCard?.src}
                alt={destinationsCard?.alt}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="app-offer-image my-10 max-sm:hidden max-w-fit cursor-pointer">
        <img src={appOfferImage?.src} alt={appOfferImage?.alt} />
      </div>

      {location.pathname === "/flights" && <AboutFlight />}
      {location.pathname === "/hotels" && <AboutHotels />}
    </aside>
  );
}

function AboutFlight() {
  return (
    <div className="text-justify p-2  mb-8  text-sm max-sm:text-xs max-sm:p-4">
      <div className="cleartrip-flight-info ">
        <h3 className=" font-bold text-base py-3">Why Cleartrip?</h3>
        <p>
          It is no longer an uphill battle to get the lowest airfare and book
          tickets online. Cleartrip is all about making travel &nbsp;
          <span className="font-bold ">easy, affordable</span>
          &nbsp;and <span className="font-semibold">simple.</span> From
          <span className="font-semibold">international</span> flights to
          <span className="font-semibold">domestic</span> flights; from early
          morning flights to late night flights, from cheap flights to luxurious
          ones. Cleartrip helps you complete your flight booking in just a few
          clicks. Your online flight booking experience is seamless with our
          features like:
        </p>
        <div className="pt-3">
          <span className="font-semibold">ClearChoice Max:</span>
          &nbsp;
          <span>
            Free cancellation or rescheduling for domestic (up to 24 hrs before
            departure) &amp; international flights (up to 72 hrs before
            departure).
          </span>
        </div>
        <div className="pt-3">
          <span className="font-semibold">ClearChoice Plus:</span>
          &nbsp;
          <span>
            Free date change or airline change up to 12 hrs (up to 24 hours for
            Air India*&amp; Vistara*) before departure.
          </span>
        </div>
        <div className="pt-3">
          <span className="font-semibold">Medi-cancel refund:</span>
          &nbsp;
          <span>
            Cancel your domestic flight booking easily on valid medical grounds
            and get up to ₹3500 against airline cancellation charges per
            passenger per segment.
          </span>
        </div>
        <div className="pt-3">
          <span className="font-semibold">International travel insurance:</span>
          &nbsp;
          <span>
            Get stress-free coverage against a vast range of uncertainties for
            all international destinations at only ₹89 per user per day.
          </span>
        </div>
        <p>
          And with our
          <span className="font-semibold">
            round-the-clock customer service,
          </span>
          we ensure no queries or concerns regarding your flight tickets are
          left unresolved.
        </p>
      </div>
      <div className="pt-8">
        <h3 className="pb-4 font-bold text-base">
          How to search and book cheap flights on Cleartrip?
        </h3>
        <p>
          Looking for flights and booking flight tickets is simple and seamless
          on Cleartrip.
        </p>
        <ul className="px-6 pt-2">
          <li className="pt-1">
            <p>Enter source and destination city/airport</p>
          </li>
          <li className="pt-1">
            <p>Select the date of travel</p>
          </li>
          <li className="pt-1">
            <p>Choose the number of travellers</p>
          </li>
        </ul>
        <div className="m-0 mt-0 mb-0 ml-0 mr-0 mx-0 my-0 pt-4"></div>
        <p>
          Hit enter and there you go! You have a search list of all the flights
          available, sorted according to price. You can further filter your
          search by choosing preferences and filters like time, duration, number
          of stops, and by airlines or even look for other dates simply by
          clicking on the calendar on the right side of the page.
        </p>
      </div>
      <div className="pt-8">
        <h3 className="pb-4 font-bold text-base">
          How to make flexible flight bookings with changeable dates?
        </h3>
        <p>
          While making your flight booking, make sure to select the ‘ClearChoice
          Plus’ or ‘ClearChoice Max’ option before you confirm the air ticket.
          At a minimal cost, this allows you to modify your flight booking dates
          and airlines. So in case of any change in plans, Cleartrip has got you
          covered!
        </p>
      </div>
      <div className="pt-8">
        <h3 className="pb-4 font-bold text-base">
          How to cancel flights online on Cleartrip?
        </h3>
        <p>
          In case you wish to cancel your booking due to any reason, simply -
        </p>
        <ul className="px-6 pt-2">
          <li className="pt-1">
            <p>Select the trip you want to cancel</p>
          </li>
          <li className="pt-1">
            <p>Click on the “Cancellations” link</p>
          </li>
          <li className="pt-1">
            <p>
              Select the passengers to cancel the booking for. Then hit “Review
              cancellation”
            </p>
          </li>
          <li className="pt-1">
            <p>Review passenger selection and refund amount</p>
          </li>
          <li className="pt-1">
            <p>Click on “Yes, cancel now”</p>
          </li>
        </ul>
        <div className="m-0 mt-0 mb-0 ml-0 mr-0 mx-0 my-0 pt-4"></div>
        <p>
          That’s it – you’re done! Sit back and wait for your refund that’s
          guaranteed to be processed within 24 hours.
        </p>
        <p>
          While making your flight booking, select the ‘ClearChoice Max’ option
          before you confirm the air ticket, to cancel flight bookings without
          having to pay hefty cancellation charges!
        </p>
      </div>
      <div className="pt-8">
        <h3 className="pb-4 font-bold text-base">
          What are the benefits of booking flights online with Cleartrip?
        </h3>
        <p>
          Get the best flight fares with exciting flight offers on your air
          ticket when you book with Cleartrip. Unmissable sales and deals like
          Travel Max Sale, Big Travel Sale, Cleartrip Tatkaal, etc. offer
          never-seen-before discounts that help you book flights at affordable
          rates. Best flight discounts await you when you book with bank cards
          like ICICI, Bank of Baroda, HDFC, Axis, Kotak etc.
        </p>
      </div>
      <div className="m-0 mt-0 mb-0 ml-0 mr-0 mx-0 my-0 pt-8"></div>
      <h3 className="font-bold text-base">What’s more?</h3>
      <p>
        Flight ticket booking or planning your travel is made simpler with our
        round trip and multicity options. When you hit enter, your search list
        page shows the results for both onward and return in a split screen
        format letting you choose flights in one go for a round trip. The
        multicity search page shows a list of complete itineraries that removes
        the hassle of you calculating time, transfers and layovers letting you
        finish your online flight booking. To ensure you get the best price we
        highlight offers, sales and other promotions on the checkout page. Post
        booking, our portal allows for easy cancellations or amendments without
        having to make calls to the airlines.
      </p>
    </div>
  );
}

function AboutHotels() {
  return (
    <div className="grid grid-cols-1 gap-y-8 text-justify mb-8  text-sm max-sm:text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        <div className="p-4 bg-white rounded-lg">
          <p className="text-neutral-900 text-xl font-semibold">
            Why book hotels online on Cleartrip?
          </p>
          <p className="text-neutral-700 text-base mt-4">
            Looking for online hotel booking sites? Your search ends here. From
            guest houses to resorts, from budget-friendly to luxury, whether for
            business or for leisure, Cleartrip is your go-to hotel booking app.
            Our curated, verified list of 400000+ hotels across 28000+ cities
            from around the globe ensures you have enough options to choose from
            and complete your online hotel booking at ease. Find a list of hotel
            chains such as oyo rooms, fabhotels, treebo hotels, etc.
          </p>
          <p className="text-neutral-700 text-base mt-4">
            With an array of filters and sorting options, you can simplify the
            search for your hotel room booking. It shows all the details of your
            preferred hotel, like description, highlights, photos, amenities,
            room types, rates all in one place. Additional features like
            pay-at-hotel, express checkout and free cancellations make the
            process of booking a hotel effortless.
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <p className="text-neutral-900 text-xl font-semibold">
            How to find and book hotels online on Cleartrip?
          </p>
          <p className="text-neutral-700 text-base mt-4">
            With Cleartrip, booking a hotel online doesn't get simpler.
          </p>
          <ul className="px-6 pt-2 list-disc list-inside">
            <li className="text-neutral-700 text-base">
              Click on the 'hotels' tab on the homepage
            </li>
            <li className="text-neutral-700 text-base">
              Type in the city/ locality/ landmark/ hotel name in the search bar
            </li>
            <li className="text-neutral-700 text-base">
              Fill in the check-in and check-out dates
            </li>
            <li className="text-neutral-700 text-base">
              Choose the number of travellers and hit enter
            </li>
          </ul>
          <p className="text-neutral-700 text-base mt-4">
            There you go! You can further narrow down your hotel booking search
            list by using filters like price, star rating, traveller rating,
            amenities and even preferences like hill-view or couple friendly
            hotels. For every kind of stay, Cleartrip has a hotel.
          </p>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg">
        <p className="text-neutral-900 text-xl font-semibold">
          How to Search for cheap hotels on Cleartrip?
        </p>
        <p className="text-neutral-700 text-base mt-4">
          Cleartrip offers never-seen-before discounts on hotels, making your
          luxurious stay pocket-friendly.
        </p>
        <ul className="px-6 pt-2 list-disc list-inside">
          <li className="text-neutral-700 text-base">
            Once you search for your preferred location or city, you can use an
            array of filters to refine your search.
          </li>
          <li className="text-neutral-700 text-base">
            Enter the price range for your hotel room booking and get options
            accordingly.
          </li>
          <li className="text-neutral-700 text-base">
            Compare, choose and complete your hotel booking by clicking on the
            'Book Now' button.
          </li>
        </ul>
        <p className="text-neutral-700 text-base mt-4">
          So go ahead and book that long-awaited staycation, friends' trip,
          family holiday, or just a much-needed weekend getaway! Cleartrip has
          got you covered.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-y-4 gap-x-8">
        <div className="p-4 bg-white rounded-lg">
          <p className="text-neutral-900 text-xl font-semibold">
            What are the benefits of booking hotels on Cleartrip?
          </p>
          <p className="text-neutral-700 text-base mt-4">
            Booking hotels online with Cleartrip is as seamless as it can get.
          </p>
          <ul className="px-6 pt-2 list-disc list-inside">
            <li className="text-neutral-700 text-base">
              Diverse range of hotels - from pocket-friendly to luxury
            </li>
            <li className="text-neutral-700 text-base">
              Best offers using bank cards like Axis, ICICI, Kotak, Slice, Bank
              of Baroda, CITI, Federal, etc.
            </li>
            <li className="text-neutral-700 text-base">
              Wallet cashbacks on Paytm and Mobikwik
            </li>
            <li className="text-neutral-700 text-base">
              Exciting deals and discounts throughout the year
            </li>
            <li className="text-neutral-700 text-base">
              Cancellation policies in case of last minute changes
            </li>
            <li className="text-neutral-700 text-base">
              Upgrades on your stay
            </li>
            <li className="text-neutral-700 text-base">EMI options</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
