import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import Tracker from "./Tracker";
import Collection from "./Collection";
import { useSelector } from "react-redux";

const App = () => {
  const view = useSelector((state) => state.view.value);
  const version = process.env.REACT_APP_VERSION;

  return (
    <div>
      {view === "collection" && <Collection />}
      <Tracker />
      <footer>v{version}</footer>
    </div>
  );
};

export default App;
