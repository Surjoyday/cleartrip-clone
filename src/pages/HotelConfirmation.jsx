import { useEffect, useRef, useState } from "react";
import { PiNumberCircleOne, PiNumberCircleTwo } from "react-icons/pi";

import { GoCheckCircle } from "react-icons/go";

import { HiOutlineCurrencyRupee } from "react-icons/hi";

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  HEADERS,
  base_URL,
  calcTotalNights,
  formatDateTimeISOString,
  formatDates,
  getDayOfWeek,
} from "../assets/helper";
import { Modal, TextField } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function HotelConfirmation() {
  const { name, token } = useAuth();
  const firstNameFromAuth = name?.split(" ")?.at(0) || "";
  const lastNameFromAuth = name?.split(" ")?.at(1) || "";
  const [roomSelected, setRoomSelected] = useState({});
  const [isModalOpen, setIsModalOpen] = useState({
    paymetModal: false,
    paymentSuccessModal: false,
    detailsModal: false,
  });
  const [addressingTitles, setAddressingTitles] = useState("");
  const [bookedForDetails, setBookedForDetails] = useState({
    firstName: firstNameFromAuth || "",
    lastName: lastNameFromAuth || "",
    mobileNumber: "",
    emailAddress: "",
  });
  const [isError, setIsError] = useState({
    firstNameError: "",
    lastNameError: "",
    mobileNumberError: "",
    emailAddressError: "",
    addressingTitlesError: "",
  });
  const [bookingID, setBookingID] = useState("");
  const [countDownValue, setCountDownValue] = useState(8);
  const timeOutIDRef = useRef(null);
  const countDownTimer = useRef(null);
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // console.log(addressingTitles);

  // console.log(location.state);
  // console.log(bookedForDetails.firstName);
  // console.log(bookedForDetails.lastName);
  // console.log(bookedForDetails.mobileNumber);
  // console.log(bookedForDetails.emailAddress);

  const selectedRoomId = params.selectedRoomID;
  const hotelData = location.state.hotelData;
  const hotelID = hotelData?._id;
  const checkInDate = searchParams.get("chk_in");
  const checkOutDate = searchParams.get("chk_out");
  const guests = searchParams.get("guests");
  const rooms = searchParams.get("rooms");

  // console.log(JSON.parse(guests));

  const totalGuest = JSON.parse(guests).reduce(
    (acc, curr) => acc + curr.adults + curr.children,
    0
  );

  const childrenCount = JSON.parse(guests).reduce(
    (acc, curr) => acc + curr.children,
    0
  );

  const adultCount = JSON.parse(guests).reduce(
    (acc, curr) => acc + curr.adults,
    0
  );
  // console.log(totalGuest);

  // console.log(roomSelected);
  // console.log(hotelData);
  // console.log(hotelID);

  /// HANDLE OPEN PAYMENT MODAL

  function handleOpenPaymentModal() {
    setIsModalOpen((modal) => ({ ...modal, paymetModal: true }));
  }

  /// HANDLE CLOSE PAYMENT MODAL

  function handleClosePaymentModal() {
    setIsModalOpen((modal) => ({ ...modal, paymetModal: false }));
  }

  /// COUNT-DOWN FUNCTION

  function startCountDown() {
    countDownTimer.current = setInterval(() => {
      setCountDownValue((value) => value - 1);
    }, 1000);
  }

  /// HANDLE OPEN SUCESSFULL PAYMENT MODAL
  function handleOpenSuccessfullPayemntModal() {
    setIsModalOpen((modal) => ({ ...modal, paymentSuccessModal: true }));
    startCountDown();
  }

  /// HANDLE CLOSE SUCESSFULL PAYMENT MODAL and clearing setTimeout and setInterval

  function handleCloseSuccessfullPayemntModal() {
    setIsModalOpen((modal) => ({ ...modal, paymentSuccessModal: false }));
    clearTimeout(timeOutIDRef.current);
    clearInterval(countDownTimer.current);
  }

  /// HANDLE CLOSE DETAILS MODAL

  function handleCloseDetailsModal() {
    setIsModalOpen((modal) => ({ ...modal, detailsModal: false }));
  }

  /// HANDLE OPEN DETAILS MODAL

  function handleOpenDetailsModal() {
    setIsModalOpen((modal) => ({ ...modal, detailsModal: true }));
  }

  /// NAVIGATE TO MY TRIPS BY CLICK

  function handleNaviagte() {
    navigate("/mytrips/mytripshotels", { replace: true });
  }

  /// FUNCTION HANDLING ALL INPUTS OF DETAILS
  function handleBookedFor(e, detailType) {
    const value = e.target.value;
    setBookedForDetails((prevDetails) => ({
      ...prevDetails,
      [detailType]: value,
    }));
    setIsError((err) => ({ ...err, [`${detailType}Error`]: "" }));
  }

  /// HANDLE CONFIRM BOOKING AND SHOW SUCCESS MODAL

  function handlePaymentSuccessModal() {
    const payload = JSON.stringify({
      bookingType: "hotel",
      bookingDetails: {
        hotelId: hotelID,
        startDate: formatDateTimeISOString(checkInDate),
        endDate: formatDateTimeISOString(checkOutDate),
      },
    });
    async function confirmBooking() {
      try {
        const res = await fetch(`${base_URL}/booking`, {
          method: "POST",
          headers: { ...HEADERS, Authorization: `Bearer ${token}` },
          body: payload,
        });

        const resData = await res.json();

        // console.log(resData);
        if (resData?.status === "success") {
          const bookedID = resData?.booking?._id;
          setBookingID(bookedID);
          /// CLOSE PAYMENT MODAL AND OPEN SUCCESSFUL PAYMENT MODAL
          handleOpenSuccessfullPayemntModal();
        }
        if (resData?.status === "error")
          throw new Error(`${resData?.message} please re-try`);
      } catch (err) {
        toast.error(err);
        console.log(err);
      } finally {
        setIsModalOpen((modal) => ({ ...modal, paymetModal: false }));
      }
    }

    confirmBooking();
  }

  /// FUNCTION HANDLING FORM VALODATION OF ALL INPUTS FIELDS AND CONFIRM BOOKING
  function handleContinueToPayment() {
    const error = {};

    if (bookedForDetails.firstName === "") {
      error.firstNameError = "First name is mandatory";
    }
    if (bookedForDetails.lastName === "") {
      error.lastNameError = "Last name is mandatory";
    }
    if (
      bookedForDetails.mobileNumber.length === 0 ||
      bookedForDetails.mobileNumber < 10
    ) {
      error.mobileNumberError =
        bookedForDetails.mobileNumber.length === 0
          ? "Mobile number is mandatory"
          : "Please enter a valid phone number";
    }
    if (
      !bookedForDetails.emailAddress.includes("@") ||
      !bookedForDetails.emailAddress.includes(".com") ||
      bookedForDetails.length === 0
    ) {
      error.emailAddressError =
        bookedForDetails.emailAddress.length === 0
          ? "Email is mandatory"
          : "Please enter a valid email address";
    }
    if (!addressingTitles) {
      error.addressingTitlesError = "Title is mandatory";
    }

    setIsError((err) => ({ ...err, ...error }));

    const hasNoErrors = Object.values(error).every((error) => error === "");

    if (hasNoErrors) {
      handleOpenPaymentModal();
    }
  }

  useEffect(function () {
    const roomDetails = hotelData?.rooms?.filter(
      (room) => room?._id === selectedRoomId
    );
    setRoomSelected(...roomDetails);
  }, []);

  /// EFFECT TO CLEAR setTimout and setInterval on UNMOUNT

  useEffect(function () {
    return () => {
      clearTimeout(timeOutIDRef.current);
      clearInterval(countDownTimer.current);
    };
  }, []);

  /// REDIRECT TO MY TRIPS WHEN COUNDOWN REACHES 0

  useEffect(
    function () {
      if (countDownValue === 0) {
        navigate("/mytrips/mytripshotels", { replace: true });
      }
    },
    [countDownValue, navigate]
  );

  return (
    <>
      <div className="flex gap-10 mt-10 mb-10 max-sm:flex-col px-14 max-sm:p-5">
        <div className="flex flex-col w-8/12 gap-10 max-sm:w-full">
          {/* /// 1) Review your itinerary */}
          <div className="flex items-center gap-3">
            <PiNumberCircleOne size={30} />
            <p className="text-xl font-semibold">Review your itinerary</p>
          </div>

          {/* /// BOOKED HOTEL DETAILS CARD */}
          <div className="border border-b-0 rounded-lg shadow-sm border-t-1 border-l-1 border-r-1">
            {/* /// HOTEL IMAGE AND NAME DETALS */}
            <div className="flex justify-between p-6 max-sm:items-center">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-stone-500">
                  5-star hotel in {hotelData?.location}
                </p>
                <p className="text-4xl max-sm:text-2xl">{hotelData?.name}</p>
              </div>

              <img
                src={hotelData?.images?.at(0)}
                alt={hotelData?.name}
                className="w-24 h-24 rounded-lg max-sm:h-20 max-sm:w-20"
              />
            </div>

            {/* /// Half-Circles Styles */}
            <div className="flex justify-between circle__parent">
              <div className="left__circle"></div>
              <hr className="w-11/12 my-1 border-b border-dashed" />
              <div className="right__circle"></div>
            </div>

            {/* /// Check-in Check-out details */}
            <div className="flex items-center justify-around p-4 mt-2 max-sm:text-xs">
              <div>
                <p className="text-sm font-semibold text-stone-500">Check-in</p>
                <p className="text-lg font-semibold">
                  {new Date(checkInDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "2-digit",
                  })}
                </p>
                <p className="text-sm font-semibold text-stone-500">
                  <span>{getDayOfWeek(new Date(checkInDate))},</span>{" "}
                  <span>12 PM</span>
                </p>
              </div>

              <div className="relative flex gap-1 px-4 py-1 text-xs rounded-md bg-stone-200 text-stone-500">
                <p>
                  {calcTotalNights(
                    new Date(checkInDate),
                    new Date(checkOutDate)
                  )}
                </p>
                <p>
                  {calcTotalNights(
                    new Date(checkInDate),
                    new Date(checkOutDate)
                  ) === 1
                    ? " night"
                    : " nights"}
                </p>
              </div>

              <div className="border-r px-7">
                <p className="text-sm font-semibold text-stone-500">
                  Check-out
                </p>
                <p className="text-lg font-semibold">
                  {new Date(checkOutDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "2-digit",
                  })}
                </p>
                <p className="text-sm font-semibold text-stone-500">
                  <span>{getDayOfWeek(new Date(checkOutDate))},</span>{" "}
                  <span>11 AM</span>
                </p>
              </div>

              <div className="flex flex-col gap-2 max-sm:ml-2">
                <p className="text-sm font-medium text-stone-500">
                  Rooms & Guests
                </p>
                <div className="flex items-center justify-center gap-4 max-sm:flex-col">
                  <div className="font-semibold">
                    <span>
                      {rooms} {+rooms === 1 ? " Room," : " Rooms,"}
                    </span>
                    <span>
                      {totalGuest} {+totalGuest === 1 ? " Guest" : " Guests"}
                    </span>
                  </div>
                  <p
                    className="text-sm text-[#0E6AFF] cursor-pointer max-sm:self-start"
                    onClick={handleOpenDetailsModal}
                  >
                    Details
                  </p>
                  <Modal
                    open={isModalOpen.detailsModal}
                    onClose={handleCloseDetailsModal}
                    aria-labelledby="payment-modal"
                    aria-describedby="modal-for-payment"
                  >
                    <div className="absolute flex flex-col gap-5 transform -translate-x-1/2 -translate-y-1/2 outline-none top-1/2 left-1/2">
                      <div
                        className="bg-white px-2.5 py-1 rounded-[50%] cursor-pointer self-end"
                        onClick={handleCloseDetailsModal}
                      >
                        &#10005;
                      </div>

                      <div className="p-10 bg-white rounded-lg shadow-lg">
                        <p className="text-2xl font-medium">
                          Guest information
                        </p>

                        <div className="flex items-center gap-10 pt-10 max-sm:text-sm whitespace-nowrap">
                          <p className="text-xl font-semibold">Room {rooms}</p>

                          <p>
                            {adultCount} Adult{adultCount > 1 ? "s" : ""}
                          </p>

                          {childrenCount > 0 && (
                            <p>
                              {childrenCount} Children
                              {childrenCount > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
                <p className="text-xs text-stone-500">
                  {/* {adultCount} {+adultCount === 1 ? " Adult" : " Adults"} */}
                  <span>
                    {adultCount} Adult{adultCount > 1 ? "s" : ""}
                  </span>
                  {childrenCount > 0 && (
                    <span>
                      , {childrenCount} Children{childrenCount > 1 ? "s" : ""}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* /// 2) Guest Details SECTION */}
          <div className="flex items-center gap-3">
            <PiNumberCircleTwo size={30} />
            <p className="text-xl font-semibold">Guest Details</p>
          </div>

          {/* /// ADDRESSING TITLE */}
          <div>
            <div className="flex gap-7">
              <p
                onClick={() => {
                  setAddressingTitles("Mr.");
                  setIsError((err) => ({ ...err, addressingTitlesError: "" }));
                }}
                className={`px-4 py-1 font-semibold cursor-pointer border rounded-3xl  ${
                  addressingTitles === "Mr." ? "bg-stone-200 border-black" : ""
                } `}
              >
                Mr.
              </p>
              <p
                onClick={() => {
                  setAddressingTitles("Mrs.");
                  setIsError((err) => ({ ...err, addressingTitlesError: "" }));
                }}
                className={`px-4 py-1 font-semibold cursor-pointer border rounded-3xl  ${
                  addressingTitles === "Mrs." ? "bg-stone-200 border-black" : ""
                } `}
              >
                Mrs.
              </p>
              <p
                onClick={() => {
                  setAddressingTitles("Ms.");
                  setIsError((err) => ({ ...err, addressingTitlesError: "" }));
                }}
                className={`px-4 py-1 font-semibold cursor-pointer border rounded-3xl  ${
                  addressingTitles === "Ms." ? "bg-stone-200 border-black" : ""
                } `}
              >
                Ms.
              </p>
            </div>
            {isError.addressingTitlesError !== "" && (
              <p className="pl-3 py-3 text-[#C83232] text-xs">
                {isError.addressingTitlesError}
              </p>
            )}
          </div>

          {/* /// FIRST & LAST NAME */}
          <div className="flex gap-10">
            <TextField
              fullWidth
              className=""
              placeholder="First Name"
              variant="outlined"
              value={bookedForDetails.firstName}
              onChange={(e) => handleBookedFor(e, "firstName")}
              error={isError.firstNameError !== ""}
              helperText={isError.firstNameError ? isError.firstNameError : ""}
            />
            <TextField
              fullWidth
              className=""
              placeholder="Last Name"
              variant="outlined"
              value={bookedForDetails.lastName}
              onChange={(e) => handleBookedFor(e, "lastName")}
              error={isError.lastNameError !== ""}
              helperText={isError.lastNameError ? isError.lastNameError : ""}
            />
          </div>

          {/* /// MOBILE & EMAIL */}
          <div>
            <p className="text-stone-500 pb-7">
              Booking details will be sent to this number and email address
            </p>
            <div className="flex gap-10">
              <TextField
                fullWidth
                className=""
                placeholder="Mobile number"
                variant="outlined"
                value={bookedForDetails.mobileNumber}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value))
                    handleBookedFor(e, "mobileNumber");
                }}
                inputProps={{
                  maxLength: 10,
                }}
                error={isError.mobileNumberError !== ""}
                helperText={
                  isError.mobileNumberError ? isError.mobileNumberError : ""
                }
              />
              <TextField
                fullWidth
                className=""
                placeholder="Email address"
                variant="outlined"
                value={bookedForDetails.emailAddress}
                onChange={(e) => handleBookedFor(e, "emailAddress")}
                error={isError.emailAddressError !== ""}
                helperText={
                  isError.emailAddressError ? isError.emailAddressError : ""
                }
              />
            </div>
          </div>
          <button
            onClick={handleContinueToPayment}
            className="text-start bg-[#FF4F17] hover:bg-[#CE4501] w-fit p-2 rounded-md text-white"
          >
            Continue to payment
          </button>
        </div>

        {/* /// Price breakup */}
        <div className="sticky z-10 w-3/12 border h-fit max-sm:w-full rounded-2xl top-24 ">
          <div className="p-4">
            <div className="flex flex-col gap-6">
              <p className="text-xl font-semibold">Price breakup</p>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <p>
                    <span>
                      {rooms} {+rooms === 1 ? "room" : "rooms"}
                    </span>
                    <span>
                      <span> x </span>
                      <span>
                        {calcTotalNights(
                          new Date(checkInDate),
                          new Date(checkOutDate)
                        )}
                      </span>
                      <span>
                        {calcTotalNights(
                          new Date(checkInDate),
                          new Date(checkOutDate)
                        ) === 1
                          ? " night"
                          : " nights"}
                      </span>
                    </span>
                  </p>
                  <p className="font-medium">
                    &#8377;{roomSelected?.costPerNight}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <p>Hotel taxes</p>
                  <p className="font-medium">
                    &#8377;{roomSelected?.costDetails?.taxesAndFees}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <p>Property discount</p>
                  <p className="font-medium text-[#0FA670]">
                    &minus; &#8377;{roomSelected?.costDetails?.discount}
                  </p>
                </div>
              </div>
            </div>
            <hr className="mt-3 border-dashed border-1 border-stone-300" />
          </div>

          {/* /// TOTAL PRICE */}
          <div className="flex justify-between px-4 pb-3 m">
            <div>
              <p className="text-sm font-medium">Total</p>
              <p className="text-xs text-stone-500">
                <span>
                  {rooms} {+rooms === 1 ? "room" : "rooms"}
                </span>
                <span> &middot; </span>
                <span>
                  {calcTotalNights(
                    new Date(checkInDate),
                    new Date(checkOutDate)
                  )}
                </span>
                <span>
                  {calcTotalNights(
                    new Date(checkInDate),
                    new Date(checkOutDate)
                  ) === 1
                    ? " night"
                    : " nights"}
                </span>
              </p>
            </div>
            <p className="text-lg font-medium">
              &#8377;
              <span>
                {roomSelected &&
                roomSelected.costPerNight &&
                roomSelected.costDetails &&
                roomSelected.costDetails.taxesAndFees
                  ? roomSelected.costPerNight +
                    roomSelected.costDetails.taxesAndFees
                  : null}
              </span>
            </p>
          </div>

          {/* /// FARES END ROW */}

          <div className="flex text-sm bg-[#FFF0EC] rounded-br-2xl rounded-bl-2xl p-4">
            <HiOutlineCurrencyRupee size={24} />
            <p>
              <span> 12 months EMI available at </span>
              <span className="font-semibold text-md">
                {roomSelected &&
                roomSelected.costPerNight &&
                roomSelected.costDetails &&
                roomSelected.costDetails.taxesAndFees
                  ? (
                      (roomSelected.costPerNight +
                        roomSelected.costDetails.taxesAndFees) /
                      12
                    ).toFixed(0)
                  : null}
                /mo.
              </span>
              <span className="text-[#0E6AFF] cursor-not-allowed">
                View Plans
              </span>
              <span> on all leading banks</span>
            </p>
          </div>
        </div>
      </div>

      {/* /// MODAL FOR PAYMENT */}

      <Modal
        open={isModalOpen.paymetModal}
        onClose={handleClosePaymentModal}
        aria-labelledby="payment-modal"
        aria-describedby="modal-for-payment"
      >
        <div className="absolute flex p-10 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-md top-1/2 left-1/2">
          <div className="">
            <p className="text-2xl font-semibold">Select payment method</p>

            {/* /// UPI */}
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex gap-3">
                <input
                  id="upi-option"
                  type="radio"
                  defaultChecked
                  className="w-4"
                />
                <label htmlFor="upi-option">UPI</label>
              </div>
              <div className="flex flex-col gap-3 p-4 ml-3 border rounded-md shadow-lg">
                <label htmlFor="upi-ID">Enter UPI ID</label>
                <div className="flex items-center gap-3 max-sm:flex-col">
                  <input
                    id="upi-ID"
                    type="text"
                    placeholder="Enter your UPI ID"
                    className="p-2 border rounded-sm border-stone-400"
                  />
                  <button
                    onClick={handlePaymentSuccessModal}
                    className="bg-[#F77727] hover:bg-[#D4581D] cursor-pointer rounded-sm px-3 py-2 ml-3 text-sm text-white font-medium"
                  >
                    Pay now
                  </button>
                </div>
              </div>
            </div>

            {/* /// NET BANKING */}
            <div className="mt-5">
              <div className="flex gap-3">
                <input
                  id="netbaking-option"
                  type="radio"
                  disabled
                  defaultChecked
                  className="w-4"
                />
                <label htmlFor="netbaking-option">Net Banking</label>
              </div>
            </div>

            {/* /// DEBIT/CREDIT CARD */}
            <div className="mt-5">
              <div className="flex gap-3">
                <input
                  id="card-option"
                  type="radio"
                  disabled
                  defaultChecked
                  className="w-4"
                />
                <label htmlFor="card-option">Debit / Credit Card</label>
              </div>
            </div>
          </div>

          <p
            onClick={handleClosePaymentModal}
            className="text-xl font-bold cursor-pointer text-stone-600"
          >
            <span className="hover:text-[red]">&#x2715;</span>
          </p>
        </div>
      </Modal>

      {/* /// MODAL FOR SUCCESSFULL PAYMENT */}
      <Modal
        open={isModalOpen.paymentSuccessModal}
        onClose={handleCloseSuccessfullPayemntModal}
        aria-labelledby="payment-modal"
        aria-describedby="modal-for-payment"
      >
        <div className="absolute flex transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-md p-7 top-1/2 left-1/2">
          <div className="">
            <div className="flex flex-col items-center gap-6 text-[#2ECC70]">
              <p className="text-3xl font-light text-center">
                Payment successfull!
              </p>
              <GoCheckCircle size={80} />
            </div>
            <div className="flex flex-col gap-5 text-sm mt-14">
              <div className="flex justify-between">
                <p className="text-stone-500">Payment type</p>
                <p>UPI</p>
              </div>
              <div className="flex justify-between">
                <p className="text-stone-500">Mobile</p>
                <p>{bookedForDetails?.mobileNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-stone-500">Email</p>
                <p>{bookedForDetails?.emailAddress}</p>
              </div>
              <div className="flex justify-between py-3 font-semibold">
                <p className="text-stone-500">Amount paid</p>
                <p>
                  {roomSelected &&
                  roomSelected.costPerNight &&
                  roomSelected.costDetails &&
                  roomSelected.costDetails.taxesAndFees
                    ? (
                        roomSelected.costPerNight +
                        roomSelected.costDetails.taxesAndFees
                      ).toFixed(2)
                    : null}
                </p>
              </div>

              <div className="flex justify-between max-sm:flex-col">
                <p className="text-stone-500">Booking id</p>
                <p className="text-xs">{bookingID}</p>
              </div>
            </div>
            <p className="text-xs pt-7">
              <span
                onClick={handleNaviagte}
                className="text-[#0F69FF] cursor-pointer"
              >
                Click here
              </span>
              <span> or </span>
              <span>
                automatically redirecting to booking details in {countDownValue}
                ...
              </span>
            </p>
          </div>
        </div>
      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover={false}
      />
    </>
  );
}
