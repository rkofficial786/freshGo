import React from "react";
import Profile from "./Profile";

export const metadata = {
  title: "My Profile",
};

const page = () => {
  return (
    <div className="bg-theme3">
      <Profile />
    </div>
  );
};

export default page;
