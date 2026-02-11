import React from "react";
import { useEffect, useState } from "react";
import logo from "./logo.png";
import "./App.css";
import JSConfetti from "js-confetti";

import sadKitty from "./img/sad-kitty.jpeg";
import shockedKitty from "./img/shocked-kitty.jpeg";
import gaggedKitty from "./img/gagged-kitty.jpeg";

const App = () => {
  const jsConfetti = new JSConfetti();
  const [userCoord, setUserCoord] = useState([]);
  const [bbox, setBbox] = useState({});
  const [aircraftData, setAircraftData] = useState(null);
  const [airline, setAirline] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [unknown, setUnknown] = useState(false);
  const [kittySrc, setKittySrc] = useState(null);

  const getBbox = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoord([pos.coords.latitude, pos.coords.longitude]);
        console.log(userCoord);
        const userBbox = {
          lamin: 46.4318173285,
          lomin: 9.47996951665,
          lamax: 49.0390742051,
          lomax: 16.9796667823,
          // lamin: (pos.coords.latitude - 0.07).toFixed(4),
          // lomin: (pos.coords.longitude - 0.07).toFixed(4),
          // lamax: (pos.coords.latitude + 0.07).toFixed(4),
          // lomax: (pos.coords.longitude + 0.07).toFixed(4),
        };
        setBbox(userBbox);
      },
      (err) => {},
    );
  };

  const getNearestFlight = (flights) => {
    let nearest;
    if (flights.length === 1) {
      nearest = {
        icao24: flights[0][0],
        callsign: flights[0][1],
        diff:
          Math.abs(flights[0][6] - userCoord[0]) +
          Math.abs(flights[0][5] - userCoord[1]),
      };
      console.log(nearest);
      return nearest;
    } else {
      let diffs = [];
      flights.forEach((flight) => {
        diffs.push({
          icao24: flight[0],
          callsign: flight[1],
          diff:
            Math.abs(flight[6] - userCoord[0]) +
            Math.abs(flight[5] - userCoord[1]),
        });
      });
      nearest = diffs.reduce((prev, curr) =>
        prev.diff < curr.diff ? prev : curr,
      );
      return nearest;
    }
  };

  const getAircraft = (icao24, callsign) => {
    fetch(`https://api.adsbdb.com/v0/aircraft/${icao24}?${callsign}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.response === "unknown aircraft") {
          setUnknown(true);
          setKittySrc(gaggedKitty);
          setAirline("N/A");
        } else {
          console.log(data.response);
          setAircraftData({
            aircraft: data.response.aircraft,
            callsign: callsign.replaceAll(" ", ""),
          });
          setAirline(data.response.aircraft.registered_owner);
          setKittySrc(shockedKitty);
          jsConfetti.addConfetti({
            confettiColors: [
              "#ff0a54",
              "#ff477e",
              "#ff7096",
              "#ff85a1",
              "#fbb1bd",
              "#f9bec7",
            ],
          });
        }
      });
  };

  const getFlightPath = (callsign) => {
    fetch(
      `https://api.aviationstack.com/v1/flights?flight_icao=${callsign}&access_key=${process.env.REACT_APP_AVIATIONSTACK_KEY}&limit=1`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data.length) {
          console.log(data.data);
          setDeparture(data.data[0].departure.airport.split(" ")[0]);
          setArrival(data.data[0].arrival.airport.split(" ")[0]);
        } else {
          setDeparture("N/A");
          setArrival("N/A");
        }
      });
  };

  const getFlightData = (bbox) => {
    if (Object.keys(bbox).length) {
      console.log(bbox);
      fetch(
        "https://opensky-network.org/api/states/all?" +
          new URLSearchParams(bbox).toString(),
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.states) {
            const nearest = getNearestFlight(data.states);
            getAircraft(nearest.icao24, nearest.callsign);
          } else {
            setKittySrc(sadKitty);
            setAircraftData(null);
          }
        });
    }
  };

  function Button() {
    if (aircraftData || unknown) {
      return (
        <div>
          <a
            href={`https://flightradar24.com/${aircraftData?.callsign ?? ""}`}
            target="_blank"
            rel="noreferrer"
          >
            <button className="primary extra">
              <i>travel</i>
              <span>Track in FlightRadar24</span>
            </button>
          </a>
        </div>
      );
    } else if (!aircraftData) {
      return (
        <a href="https://flightradar24.com" target="_blank" rel="noreferrer">
          <button className="primary extra">
            <i>travel</i>
            <span>Open FlightRadar24</span>
          </button>
        </a>
      );
    }
  }

  function Aircraft() {
    if (unknown) {
      return (
        <div>
          <b>
            It's a plane, but I'm not sure what kind :( Follow it on
            FlightRadar24 for more info...
          </b>
        </div>
      );
    } else if (aircraftData) {
      return (
        <div>
          <p>
            <b>
              It's a(n) {aircraftData.aircraft.manufacturer}
              <span> </span>
              {aircraftData.aircraft.type}!!
            </b>
          </p>
          <ul>
            <li>
              <span>
                <i>airlines</i> Airline:{" "}
              </span>
              <span>
                <b>{airline}</b>
              </span>
            </li>
            <li>
              <span>
                <i>flight_takeoff</i> Departure:
              </span>
              <span>
                <b>{departure}</b>
              </span>
            </li>
            <li>
              <span>
                <i>flight_land</i> Arrival:{" "}
              </span>
              <span>
                <b>{arrival}</b>
              </span>
            </li>
          </ul>
          <img
            src={aircraftData.aircraft.url_photo}
            height={aircraftData.aircraft.url_photo ? "100" : "0"}
          ></img>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            <b>It's not a plane :(</b>
          </p>
        </div>
      );
    }
  }

  useEffect(() => {
    getBbox();
  }, []);

  useEffect(() => {
    getFlightData(bbox);
  }, [bbox]);

  useEffect(() => {
    if (aircraftData?.callsign) {
      getFlightPath(aircraftData.callsign);
    }
  }, [aircraftData]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>What's that sound&nbsp;??</h1>
      </header>
      <img className="bottom-margin" src={kittySrc} height="150"></img>
      <article className="card bottom-margin">
        <Aircraft></Aircraft>
      </article>
      <Button></Button>
    </div>
  );
};

export default App;
