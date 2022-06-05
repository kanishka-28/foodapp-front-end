import React from "react";
import { Outlet } from "react-router-dom";
import FoodTab from "../../components/FoodTab/FoodTab";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
  return (
    <>
      <div className="container  mx-auto lg:px-20">
        <Navbar />
        <FoodTab/>
        <Outlet />
      </div>
    </>
  );
};

export default Home;