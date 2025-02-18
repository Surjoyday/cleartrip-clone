import { useEffect, useReducer, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { Box, Popover } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

// import { LuMinusCircle, LuPlusCircle } from "react-icons/lu";
import { MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { FaRegUser, FaUser } from "react-icons/fa6";

import {
  PiArrowRightLight,
  PiCaretDown,
  PiCaretUp,
  PiCheckLight,
} from "react-icons/pi";

import {
  base_URL,
  HEADERS,
  getCurrentDate,
  getDayOfWeek,
} from "../assets/helper";
import { RightLeftArrow } from "../assets/icons";
import { useNavigate } from "react-router-dom";

const initialState = {
  fromInput: null,
  toInput: null,
  origin: {},
  destination: {},
  airportData: [],
  dateInput: getCurrentDate(),
  day: getDayOfWeek(new Date(getCurrentDate())),
  travelClass: "Economy",
  seats: 1,
  adults: 1,
  children: 0,
  infants: 0,
  errors: {
    fromInError: "",
    toInError: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_AIRPORT_DATA":
      return { ...state, airportData: action.payload };

    case "SET_FROM_INPUT":
      return {
        ...state,
        fromInput: action.payload?.cityCode,
        origin: action.payload,
        errors: { ...state.errors, fromInError: "" },
      };

    case "SET_TO_INPUT":
      return {
        ...state,
        toInput: action.payload?.cityCode,
        destination: action.payload,
        errors: { ...state.errors, toInError: "" },
      };

    case "SET_DATE":
      return {
        ...state,
        dateInput: action.payload,
        day: getDayOfWeek(new Date(action.payload)),
      };

    case "SET_ADULTS":
      return {
        ...state,
        adults: action.payload === "inc" ? state.adults + 1 : state.adults - 1,
      };

    case "SET_CHILDREN":
      return {
        ...state,
        children:
          action.payload === "inc" ? state.children + 1 : state.children - 1,
      };

    case "SET_INFANTS":
      return {
        ...state,
        infants:
          action.payload === "inc" ? state.infants + 1 : state.infants - 1,
      };

    case "SET_TRAVEL_CLASS":
      return { ...state, travelClass: action.payload };

    case "SET_ERRORS":
      const [type, errorMsg] = action.payload;
      return { ...state, errors: { ...state.errors, [type]: errorMsg } };

    default:
      throw new Error("Unknown action");
  }
}

export default function Flight() {
  const [anchorElTripType, setAnchorElTripType] = useState(null);
  const [anchorElSeatsAndClass, setAnchorElSeatsAndClass] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const {
    toInput,
    fromInput,
    airportData,
    offers,
    dateInput,
    travelClass,
    errors,
    seats,
    day,
    origin,
    destination,
    adults,
    children,
    infants,
  } = state;

  useEffect(function () {
    getAllAirportsData();
  }, []);

  // GETING ALL AIRPORTS DATA ON INITIAL RENDER
  async function getAllAirportsData() {
    const res = await fetch(`${base_URL}/airport?search={"city":""}&limit=30`, {
      method: "GET",
      headers: HEADERS,
    });

    const resData = await res.json();

    const airportDataReturned = resData?.data?.airports?.map(
      ({ _id, iata_code, country, city, name }) => {
        return {
          id: _id,
          airportName: name,
          country,
          cityCode: iata_code,
          city,
        };
      }
    );

    dispatch({ type: "SET_AIRPORT_DATA", payload: airportDataReturned });
    // console.log(airportDataReturned);
  }

  const totalTravellers = adults + children + infants;

  function handleNavigate() {
    if (!fromInput || !toInput) {
      if (!fromInput)
        dispatch({
          type: "SET_ERRORS",
          payload: ["fromInError", "Please select a departure location"],
        });

      if (!toInput)
        dispatch({
          type: "SET_ERRORS",
          payload: ["toInError", "Please select an arrival location"],
        });

      return;
    }

    if (fromInput === toInput) {
      toast.error("Source and destination cannot be same !", {
        theme: "colored",
      });
      return;
    }

    navigate(
      `/flights/results?from=${fromInput}&to=${toInput}&depart_date=${dateInput}&day=${day}&travel_class=${travelClass}&seats=${totalTravellers}`,
      {
        state: {
          origin,
          destination,
          tarvellers: { adults, children, infants },
          dateInput,
        },
      }
    );
  }

  //// TOTAL COUNT OF PEOPLE
  const totalPeopleCount = adults + children;

  return (
    <>
      <section className="">
        <div className="flights__bi rounded-xl">
          <div className="flight-headings flex relative mx-5 ">
            <div className="mt-3">
              <h1 className="text-3xl font-medium">Search Flights</h1>
              <h2 className="font-medium text-base text-stone-700">
                Enjoy hassle free bookings with Cleartrip
              </h2>
            </div>
            <div className="absolute right-0 -bottom-10">
              {/* <img
                src="https://fastui.cltpstatic.com/image/upload/f_auto,q_auto,w_116,h_120,dpr_2/offermgmt/images/CLEAR_TRIP_MS_DHONI_DESKTOP.png"
                className="h-36 w-34 max-sm:hidden"
              /> */}
            </div>
          </div>

          {/* /// CONATINER */}
          <div className="flex justify-center flex-col my-6  px-4 py-10 shadow-lg  rounded-xl  border bg-white">
            {/* /// CLASS TYPE & SEATS */}
            <div className="mb-6 flex gap-5 align-middle justify-start pl-12 max-sm:pl-2">
              {/* /// ONE WAY TRIP  */}

              <div className="flex gap-2 items-center max-sm:text-sm">
                <PiArrowRightLight size={23} />
                <p
                  onClick={(e) => setAnchorElTripType(e.currentTarget)}
                  className="cursor-pointer"
                >
                  One Way
                </p>
                {anchorElTripType ? (
                  <PiCaretUp color="#999999" />
                ) : (
                  <PiCaretDown color="#999999" />
                )}
                <div>
                  <Popover
                    open={Boolean(anchorElTripType)}
                    anchorEl={anchorElTripType}
                    onClose={() => setAnchorElTripType(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <div className="p-4 font-medium">
                      <div className="flex gap-2 items-center ">
                        <PiCheckLight />
                        <p>One way</p>
                      </div>
                      {/* <p
                        className="pl-6 cursor-progress"
                        title="Round trip not available currently"
                      >
                        Round trip
                      </p> */}
                    </div>
                  </Popover>
                </div>
              </div>

              {/* /// SEATS & CLASS TYPE */}
              <div className="flex items-center gap-2 max-sm:text-sm">
                {anchorElSeatsAndClass ? (
                  <FaUser size={16} className="self-center" />
                ) : (
                  <FaRegUser size={16} className="self-center" />
                )}
                <p
                  onClick={(e) => setAnchorElSeatsAndClass(e.currentTarget)}
                  className="cursor-pointer"
                >
                  {/* {adults} Adult,  {travelClass}  */}
                  <span>{`${adults} Adult${adults > 1 ? "s," : ", "}`}</span>
                  {+children >= 1 && (
                    <span>
                      {" "}
                      {`${children} Children${children > 1 ? "s," : ", "}`}
                    </span>
                  )}

                  {+infants >= 1 && (
                    <span>
                      {" "}
                      {`${infants} Infant${infants > 1 ? "s," : ", "}`}
                    </span>
                  )}

                  <span> {travelClass}</span>
                </p>

                {anchorElSeatsAndClass ? (
                  <PiCaretUp color="#999999" />
                ) : (
                  <PiCaretDown color="#999999" />
                )}
                <Popover
                  open={Boolean(anchorElSeatsAndClass)}
                  onClose={() => setAnchorElSeatsAndClass(null)}
                  anchorEl={anchorElSeatsAndClass}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="w-60 p-4 max-sm:p-2 max-sm:w-48 flex flex-col gap-5">
                    {/* /// ADULTS */}
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Adults</p>
                        <p className="text-xs text-stone-500">(12+ Years)</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            dispatch({ type: "SET_ADULTS", payload: "dec" })
                          }
                          disabled={adults === 1}
                        >
                          <CiCircleMinus
                            size={30}
                            className={`${
                              adults > 1 ? "text-[#3366CC]" : "text-stone-400"
                            }`}
                          />
                        </button>
                        <p>{adults}</p>
                        <button
                          disabled={totalPeopleCount >= 9}
                          onClick={() =>
                            dispatch({ type: "SET_ADULTS", payload: "inc" })
                          }
                        >
                          <CiCirclePlus
                            size={30}
                            className={`${
                              totalPeopleCount >= 9
                                ? "text-stone-400"
                                : "text-[#3366CC]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* /// CHILDREN */}
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Children</p>
                        <p className="text-xs text-stone-500">(2 - 12 yrs)</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            dispatch({ type: "SET_CHILDREN", payload: "dec" })
                          }
                          disabled={children <= 0}
                        >
                          <CiCircleMinus
                            size={30}
                            className={`${
                              children <= 0
                                ? "text-stone-400"
                                : "text-[#3366CC]"
                            }`}
                          />
                        </button>
                        <p>{children}</p>
                        <button
                          disabled={totalPeopleCount >= 9}
                          onClick={() =>
                            dispatch({ type: "SET_CHILDREN", payload: "inc" })
                          }
                        >
                          <CiCirclePlus
                            size={30}
                            className={`${
                              totalPeopleCount >= 9
                                ? "text-stone-400"
                                : "text-[#3366CC]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* /// INFANTS */}

                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Infants</p>
                        <p className="text-xs text-stone-500">(Below 2 yrs)</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            dispatch({ type: "SET_INFANTS", payload: "dec" })
                          }
                          disabled={infants <= 0}
                        >
                          <CiCircleMinus
                            size={30}
                            className={`${
                              infants <= 0 ? "text-stone-400" : "text-[#3366CC]"
                            }`}
                          />
                        </button>
                        <p>{infants}</p>
                        <button
                          disabled={infants >= adults}
                          onClick={() =>
                            dispatch({ type: "SET_INFANTS", payload: "inc" })
                          }
                        >
                          <CiCirclePlus
                            size={30}
                            className={`${
                              infants >= adults
                                ? "text-stone-400"
                                : "text-[#3366CC]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* /// TRAVEL CLASS */}

                    <div className="text-xs flex flex-wrap gap-4 max-sm:gap-2 pt-3">
                      <p
                        className={`${
                          travelClass === "Economy"
                            ? "border-[#3366CC] bg-[#EFF5FB]"
                            : ""
                        }  border w-fit py-1 px-1.5 rounded-full cursor-pointer`}
                        onClick={() =>
                          dispatch({
                            type: "SET_TRAVEL_CLASS",
                            payload: "Economy",
                          })
                        }
                      >
                        Economy
                      </p>
                      <p
                        className={`${
                          travelClass === "Bussiness class"
                            ? "border-[#3366CC] bg-[#EFF5FB]"
                            : ""
                        }  border w-fit py-1 px-1.5 rounded-full cursor-pointer`}
                        onClick={() =>
                          dispatch({
                            type: "SET_TRAVEL_CLASS",
                            payload: "Bussiness class",
                          })
                        }
                      >
                        Bussiness class
                      </p>
                      <p
                        className={`${
                          travelClass === "First class"
                            ? "border-[#3366CC] bg-[#EFF5FB]"
                            : ""
                        }  border w-fit py-1 px-1.5 rounded-full cursor-pointer`}
                        onClick={() =>
                          dispatch({
                            type: "SET_TRAVEL_CLASS",
                            payload: "First class",
                          })
                        }
                      >
                        First class
                      </p>
                      <p
                        className={`${
                          travelClass === "Premium economy"
                            ? "border-[#3366CC] bg-[#EFF5FB]"
                            : ""
                        }  border w-fit py-1 px-1.5 rounded-full cursor-pointer`}
                        onClick={() =>
                          dispatch({
                            type: "SET_TRAVEL_CLASS",
                            payload: "Premium economy",
                          })
                        }
                      >
                        Premium economy
                      </p>
                    </div>
                  </div>
                </Popover>
              </div>
            </div>

            {/* SEARCH CONTAINER*/}
            <div className="search-field flex flex-col gap-4 px-4">
              {/* FROM - TO CONTAINER */}
              <div className=" flex items-center justify-center rounded-md mb-4 mt-5 px-4 py-2 relative">
                {/* /// FROM CONTAINER*/}
                <div className=" flex items-center w-full">
                  {/* /// FROM INPUT CONTAINER */}
                  <div className="">
                    {airportData.length > 0 && (
                      <Autocomplete
                        forcePopupIcon={false}
                        options={airportData}
                        getOptionLabel={(airport) =>
                          `${airport?.cityCode} - ${airport?.city}, ${
                            airport?.country.toLowerCase() === "india"
                              ? "IN"
                              : airport?.country
                          }`
                        }
                        renderOption={(props, airport) => (
                          <Box
                            component="li"
                            sx={{
                              "&:hover > div": {
                                backgroundColor: "#0E6AFF",
                                padding: ".2em",
                                borderRadius: "2px",
                                color: "white",
                              },
                              "& > div": {
                                mr: 2,
                                flexShrink: 0,
                                transition: "background-color .4s",
                              },
                            }}
                            {...props}
                            key={airport.id}
                          >
                            <div>{airport.cityCode}</div>
                            {`${airport?.cityCode} - ${airport?.city}, ${
                              airport?.country.toLowerCase() === "india"
                                ? "IN"
                                : airport?.country
                            }`}
                          </Box>
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(_, value) => {
                          dispatch({
                            type: "SET_FROM_INPUT",
                            payload: value,
                          });
                          // console.log(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            variant="outlined"
                            {...params}
                            InputProps={{
                              ...params.InputProps,

                              startAdornment: (
                                <InputAdornment position="start">
                                  <MdFlightTakeoff className="text-2xl ml-4 max-sm:ml-2  text-stone-400" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                borderTopLeftRadius: 6,
                                borderBottomLeftRadius: 6,
                                height: 50,
                              },
                            }}
                            size="small"
                            id="from-input"
                            className="w-[280px] max-sm:w-44  pl-2 py-2"
                            placeholder="Where from?"
                            error={errors.fromInError !== ""}
                            helperText={errors.fromInError || ""}
                          />
                        )}
                      />
                    )}
                  </div>
                </div>
                {/* /// ICON LEFT-RIGHT ARROW */}
                {/* <div className="text-blue-500 max-sm:hidden absolute left-1/2 z-40 bg-white"> */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full -mt-14 z-10 bg-white ">
                  <RightLeftArrow />
                </div>
                {/*/// TO CONTAINER*/}
                <div className=" flex items-center ">
                  {/* /// TO INPUT CONTAINER */}
                  <div className="to-input-container ">
                    {airportData.length > 0 && (
                      <Autocomplete
                        forcePopupIcon={false}
                        options={airportData}
                        getOptionLabel={(airport) =>
                          `${airport?.cityCode} - ${airport?.city}, ${
                            airport?.country.toLowerCase() === "india"
                              ? "IN"
                              : airport?.country
                          }`
                        }
                        renderOption={(props, airport) => (
                          <Box
                            component="li"
                            sx={{
                              "&:hover > div": {
                                backgroundColor: "#0E6AFF",
                                padding: ".2em",
                                borderRadius: "2px",
                                color: "white",
                              },
                              "& > div": {
                                mr: 2,
                                flexShrink: 0,
                                transition: "background-color 0.3s",
                              },
                            }}
                            {...props}
                            key={airport.id}
                          >
                            <div>{airport?.cityCode}</div>
                            {`${airport?.cityCode} - ${airport?.city}, ${
                              airport.country.toLowerCase() === "india"
                                ? "IN"
                                : airport.country
                            }`}
                          </Box>
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(_option, value) => {
                          dispatch({
                            type: "SET_TO_INPUT",
                            payload: value,
                          });
                          // console.log(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MdFlightLand className="text-2xl ml-7 text-stone-400" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderTopRightRadius: 6,
                                borderBottomRightRadius: 6,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                height: 50,
                              },
                            }}
                            size="small"
                            id="to-input"
                            className="w-[280px] max-sm:w-44  pr-2 py-2"
                            placeholder="Where to?"
                            error={errors.toInError !== ""}
                            helperText={errors.toInError || ""}
                          />
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* SEARCH & DATE */}
              <div className="date-search-btn">
                <div className="flex justify-center items-center gap-6 w-full">
                  {/* DATE */}
                  <TextField
                    type="date"
                    label="Select Date"
                    size="small"
                    value={dateInput}
                    onChange={(e) =>
                      dispatch({ type: "SET_DATE", payload: e.target.value })
                    }
                    inputProps={{
                      min: getCurrentDate(),
                    }}
                  />
                  <Button
                    variant="contained"
                    className="bg-[#F77727] text-white font-bold  hover:bg-[#f77e27f9] py-[7.4px] px-5 rounded normal-case whitespace-nowrap"
                    onClick={handleNavigate}
                  >
                    Search flights
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        pauseOnHover={false}
      />
    </>
  );
}
