import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import Tracker from "./Tracker";
import Collection from "./Collection";
import { useSelector } from "react-redux";

const App = () => {
  const view = useSelector((state) => state.view.value);

  return (
    <div>
      {view === "collection" && <Collection />}
      <Tracker />
    </div>
  );
};

export default App;
