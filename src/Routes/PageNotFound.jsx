import React, { useEffect } from "react";
import logo from "../assets/pngwing.com_404.png";

const PageNotFound = () => {
  return (
    <div className="mt-auto mb-auto">
      <div className="align-self-center justify-self-center">
        <div className="container mx-auto">
          <main className="form-signin m-auto" style={{ minWidth: "320px" }}>
            <div className="text-center text-dark">
              <img className="mb-4" src={logo} alt="" width="100%" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
