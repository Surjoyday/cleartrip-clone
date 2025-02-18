// const base_URL = process.env.REACT_APP_API_URL;
const base_URL = import.meta.env.VITE_APP_API_URL;

const PROJECT_ID = import.meta.env.VITE_APP_PROJECT_ID;

const HEADERS = {
  "Content-Type": "application/json",
  // projectId: process.env.REACT_APP_PROJECT_ID,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
};

/**
 *
 * @returns year-month-day
 */

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // ensuring that month have always has 2 digits
  const day = String(currentDate.getDate()).padStart(2, "0"); // ensuring that day have always has 2 digits
  return `${year}-${month}-${day}`;
}

function getTommorrowsDate() {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate() + 1;

  // console.log("day", day);

  /// 0 means last day of the previous month

  if (day > new Date(year, month, 0).getDate()) {
    day = 1;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  // console.log(new Date(year, month, 0).getDate());
  // console.log(month);

  month = String(month).padStart(2, "0");
  day = String(day).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDayOfWeek(date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(date);
}

function formatDates(date) {
  const formatedDate = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  }).format(date);

  return `${formatedDate}`;
}

function formatDatesForDetailsPage(date) {
  const formatedDate = new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);

  const parts = formatedDate.split(" ");
  return `${parts[0]} ${parts[2]} ${parts[1]}`;
}

/// CREATING CURRENT TIME FOR DEFAULT VALUE NOT EXPORTING

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatDateTimeISOString(date, time = getCurrentTime()) {
  const dateReceived = new Date(date);

  const [hoursReceived, minutesReceived] = time.split(":");

  dateReceived.setHours(hoursReceived);
  dateReceived.setMinutes(minutesReceived);

  const ISOString = dateReceived.toISOString();

  return ISOString;
}

function calcTotalNights(checkIn, checkOut) {
  const oneDay = 24 * 60 * 60 * 1000;
  const totalNights = Math.round(Math.abs((checkOut - checkIn) / oneDay));

  return totalNights;
}

const moreOffers = [
  {
    id: crypto.randomUUID(),
    title: "No Cost EMI Offers!",
    para: "Pay Interest Free EMI with HDFC, ICICI, SBI, AXIS, KOTAK Bank Cards!",
  },
  {
    id: crypto.randomUUID(),
    title: "Domestic hotel offer!",
    para: "Get upto 25% Off on hotels",
  },
  {
    id: crypto.randomUUID(),
    title: "Last Minute Deals!",
    para: "Upto 40% off on Hotels for check-ins today & tomorrow",
  },
];

const popularDestinationsImages = [
  {
    src: "https://ucarecdn.com/3ec4bcc7-7487-40ba-84cf-d20a3abcc67a/AmritsarDestinationImg.png",
    alt: "amritsaroa-popular-destination-img",
    place: "Amritsar",
    properties: "3051", /// fights to the destination that are available through the Cleartrip API.
    id: crypto.randomUUID(),
    cityCode: "ATQ",
    city: "Amritsar",
    country: "India",
  },
  {
    src: "https://ucarecdn.com/a091c2b0-c446-4363-8f48-23006e703eb2/CoimbatoreDestinationImg.png",
    alt: "Coimbatore-popular-destination-img",
    place: "Coimbatore",
    properties: "1805",
    id: crypto.randomUUID(),
    cityCode: "CJB",
    city: "Coimbatore",
    country: "India",
  },
  {
    src: "https://ucarecdn.com/e2c3a85e-1e97-4b85-9503-6355b7e88d19/JaipurDestination.jpg",
    alt: "Jaipur-popular-destination-img",
    place: "Jaipur",
    properties: "920",
    id: crypto.randomUUID(),
    cityCode: "JAI",
    city: "Jaipur",
    country: "India",
  },

  {
    src: "https://ucarecdn.com/3f287750-4f91-4847-bb5b-d00206b482c7/DelhiDestination.jpg",
    alt: "delhi-popular-destination-img",
    place: "Delhi",
    properties: "2435",
    id: crypto.randomUUID(),
    cityCode: "DEL",
    city: "Delhi",
    country: "India",
  },
  {
    src: "https://ucarecdn.com/8871c285-40b4-43bb-860b-5a9631c49296/BangaloreDestination.jpg",
    alt: "bangalore-popular-destination-img",
    place: "Bangalore",
    properties: "2500",
    id: crypto.randomUUID(),
    cityCode: "BLR",
    city: "Bangalore",
    country: "India",
  },
];

const appOfferImage = {
  src: "https://rukmini-ct.flixcart.com/f_auto,q_auto/offermgmt-prod/offermgmt/images/banner/ctapp_F_2711.jpg",
  alt: "App-Offer-Img",
};

const airlineComapanies = {
  vistara: "65144a1b664a43628887c460",

  indigo: "65144a1b664a43628887c45e",

  airIndia: "65144a1b664a43628887c45d",

  spiceJet: "65144a1b664a43628887c45f",

  goFirst: "65144a1b664a43628887c461",
};

const airlineComapaniesForMyTrips = {
  Vistara: "65144a1b664a43628887c460",

  IndiGo: "65144a1b664a43628887c45e",

  AirIndia: "65144a1b664a43628887c45d",

  SpiceJet: "65144a1b664a43628887c45f",

  GoFirst: "65144a1b664a43628887c461",
};

const airlineImages = {
  "6E": [
    "https://ucarecdn.com/5b934384-88e9-4ba3-9374-dc4b0e602fda/6E1.svg",
    "IndiGo",
  ],
  UK: [
    "https://ucarecdn.com/251a0c80-a094-4530-a7eb-8023f61d0c56/UK.svg",
    "Vistara",
  ],
  G8: [
    "https://ucarecdn.com/b419b851-0b6f-4d2a-99e4-84900fd9c307/G8_xfgcwx.png",
    "GoFirst",
  ],
  AI: [
    "https://ucarecdn.com/f952e714-cb13-4e14-92ff-f3a3a1a6281b/AI.svg",
    "AirIndia",
  ],
  SG: [
    "https://ucarecdn.com/b4a99dad-c856-4ef4-b82c-1b97c269771e/SG.svg",
    "SpiceJet",
  ],
};

export {
  airlineImages,
  base_URL,
  HEADERS,
  PROJECT_ID,
  getCurrentDate,
  getTommorrowsDate,
  moreOffers,
  appOfferImage,
  popularDestinationsImages,
  getDayOfWeek,
  formatDates,
  airlineComapanies,
  formatDatesForDetailsPage,
  formatDateTimeISOString,
  airlineComapaniesForMyTrips,
  calcTotalNights,
};
