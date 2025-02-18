import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useEffect, useRef, useState } from "react";

import {
  PiNumberCircleOne,
  PiNumberCircleTwo,
  PiNumberCircleThree,
} from "react-icons/pi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import {
  HEADERS,
  airlineImages,
  base_URL,
  formatDateTimeISOString,
  formatDatesForDetailsPage,
} from "../assets/helper";
import { ToastContainer, toast } from "react-toastify";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Button,
  Modal,
  Select,
  TextField,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import PageNotFound from "./PageNotFound";

const taxRate = 24.18 / 100;

export default function FlightDetails() {
  const { name, token } = useAuth();
  const firstName = name?.split(" ")?.at(0) || "";
  const lastName = name?.split(" ")?.at(1) || "";

  const [flightBookedData, setFlightBookedData] = useState({});
  const [travellerDetails, setTravellerDetails] = useState({
    firstName,
    lastName,
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({
    emailError: "",
    phoneNumberError: "",
    invalidItinerary: false,
    firstNameError: "",
    lastNameError: "",
    genderError: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isFormValidated, setIsFormValidated] = useState(false);

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const timeOutRef = useRef(null);

  const itinerary = params.flightID;

  const {
    fromLocation,
    toLocation,
    travellers,
    numSeats,
    date = new Date(),
    travelClass,
    imageSrc,
  } = location.state || {};

  console.log(travellers);

  // console.log(itinerary);
  // console.log(flightBookedData);

  function handlePhoneNumber(e) {
    e.preventDefault();
    const inputValue = e.target.value;

    if (/^\d*$/.test(inputValue)) {
      setPhoneNumber(inputValue);
      setIsError((error) => {
        return { ...error, phoneNumberError: "" };
      });
    }
  }

  function handleEmail(e) {
    e.preventDefault();
    setEmail(e.target.value);
    setIsError((error) => {
      return { ...error, emailError: "" };
    });
  }

  function handleFirstName(e) {
    setTravellerDetails((details) => {
      return { ...details, firstName: e.target.value };
    });
    setIsError((error) => ({
      ...error,
      firstNameError: "",
    }));
  }

  function handleLastName(e) {
    e.preventDefault();
    setTravellerDetails((details) => {
      return { ...details, lastName: e.target.value };
    });
    setIsError((error) => ({
      ...error,
      lastNameError: "",
    }));
  }

  function handleGenderSelect(e) {
    e.preventDefault();
    setTravellerDetails((details) => ({
      ...details,
      gender: e.target.value,
    }));

    setIsError((error) => ({
      ...error,
      genderError: "",
    }));
  }

  function handleFormValidation() {
    let errors = {};

    if (!email.includes("@") || !email.includes(".com") || email.length === 0) {
      errors.emailError = "Please enter a valid email address";
    }

    if (phoneNumber.length === 0 || phoneNumber.length < 10) {
      errors.phoneNumberError = "Please enter a valid phone number";
    }

    if (
      Object.values(travellerDetails).some(
        (detailsValue) => detailsValue === ""
      )
    ) {
      if (travellerDetails.firstName === "") {
        errors.firstNameError = "Please enter a valid first name";
      }

      if (travellerDetails.lastName === "") {
        errors.lastNameError = "Please enter a valid last name";
      }

      if (travellerDetails.gender === "") {
        errors.genderError = "Please choose gender";
      }
    }

    setIsError((err) => ({ ...err, ...errors }));

    const hasNoErrors = Object.values(errors).every((err) => err === "");

    if (hasNoErrors) {
      handleOpenModal();
    }
  }

  function handleOpenModal() {
    setIsOpenModal(true);
  }

  function handleCloseModal() {
    setIsOpenModal(false);
  }

  async function handleBookFlight() {
    const payload = JSON.stringify({
      bookingType: "flight",
      bookingDetails: {
        flightId: itinerary,
        startDate: formatDateTimeISOString(
          date,
          flightBookedData?.departureTime
        ),
        endDate: formatDateTimeISOString(date, flightBookedData?.arrivalTime),
      },
    });

    try {
      const res = await fetch(`${base_URL}/booking`, {
        method: "POST",
        headers: { ...HEADERS, Authorization: `Bearer ${token}` },
        body: payload,
      });

      const resData = await res.json();

      const flightBookingID = resData?.booking?._id;
      const bookingSuccessMessage = resData?.message;

      console.log(resData);
      if (resData?.status === "success") {
        const existingflightBookingIDs =
          JSON.parse(localStorage.getItem("flightBookingIDs")) || [];

        const updatedflightBookingIDs = [
          ...existingflightBookingIDs,
          flightBookingID,
        ];

        localStorage.setItem(
          "flightBookingIDs",
          JSON.stringify(updatedflightBookingIDs)
        );

        setIsOpenModal(false);
        toast.success(bookingSuccessMessage);
        timeOutRef.current = setTimeout(() => {
          navigate("/mytrips");
        }, 3000);
      }

      if (resData?.status === "error")
        throw new Error(`${resData?.message} please re-try`);
    } catch (err) {
      toast.error(err);
      console.log(err);
    }
  }

  useEffect(function () {
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function getFlightDetails() {
      setIsError((error) => ({ ...error, invalidItinerary: false }));
      setIsLoading(true);
      try {
        const res = await fetch(`${base_URL}/flight/${itinerary}`, {
          method: "GET",
          headers: HEADERS,
        });

        const resData = await res.json();

        if (resData.message === "success") {
          const flightData = resData?.data;
          setFlightBookedData(flightData);
        }

        if (resData.status === "fail") throw new Error("Unknown input");
      } catch (err) {
        setIsError((error) => ({ ...error, invalidItinerary: true }));
      } finally {
        setIsLoading(false);
      }
    }

    getFlightDetails();

    // return () => clearTimeout(timeoutID);
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && isError.invalidItinerary && <PageNotFound />}
      {!isLoading && !isError.invalidItinerary && (
        <>
          <div className="container flex w-full max-sm:p-3 gap-20 justify-around mt-10 mb-10 max-sm:flex-col ">
            <div className="sub-conatiner-1  flex flex-col gap-5 ml-12 max-sm:ml-0 max-sm:p-5">
              <div className="row_num__1 flex gap-3 items-center">
                <PiNumberCircleOne size={30} />
                <p className="text-xl font-semibold">Review your itinerary</p>
              </div>

              <p className="row_num__2 flex items-center gap-4 mt-10">
                <span className="font-semibold">{fromLocation?.city}</span>
                <span className="">&rarr;</span>
                <span className="font-semibold">{toLocation?.city}</span>
                <span className="text-stone-500 max-sm:text-xs">
                  {formatDatesForDetailsPage(new Date(date))}
                  {new Date(date).getFullYear()}
                </span>
              </p>

              <div className="row_num__3 flex items-center gap-6">
                <div className="row_num_3_col_1 flex flex-col  text-xs text-stone-500">
                  <img
                    src={airlineImages[imageSrc]?.at(0)}
                    alt={`${airlineImages[imageSrc]?.at(1)}-img`}
                    width={40}
                    height={40}
                  />
                  <p>{airlineImages[imageSrc]?.at(1)}</p>
                  <p>{flightBookedData?.flightID?.split("-").at(0)}</p>
                  <p>{travelClass}</p>
                </div>

                <div className="row_num_3_col_2 max-sm:hidden">
                  <svg width="9" height="97" viewBox="0 0 9 97">
                    <g fill="none" fillRule="evenodd">
                      <circle fill="#999" cx="4.5" cy="4.5" r="4.5"></circle>
                      <circle fill="#999" cx="4.5" cy="92.5" r="4.5"></circle>
                      <path
                        stroke="#999"
                        strokeLinecap="square"
                        strokeDasharray="7"
                        d="M4.5 7v84"
                      ></path>
                    </g>
                  </svg>
                </div>

                <div className="row_num_3_col_3 flex flex-col gap-4">
                  <div className="departure_time__contents flex gap-2 items-center">
                    <p className="text-lg font-semibold">
                      {flightBookedData?.departureTime}
                    </p>
                    <p className="text-lg font-light">
                      {flightBookedData?.source}
                    </p>
                    <p className="text-xs">
                      {fromLocation?.airportName}, {fromLocation?.city}
                    </p>
                  </div>

                  <div className="duration_time__contents flex items-center gap-1 text-stone-500">
                    <AiOutlineClockCircle />
                    <p>{flightBookedData?.duration}h</p>
                  </div>

                  <div className="arrival_time__contents flex gap-2 items-center">
                    <p className="text-lg font-semibold">
                      {flightBookedData?.arrivalTime}
                    </p>
                    <p className="text-lg font-light">
                      {flightBookedData?.destination}
                    </p>
                    <p className="text-xs">
                      {toLocation?.airportName}, {toLocation?.city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row_num__4 mt-7  border px-3 py-2 rounded-md flight_medi__care max-sm:text-xs">
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <p>This booking is covered by </p>
                    <img
                      src="https://fastui.cltpstatic.com/image/upload/offermgmt/images/mediCancelDTSvg.svg"
                      alt="mediCancelDTSvg"
                      className="max-sm:w-24"
                    />
                  </div>
                  <p className="">
                    <span className="text-[#0FA670] font-semibold">Free </span>
                    <span className="line-through font-semibold text-stone-500">
                      199
                    </span>
                  </p>
                </div>
                <p className="font-light">
                  Get a full refund on your flight &#40;excluding platform
                  convenience fee&#41; for medical reasons. T&C apply.{" "}
                  <span className="text-[#0E6AFF] cursor-not-allowed">
                    Learn More
                  </span>
                </p>
                <p className="text-sm pt-2 p__medi__care">
                  2.5k travellers availed in last one month
                </p>
              </div>

              <div className="border my-4"></div>

              <div className="row_num__5 flex items-center gap-3">
                <PiNumberCircleTwo size={30} />
                <div>
                  <p className="text-xl font-semibold">Add contact details</p>
                  <p className="text-xs">
                    E-ticket will be sent to this email address and phone number
                  </p>
                </div>
              </div>

              <div className="mobile__number">
                <p className="font-light">Mobile Number</p>
                <div className="mt-4 flex gap-4">
                  <p className="border py-2.5 px-4 w-min h-max rounded-md flex items-center text-xs">
                    +91
                  </p>
                  <TextField
                    size="small"
                    className=""
                    placeholder="Mobile number"
                    variant="outlined"
                    value={phoneNumber}
                    onChange={handlePhoneNumber}
                    inputProps={{
                      maxLength: 10,
                    }}
                    error={isError.phoneNumberError !== ""}
                    helperText={
                      isError.phoneNumberError ? isError.phoneNumberError : ""
                    }
                  />
                </div>
              </div>

              <div className="email_input mt-6">
                <p className="font-light">Email address</p>
                <div className="mt-4 w-2/3">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Email address"
                    variant="outlined"
                    value={email}
                    onChange={handleEmail}
                    error={isError.emailError !== ""}
                    helperText={isError.emailError ? isError.emailError : ""}
                  />
                </div>
              </div>

              <div className="border my-4"></div>

              <div className="row_num__6 flex items-center gap-3">
                <PiNumberCircleThree size={30} />
                <p className="text-xl font-semibold">Add traveller details</p>
              </div>

              <div className="name-gender">
                <p className="font-semibold">Adult {numSeats}</p>

                <p className="text-sm text-stone-500 my-3">
                  Traveller name and gender
                </p>

                <div className="flex gap-5 flex-wrap">
                  <TextField
                    size="small"
                    placeholder="First name"
                    variant="outlined"
                    value={travellerDetails.firstName}
                    onChange={handleFirstName}
                    error={isError.firstNameError !== ""}
                    helperText={
                      isError.firstNameError ? isError.firstNameError : ""
                    }
                  />

                  <TextField
                    size="small"
                    placeholder="Last name"
                    variant="outlined"
                    value={travellerDetails.lastName}
                    onChange={handleLastName}
                    error={isError.lastNameError !== ""}
                    helperText={
                      isError.lastNameError ? isError.lastNameError : ""
                    }
                  />

                  <FormControl
                    size="small"
                    className="w-28"
                    error={isError.genderError !== ""}
                  >
                    <InputLabel id="gender-select-label">Gender</InputLabel>

                    <Select
                      labelId="gender-select-label"
                      id="gender-select-label"
                      value={travellerDetails.gender}
                      label="Gender"
                      onChange={handleGenderSelect}
                    >
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Female"}>Female</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                    <FormHelperText>
                      {isError.genderError ? isError.genderError : ""}
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
              <div>
                <Button
                  className="bg-[#F77727] p-2 rounded-md text-white font-semibold hover:bg-[#d4581d]"
                  onClick={() => {
                    handleFormValidation();
                  }}
                >
                  Continue to Payment
                </Button>
                <Modal
                  open={isOpenModal}
                  onClose={handleCloseModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-md bg-white shadow-md p-4">
                    <div className="flex justify-between items-center">
                      <h1 className="text-xl">Review Information</h1>
                      <div onClick={handleCloseModal}>
                        <span className="text-2xl hover:text-[red] cursor-pointer">
                          &times;{" "}
                        </span>
                      </div>
                    </div>
                    <hr className="my-3" />
                    <div className="flex flex-col gap-4 items-center">
                      <p className="flex items-center gap-4 mt-10">
                        <span className="font-semibold">
                          {fromLocation?.city}
                        </span>
                        <span className="">&rarr;</span>
                        <span className="font-semibold">
                          {toLocation?.city}
                        </span>
                        <span className="text-stone-500 max-sm:text-xs">
                          {formatDatesForDetailsPage(new Date(date))}
                          {new Date(date).getFullYear()}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold">Flight ID : </span>
                        {flightBookedData?.flightID}
                      </p>

                      <div className="row_num_3_col_3 flex gap-4">
                        <p className="text-lg font-semibold">
                          {flightBookedData?.departureTime}
                        </p>

                        <div className="duration_time__contents flex items-center gap-1 text-stone-500">
                          <AiOutlineClockCircle />
                          <p>{flightBookedData?.duration}h</p>
                        </div>

                        <p className="text-lg font-semibold">
                          {flightBookedData?.arrivalTime}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 border p-4 rounded-sm">
                        <div className="flex justify-between">
                          <p className="text-sm font-normal pr-1">Name</p>
                          <p>
                            {travellerDetails.firstName}{" "}
                            {travellerDetails.lastName}
                          </p>
                        </div>

                        <div className="flex justify-between">
                          <p className="text-sm font-normal pr-1">Mobile</p>
                          <p>{phoneNumber}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-sm font-normal pr-1">Email</p>
                          <p className="text-sm"> {email}</p>
                        </div>
                      </div>

                      {/* <hr className="my-3" /> */}

                      <button
                        onClick={handleBookFlight}
                        className="bg-[#F77727] p-2 rounded-md text-white font-semibold hover:bg-[#d4581d]"
                      >
                        Book Flight
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>

            <div className="fare-price max-sm:w-full w-3/12 border h-1/3 rounded-md sticky top-28 z-10 ">
              <div className="p-4">
                <div className="flex justify-between">
                  <p>Total Price </p>
                  <p className="text-xl font-semibold">
                    &#8377;{" "}
                    {(
                      flightBookedData?.ticketPrice *
                      numSeats *
                      (1 + taxRate)
                    ).toFixed(0)}
                  </p>
                </div>
                <p className="text-xs text-stone-500">
                  {/* {numSeats} {numSeats > 1 ? "adults" : "adult"} */}
                  <span>{`${travellers.adults} adult${
                    travellers.adults > 1 ? "s" : ""
                  }`}</span>
                  {travellers.children > 0 && (
                    <span>
                      ,{" "}
                      {`${travellers.children} child${
                        travellers.children > 1 ? "s" : ""
                      }`}
                    </span>
                  )}
                  {travellers.infants > 0 && (
                    <span>
                      ,{" "}
                      {`${travellers.infants} infant${
                        travellers.infants > 1 ? "s" : ""
                      }`}
                    </span>
                  )}
                </p>
              </div>
              <hr className="mt-7 mb-3" />

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-10">
                  <p className="text-sm text-stone-500  ">
                    Base fare &#40;{`${numSeats} traveller`}&#41;
                  </p>
                  <p className="text-sm text-ellipsis whitespace-nowrap">
                    &#8377; {flightBookedData?.ticketPrice * numSeats}
                  </p>
                </div>

                <div className="flex items-center justify-between whitespace-nowrap">
                  <p className="text-sm text-stone-500">Taxes and fees</p>
                  <p className="text-sm">
                    &#8377;{" "}
                    {(
                      flightBookedData?.ticketPrice *
                      numSeats *
                      taxRate
                    ).toFixed(0)}
                  </p>
                </div>

                <div className="flex items-center justify-between whitespace-nowrap">
                  <p className="text-sm text-stone-500">Add ons &#94;</p>
                  <p className="text-sm">Free</p>
                </div>

                <div className="flex items-center justify-between whitespace-nowrap">
                  <p className="text-xs text-stone-500">Medi-cancel benefit</p>
                  <p className="text-sm">
                    <span className="line-through">199</span>{" "}
                    <span className="text-[#0FA670]">Free</span>
                  </p>
                </div>
              </div>

              <div className="bg-[#FFF0EC] p-4 flex items-center  gap-2 rounded-br-lg rounded-bl-lg ">
                <div className="self-start">
                  <HiOutlineCurrencyRupee />
                </div>
                <div>
                  <p className="font-semibold text-xs">
                    Pay in 6 interest free EMIs
                  </p>
                  <p className="font-semibold">
                    at ₹{" "}
                    {(
                      (flightBookedData?.ticketPrice *
                        numSeats *
                        (1 + taxRate)) /
                      6
                    ).toFixed(0)}
                    <span>/mo. </span>
                    <span className="font-semibold text-xs text-[#106BFF] cursor-not-allowed">
                      View plans
                    </span>
                  </p>
                  <p className="text-xs text-stone-500">
                    with your credit card
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover={false}
      />
    </>
  );
}
