import { useEffect, useReducer, useState } from "react";
import {
  base_URL,
  getCurrentDate,
  getTommorrowsDate,
  HEADERS,
} from "../assets/helper";

import {
  Autocomplete,
  Box,
  TextField,
  Button,
  Popover,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

import { IoLocationSharp } from "react-icons/io5";
import { CiUser, CiCirclePlus, CiCircleMinus } from "react-icons/ci";

import { GrMapLocation } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const initialState = {
  searchedCity: "",
  checkIn: getCurrentDate(),
  checkOut: getTommorrowsDate(),
  rooms: [1],
  guests: [{ adults: 1, children: 0 }],
  cities: [],
  isFocused: false,
  errorMessages: { textFieldError: "", checkInError: "", checkOutError: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CITY_LIST":
      return { ...state, cities: action.payload };

    case "SET_IS_FOCUSED":
      return { ...state, isFocused: !state.isFocused };

    case "SET_SEARCHED_CITY":
      const cityName = action.payload?.cityState?.split(",")[0].trim();
      return {
        ...state,
        searchedCity: cityName,
        errorMessages: { ...state.errorMessages, textFieldError: "" },
      };

    case "SET_CHECK-IN":
      return {
        ...state,
        checkIn: action.payload,
        errorMessages: { ...state.errorMessages, checkInError: "" },
      };

    case "SET_CHECK-OUT":
      return {
        ...state,
        checkOut: action.payload,
        errorMessages: { ...state.errorMessages, checkOutError: "" },
      };

    case "SET_ERROR_MSG":
      const { payload } = action;
      const updatedErrorMessages = { ...state.errorMessages };

      switch (payload) {
        case "textFieldError":
          updatedErrorMessages.textFieldError =
            "Please select a valid destination";
          break;
        case "checkInError":
          updatedErrorMessages.checkInError = "Select a different date";
          break;
        case "checkOutError":
          updatedErrorMessages.checkOutError = "Select a different date";
          break;
        default:
          break;
      }

      return {
        ...state,
        errorMessages: updatedErrorMessages,
      };

    case "SET_ADULTS_GUESTS":
      const [roomsIndexAgain, toChangeAgain] = action.payload;

      const totalGuestsInRoomAgain =
        state.guests[roomsIndexAgain].adults +
        state.guests[roomsIndexAgain].children;

      if (toChangeAgain === "inc" && totalGuestsInRoomAgain + 1 > 4) {
        return state;
      }

      const updatedAdultsCount = state.guests.map((guest, index) => {
        if (index === roomsIndexAgain) {
          return {
            ...guest,
            adults:
              toChangeAgain === "inc" ? guest.adults + 1 : guest.adults - 1,
          };
        }

        return guest;
      });

      return {
        ...state,
        guests: updatedAdultsCount,
      };

    case "SET_CHILDREN_GUESTS":
      const [roomIndex, toChange] = action.payload;

      const totalGuestsInRoom =
        state.guests[roomIndex].adults + state.guests[roomIndex].children;

      if (toChange === "inc" && totalGuestsInRoom + 1 > 4) {
        return state;
      }

      const updatedChildrenCount = state.guests.map((guest, index) => {
        if (index === roomIndex) {
          return {
            ...guest,
            children:
              toChange === "inc" ? guest.children + 1 : guest.children - 1,
          };
        }
        return guest;
      });

      return {
        ...state,
        guests: updatedChildrenCount,
      };

    case "SET_ADDED_ROOM":
      return {
        ...state,
        rooms: [...state.rooms, state.rooms.length + 1],
        guests: [...state.guests, { adults: 1, children: 0 }],
      };

    case "DELETE_ROOM":
      const updatedRooms = state.rooms.slice(0, -1);

      const updatedGuests = state.guests.filter(
        (_, index) => index !== action.payload
      );
      return { ...state, rooms: updatedRooms, guests: updatedGuests };

    default:
      throw new Error("Unknown action");
  }
}

export default function Hotels() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();

  const {
    checkIn,
    checkOut,
    rooms,
    guests,
    cities,
    searchedCity,
    isFocused,
    errorMessages,
  } = state;

  useEffect(function () {
    getAllCities();
  }, []);

  // GETTING ALL AVILABLE CITIES
  async function getAllCities() {
    const res = await fetch(`${base_URL}/city?limit=40`, {
      method: "GET",
      headers: HEADERS,
    });

    const resData = await res.json();

    const resDataCities = resData?.data?.cities;

    dispatch({ type: "SET_CITY_LIST", payload: resDataCities });
  }

  // REDIRECT TO HOTELS SEARCH PAGE AND ERROR CHECK
  function handleNavigate() {
    let hasNoErrors = true;
    if (
      !cities
        .map((city) => city?.cityState?.split(",").at(0).trim())
        .includes(searchedCity) ||
      searchedCity === ""
    ) {
      dispatch({ type: "SET_ERROR_MSG", payload: "textFieldError" });
      hasNoErrors = false;
    }

    // errorMessages: { textFieldError: "", checkInError: "", checkOutError: "" },

    if (new Date(checkIn) > new Date(checkOut)) {
      dispatch({ type: "SET_ERROR_MSG", payload: "checkInError" });
      hasNoErrors = false;
    }

    if (new Date(checkOut) < new Date(checkIn)) {
      dispatch({ type: "SET_ERROR_MSG", payload: "checkOutError" });
      hasNoErrors = false;
    }

    if (hasNoErrors) {
      navigate(
        `/hotels/results?city=${searchedCity}&chk_in=${checkIn}&chk_out=${checkOut}&guests=${JSON.stringify(
          guests
        )}&rooms=${rooms.length}`
      );
    }
  }

  /// GETING THE TOTAL ADULTS SELECTED COUNT

  const totalAdultsCount = guests
    .map((guestObj) => guestObj.adults)
    .reduce((acc, curr) => acc + curr, 0);

  //// GETING THE TOTAL CHILDREN SELECTED COUNT

  const totalChildrenCount = guests
    .map((guestObj) => guestObj.children)
    .reduce((acc, curr) => acc + curr, 0);

  // console.log(totalChildrenCount);

  return (
    <>
      <section className="">
        <div className="hotels-headings">
          <h1 className="text-3xl font-medium mt-1">Search Hotels</h1>
          <h2 className="font-medium text-base mt-1 text-stone-700">
            Enjoy hassle free bookings with Cleartrip
          </h2>
        </div>

        {/* HOTEL BOOKING BOX */}
        <div className="container-hotel flex flex-col gap-6 my-6 px-4 py-6 shadow-lg  rounded-xl border">
          {/* DESTINATION - CITY INPUT*/}
          <div className="hotel-city-box">
            {cities.length > 0 && (
              <Autocomplete
                fullWidth
                forcePopupIcon={false}
                options={cities}
                getOptionLabel={(cities) => `${cities?.cityState}`}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(_, value) =>
                  dispatch({ type: "SET_SEARCHED_CITY", payload: value })
                }
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > div": { mr: 2, flexShrink: 0 } }}
                    {...props}
                    key={option._id}
                  >
                    <div>
                      <GrMapLocation />
                    </div>
                    {option.cityState}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onFocus={() => dispatch({ type: "SET_IS_FOCUSED" })}
                    onBlur={() => dispatch({ type: "SET_IS_FOCUSED" })}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IoLocationSharp
                            className="text-2xl text-stone-400"
                            style={isFocused && { color: "#FF4F17" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter city"
                    id="city-input"
                    className="w-full sm:w-[630px] max-w-[630px]  px-2 py-2"
                    error={errorMessages.textFieldError !== ""}
                    helperText={
                      errorMessages.textFieldError
                        ? errorMessages.textFieldError
                        : ""
                    }
                  />
                )}
              />
            )}
          </div>
          {/* IN - OUT - SEARCH INPUT  */}

          <div className="in-out-search-box flex justify-between max-sm:flex-col gap-6 mt-4 px-2 py-2  max-sm:justify-center items-center">
            {/* /// IN - OUT INPUT   */}
            <div className="flex gap-1">
              <div className="check-in">
                <TextField
                  type="date"
                  label="Check-In"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={checkIn}
                  onChange={(e) =>
                    dispatch({ type: "SET_CHECK-IN", payload: e.target.value })
                  }
                  inputProps={{
                    min: getCurrentDate(),
                  }}
                  error={errorMessages.checkInError !== ""}
                  helperText={
                    errorMessages.checkInError ? errorMessages.checkInError : ""
                  }
                />
              </div>
              <div className="check-out ">
                <TextField
                  type="date"
                  label="Check-Out"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={checkOut}
                  onChange={(e) =>
                    dispatch({ type: "SET_CHECK-OUT", payload: e.target.value })
                  }
                  inputProps={{
                    min: getTommorrowsDate(),
                  }}
                  error={errorMessages.checkOutError !== ""}
                  helperText={
                    errorMessages.checkOutError
                      ? errorMessages.checkOutError
                      : ""
                  }
                />
              </div>
            </div>

            {/* /// ROOMS AND GUEST */}

            <div className="border py-2 border-stone-300 rounded-md w-full flex items-center">
              <CiUser size={20} className="ml-1" />
              <Button
                className="normal-case text-black text-base"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {`${rooms.length} Room${
                  rooms.length > 1 ? "s" : ""
                }, ${totalAdultsCount} Adult${
                  totalAdultsCount > 1 ? "s" : ""
                }`}{" "}
                {totalChildrenCount > 0 &&
                  `, ${totalChildrenCount} Children${
                    totalChildrenCount > 1 ? "s" : ""
                  }`}
              </Button>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                {rooms.map((roomCount, index) => (
                  <div key={index} className="w-60 p-4 flex flex-col gap-4">
                    <div
                      className={`${
                        index > 0 ? "border-t-2 border-dashed pt-2" : ""
                      } flex items-center justify-between`}
                    >
                      <p className="uppercase text-stone-500 text-sm font-semibold">
                        Room {roomCount}
                      </p>
                      <p
                        className={`${
                          index === 0 ? "hidden" : ""
                        } text-xs font-medium text-[#3366CC] cursor-pointer`}
                        onClick={() => {
                          dispatch({ type: "DELETE_ROOM", payload: index });
                        }}
                      >
                        Delete
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">Adults</p>
                        <p className="text-xs font-medium text-stone-500">
                          12+ years
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          disabled={guests?.at(index).adults === 1}
                          onClick={() =>
                            dispatch({
                              type: "SET_ADULTS_GUESTS",
                              payload: [index, "dec"],
                            })
                          }
                        >
                          <CiCircleMinus
                            size={30}
                            className={
                              guests?.at(index).adults === 1
                                ? "text-stone-400"
                                : ""
                            }
                          />
                        </button>
                        <p>{guests?.at(index).adults}</p>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "SET_ADULTS_GUESTS",
                              payload: [index, "inc"],
                            })
                          }
                        >
                          <CiCirclePlus
                            size={30}
                            className={
                              guests?.at(index).adults >= 4 ||
                              state.guests[index].adults +
                                state.guests[index].children >=
                                4
                                ? "text-stone-400"
                                : ""
                            }
                          />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">Children</p>
                        <p className="text-xs font-medium text-stone-500">
                          1 - 11 years
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          disabled={guests?.at(index).children === 0}
                          onClick={() => {
                            dispatch({
                              type: "SET_CHILDREN_GUESTS",
                              payload: [index, "dec"],
                            });
                          }}
                        >
                          <CiCircleMinus
                            size={30}
                            className={
                              guests?.at(index).children === 0
                                ? "text-stone-400"
                                : ""
                            }
                          />
                        </button>
                        <p>{guests?.at(index).children}</p>
                        <button
                          onClick={() => {
                            dispatch({
                              type: "SET_CHILDREN_GUESTS",
                              payload: [index, "inc"],
                            });
                          }}
                        >
                          <CiCirclePlus
                            size={30}
                            className={
                              guests?.at(index).children >= 4 ||
                              state.guests[index].adults +
                                state.guests[index].children >=
                                4
                                ? "text-stone-400"
                                : ""
                            }
                          />
                        </button>
                      </div>
                    </div>
                    <p
                      className={`text-sm text-[#3366CC] cursor-pointer ${
                        index === 5 ? "hidden" : ""
                      }`}
                      onClick={() => {
                        dispatch({ type: "SET_ADDED_ROOM" });
                      }}
                    >
                      <span className="text-xl font-light">+ </span>
                      <span className="font-semibold">Add another room</span>
                    </p>
                  </div>
                ))}
              </Popover>
            </div>
          </div>

          <div className="flex justify-end max-sm:justify-center">
            <Button
              variant="contained"
              className="normal-case hover:bg-[#D4581D] text-white text-sm font-bold  bg-[#FF4F17] mt-3 mr-3 py-4 px-16 rounded-lg"
              onClick={handleNavigate}
            >
              Search hotels
            </Button>
          </div>
        </div>
      </section>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover={false}
      />
    </>
  );
}
