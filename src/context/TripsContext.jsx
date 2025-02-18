import { createContext, useContext, useState } from "react";
import { base_URL, HEADERS } from "../assets/helper";
import { useAuth } from "./AuthContext";

const TripContext = createContext();

function TripProvider({ children }) {
  const [allBookingDeatils, setAllBookingDetails] = useState([]);
  const [flightsBooked, setFlightsBooked] = useState([]);
  const [hotelsBooked, setHotelsBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useAuth();

  /// FUNCTION TO GET BOOKING DETAILS
  async function getBookingDetails() {
    setIsLoading(true);
    try {
      const res = await fetch(`${base_URL}/booking`, {
        method: "GET",
        headers: { ...HEADERS, Authorization: `Bearer ${token}` },
      });

      const resData = await res.json();

      if (resData.status === "fail") throw new Error(resData?.message);

      if (resData.status === "success") {
        /// GETTING ALL BOOKINGS HOTEL AND FLIGHTS
        const detailsOfAllBookings = resData?.data;

        /// FILTERING FLIGHTS BOOKED DATA
        const flights = resData?.data?.filter(
          (type) => type["booking_type"] === "flight"
        );

        /// FILTERING HOTELS BOOKED DATA
        const hotels = resData?.data?.filter((type) => type["booking_type"] === "hotel");

        setAllBookingDetails(detailsOfAllBookings);
        setFlightsBooked(flights);
        setHotelsBooked(hotels);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  // console.log("flights", flightsBooked);
  // console.log("hotels", hotelsBooked);

  // console.log(hotelsBooked);

  return (
    <TripContext.Provider
      value={{
        isLoading,
        flightsBooked,
        hotelsBooked,
        allBookingDeatils,
        getBookingDetails,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) throw new Error("TripContext used outside TripProvider");

  return context;
}

export { TripProvider, useTrip };
