import React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { useSelector, useDispatch } from "react-redux";
import { setToTracker } from "./store/viewSlice";

import flyingKitty from "./img/flying_kitty.png";

import "swiper/css";
import "swiper/css/effect-cards";

const Collection = () => {
  const dispatch = useDispatch();

  const collection = JSON.parse(localStorage.getItem("collection")) || [];
  const closeCollection = () => {
    dispatch(setToTracker());
  };

  function Aircraft({ flightData }) {
    return (
      <div>
        <img
          src={flightData.aircraft.url_photo ?? flyingKitty}
          height="150"
        ></img>
        <ul>
          <li>
            <h5>
              <b>
                {flightData.aircraft.manufacturer}
                <span> </span>
                {flightData.aircraft.type}
              </b>
            </h5>
          </li>
          <li>
            <span>
              <i>tag</i>
              <span> </span>
              <b>
                {flightData.callsign.length > 2 ? flightData.callsign : "N/A"}
              </b>
            </span>
          </li>
          <li>
            <span>
              <i>airlines</i>
              <span> </span>
              <b>{flightData.airline ?? "N/A"}</b>
            </span>
          </li>
          <li>
            <span>
              <i>flight_takeoff</i>
              <span> </span>
              <b>{flightData.departure ?? "N/A"}</b>
            </span>
          </li>
          <li>
            <span>
              <i>flight_land</i>
              <span> </span>
              <b>{flightData.arrival ?? "N/A"}</b>
            </span>
          </li>
        </ul>
      </div>
    );
  }

  if (collection.length) {
    return (
      <div className="collection-overlay App">
        <div className="full-width right-align">
          <button
            className="toggle-page bottom-margin"
            onClick={closeCollection}
          >
            <i>close</i>
          </button>
        </div>
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
          style={{ marginTop: 70 }}
        >
          {collection.map((item, index) => {
            console.log(item);

            return (
              <SwiperSlide>
                <article className="card bottom-margin">
                  <Aircraft flightData={item} key={index}></Aircraft>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  } else {
    return (
      <div className="collection-overlay App">
        <button className="toggle-page" onClick={closeCollection}>
          <i>close</i>
          <span>Close</span>
        </button>
        <h5 style={{ marginTop: 70 }}>
          You don't have any saved flights {">:("}
        </h5>
      </div>
    );
  }
};

export default Collection;
