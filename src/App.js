/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import Refresh from "./refresh.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeChart, makeWaterData } from "./utils.js";
import ReactLoading from "react-loading";
import ReactSelect from "./ReactSelect.js";
function App({ setUserAuthorized }) {
  const url =
    "https://8h19xk09w6.execute-api.us-west-2.amazonaws.com/default/e_water_quality_multiple_sensors";
  const [waterData, setWaterData] = useState(null);
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);
  const [chart3, setChart3] = useState(null);
  const [liveData, setLiveData] = useState({});
  const [refresh, setRefresh] = useState(false);
  // const [limit, setLimit] = useState(30);
  const [vw, setVw] = useState();
  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("last_day");
  const [sensor, setSensor] = useState("WQ101");

  const destroyCharts = (i) => {
    if (i === 1) chart1 && chart1.destroy();
    else if (i === 2) chart2 && chart2.destroy();
    else if (i === 3) chart3 && chart3.destroy();
    setVw((0.8 * Math.min(window.innerWidth, window.screen.width)) / 100);
    setIndex(window.screen.width > 700);
  };
  // const handleLimitChange = (e) => {
  //   setLimit(e.target.value);
  // };

  useEffect(() => {
    const headers = {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken:ehsan"),
    };
    let x = `${url}?sensor_id=${sensor}&period=${period}`;
    setLoading(true);
    console.log(headers);
    axios
      .get(x, {
        headers: headers,
      })
      .then((response) => {
        const newData = makeWaterData(response.data, period, "time_stamp");
        setWaterData(newData);
        setLoading(false);
      });
  }, [refresh, period, sensor]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefresh(!refresh);
    }, 59 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [refresh]);

  useEffect(() => {
    const last_index = waterData && waterData.dataLabels.length - 1;
    waterData &&
      setLiveData({
        dataLabels: waterData.dataLabels[last_index],
        tds: waterData.tds[last_index],
        cod: waterData.cod[last_index],
        bod: waterData.bod[last_index],
        ph: waterData.ph[last_index],
        temp: waterData.temp[last_index],
        ec: waterData.ec[last_index],
        dio: waterData.dio[last_index],
      });
  }, [waterData]);

  useEffect(() => {
    destroyCharts(1);
    let chartType = ["line", "line", "line", "line"];
    waterData &&
      setChart1(
        makeChart(
          "c1",
          "DO, COD, BOD and pH",
          waterData.dataLabels,
          index
            ? [
                "DO mg/L         ",
                "COD mg/L          ",
                "BOD mg/L          ",
                "pH          ",
              ]
            : ["DO mg/L", "COD mg/L", "BOD mg/L", "pH"],

          ["", "", "", "1"],
          [waterData.dio, waterData.cod, waterData.bod, waterData.ph],
          chartType,
          ["#ff5e00", "#ff006f", "#0062ff", "#17fc54"],
          vw,
          index ? "x" : "y"
        )
      );
  }, [waterData]);

  useEffect(() => {
    destroyCharts(2);
    let chartType = ["line", "line"];
    waterData &&
      setChart2(
        makeChart(
          "c2",
          "Electrical conductivity and TDS",
          waterData.dataLabels,
          index
            ? ["Electrical conductivity mS/cm          ", "TDS ppm          "]
            : ["Electrical conductivity mS/cm", "TDS ppm"],
          ["", "1"],
          [waterData.ec, waterData.tds],
          chartType,
          ["#17fc54", "#595bd9"],
          vw,
          index ? "x" : "y"
        )
      );
  }, [waterData]);

  useEffect(() => {
    destroyCharts(3);
    let chartType = ["line"];
    waterData &&
      setChart3(
        makeChart(
          "c3",
          "Temperature",
          waterData.dataLabels,
          index ? ["Temperature ºC          "] : ["Temperature ºC"],
          [""],
          [waterData.temp],
          chartType,
          ["#ff5e00"],
          vw,
          index ? "x" : "y"
        )
      );
  }, [waterData]);
  const handleSensorChange = (e) => {
    setSensor(e.value);
  };
  return (
    <div className="App dark">
      <header className="App-header">
        <span className="title">
          WATER &nbsp; QUALITY &nbsp; MONITORING &nbsp; SYSTEM
        </span>
        <span className="userEmailHolder">
          <span className="userEmail">
            {getDataFromJWT(localStorage.getItem("accessToken:ehsan")).email}
          </span>
          <span
            className="logout"
            onClick={() => {
              localStorage.clear();
              setUserAuthorized(false);
            }}
          >
            Logout
            {/* <img src={loginLogo}></img> */}
          </span>
        </span>
      </header>
      <div id="tabHolder" className="tabHolder">
        <div id="selectSensor">
          <span>SENSOR ID</span>
          <div id="selectSensorInput">
            <ReactSelect
              accOpts={["WQ101", "WQ102", "WQ103", "WQ104", "WQ105", "WQ106"]}
              handleChange={handleSensorChange}
              them={1}
              vw={vw}
            />
          </div>
        </div>

        <div id="periodHolder">
          <div
            id="period1"
            className={"tab " + (period === "last_day" ? "selected" : "")}
            onClick={() => {
              setPeriod("last_day");
            }}
          >
            DAY
          </div>
          <div
            id="period2"
            className={"tab " + (period === "last_week" ? "selected" : "")}
            onClick={() => {
              setPeriod("last_week");
            }}
          >
            WEEK
          </div>
          <div
            id="period3"
            className={"tab " + (period === "last_month" ? "selected" : "")}
            onClick={() => {
              setPeriod("last_month");
            }}
          >
            MONTH
          </div>
          <div
            id="period4"
            className={"tab " + (period === "last_year" ? "selected" : "")}
            onClick={() => {
              setPeriod("last_year");
            }}
          >
            YEAR
          </div>
        </div>
      </div>
      <div className="graphHolder">
        <div id="g1" className="graph">
          {loading ? (
            <div id="loading">
              <ReactLoading type={"bars"} color={"#2980b9"}></ReactLoading>
            </div>
          ) : (
            <>
              <div id="liveTitle">
                <span className="liveTitleText">LIVE DATA</span>
                <span className="options">
                  <img
                    id="refresh"
                    src={Refresh}
                    alt="refresh icon"
                    onClick={() => {
                      setRefresh(!refresh);
                    }}
                  ></img>
                  {/* <button className="chartTypeButton" onClick={handleChartType}>
                    {type ? "BAR" : "LINE"}
                  </button> */}
                  {/* <span id="limitHolder">
                    <span>{limit}</span>
                    <input
                      type="range"
                      id="limitRange"
                      min="10"
                      max="100"
                      step="10"
                      value={limit}
                      onChange={handleLimitChange}
                    />
                  </span> */}
                </span>
              </div>
              <div className="liveDataHolder">
                <div id="ld0">
                  <span>Time :</span>{" "}
                  <span className="liveDataValue">
                    {liveData && liveData.dataLabels}
                  </span>
                </div>
                <div id="ld1">
                  <span>Temperature : </span>
                  <span className="liveDataValue">
                    {liveData && liveData.temp} ºC
                  </span>
                  <span> pH : </span>
                  <span className="liveDataValue">
                    {liveData && parseFloat(liveData.ph).toFixed(3)}
                  </span>
                </div>
                <div id="ld2">
                  <span> TDS : </span>
                  <span className="liveDataValue">
                    {liveData && parseFloat(liveData.tds).toFixed(2)} ppm
                  </span>
                </div>
                <div id="ld3">
                  <span> BOD : </span>
                  <span className="liveDataValue">
                    {liveData && parseFloat(liveData.bod).toFixed(2)} mg/L
                  </span>
                </div>
                <div id="ld4">
                  <span> COD : </span>
                  <span className="liveDataValue">
                    {liveData && parseFloat(liveData.cod).toFixed(2)} mg/L
                  </span>
                </div>
                <div id="ld5">
                  <span>DO : </span>
                  <span className="liveDataValue">
                    {liveData && parseFloat(liveData.dio).toFixed(2)} mg/L
                  </span>
                </div>
                <div id="ld6">
                  <span>Electrical Conductivity : </span>
                  <span className="liveDataValue">
                    {liveData && parseFloat(liveData.ec).toFixed(3)} mS/cm
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div id="g2" className="graph">
          <div className="chart">
            <canvas id="c1"></canvas>
          </div>
        </div>
        <div id="g3" className="graph">
          <div className="chart">
            <canvas id="c2"></canvas>
          </div>
        </div>
        <div id="g4" className="graph">
          <canvas id="c3"></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;

const checkToken = () => {
  let expiryTime = getDataFromJWT(
    localStorage.getItem("accessToken:ehsan")
  )?.exp;

  let now = new Date().getTime() / 1000;
  if (now > expiryTime) return false;
  return true;
};

function getDataFromJWT(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");

  return JSON.parse(window.atob(base64));
}
