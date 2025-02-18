import AboutSite from "../components/AboutSite";
import Footer from "../components/Footer";

import OffersCarousel from "../components/OffersCarousel";
import SideNavbar from "../components/SideNavbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isPopOverOpen } = useAuth();
  return (
    <>
      <section className="home flex max-sm:flex-col max-sm:gap-4 gap-14 px-10 max-sm:px-2 mt-10 bg-white">
        <SideNavbar />
        {/* <div className="flex max-sm:w-full flex-col w-min"> */}
        <div className="flex max-sm:w-full flex-col w-min">
          <div className="outlet-offercarousel flex justify-around gap-7 max-sm:flex-col">
            <Outlet />
            <OffersCarousel />
          </div>
          <AboutSite />
        </div>
      </section>
    </>
  );
}

export default Home;
