import React from "react";
import "./App.css";
import MainRoutes from "./Routes.jsx";
import Appbar from "./components/Appbar/Appbar.jsx";
import SnackBar from "./components/common/Snackbar/SnackBar.jsx";

function App() {
  return (
    <div className="app-bg">
      <div className="app">
        <SnackBar />
        {/** Appbar  */}
        <Appbar />

        {/** All inner Dashboard page */}
        <MainRoutes />
      </div>
    </div>
  );
}

export default App;
