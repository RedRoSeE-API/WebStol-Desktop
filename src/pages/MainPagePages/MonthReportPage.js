import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import app from "../../custom/firebase";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import { GridLoader } from "react-spinners";

import PageHeader from "../../custom/Components/header";
import PageFooter from "../../custom/Components/footer";
import "../../styles/MonthReportPage.css";

const db = getFirestore(app);
const dbInfoCollection = collection(db, "dbInfo");

export default function MonthReport() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [updateBoolean, setUpdateBoolean] = useState(false);
  const [dayForMonthlyReportV, setDayForMonthlyReportV] = useState("");
  const [dayForMonthlyReportDisplay, setDayForMonthlyReportDisplay] = useState("");
  const [systemPauseDateFromV, setSystemPauseDateFromV] = useState("");
  const [systemPauseDateFromDisplay, setSystemPauseDateFromDisplay] = useState("");
  const [systemPauseDateToV, setSystemPauseDateToV] = useState("");
  const [systemPauseDateToDisplay, setSystemPauseDateToDisplay] = useState("");

  useEffect(() => {
    getDatesForReports();
  },[updateBoolean])

  const getDatesForReports = async () => {
    const docRefMR = doc(dbInfoCollection, "monthReport");
    const docRefSP = doc(dbInfoCollection, "systemPause");

    await getDoc(docRefMR).then((res) => {
      let dateForMonthlyReport = new Date();
      if(res.data().dayForMonthlyReport >= 1 && res.data().dayForMonthlyReport <= 31){
        dateForMonthlyReport.setDate(res.data().dayForMonthlyReport);
        setDayForMonthlyReportDisplay(`${dateForMonthlyReport.getDate(res.data().dayForMonthlyReport)}/${dateForMonthlyReport.getMonth() + 1}/${dateForMonthlyReport.getFullYear()}`);
      }else{
        setDayForMonthlyReportDisplay("Въведи дата от 1-ви до 31-ви");
      }
    })

    await getDoc(docRefSP).then((res) => {
      let dateSystemPauseDateFrom = new Date();
      let dateSystemPauseDateTo = new Date();


      if(res.data().systemPauseDateFROM >= 1 && res.data().systemPauseDateFROM <= 31){
        dateSystemPauseDateFrom.setDate(res.data().systemPauseDateFROM)
        setSystemPauseDateFromDisplay(`${dateSystemPauseDateFrom.getDate(res.data().systemPauseDateFROM)}/${dateSystemPauseDateFrom.getMonth() + 1}/${dateSystemPauseDateFrom.getFullYear()}`)
      }else{
        setSystemPauseDateFromDisplay("Въведи дата от 1-ви до 31-ви");
      }
      if(res.data().systemPauseDateTO >= 1 && res.data().systemPauseDateTO <= 31){
        dateSystemPauseDateTo.setDate(res.data().systemPauseDateTO)
        setSystemPauseDateToDisplay(`${dateSystemPauseDateTo.getDate(res.data().systemPauseDateTO)}/${dateSystemPauseDateTo.getMonth() + 1}/${dateSystemPauseDateTo.getFullYear()}`)
      }else{
        setSystemPauseDateToDisplay("Въведи дата от 1-ви до 31-ви");
      }
      
    })
  }

  const SetNewDayForMonthlyReport = () => {
    if (dayForMonthlyReportV === "") return;

    setLoading(true);

    const docRef = doc(dbInfoCollection, "monthReport");

    updateDoc(docRef, {
      dayForMonthlyReport: Number(dayForMonthlyReportV),
    }).then(() => {
      setLoading(false);
      setDayForMonthlyReportV("");
      setUpdateBoolean(!updateBoolean);
    });
  };
  const SetSystemPauseDateFrom = () => {
    if (systemPauseDateFromV === "") return;

    setLoading(true);

    const docRef = doc(dbInfoCollection, "systemPause");

    updateDoc(docRef, {
      systemPauseDateFROM: Number(systemPauseDateFromV),
    }).then(() => {
      setLoading(false);
      setSystemPauseDateFromV("");
      setUpdateBoolean(!updateBoolean);
    });
  };
  const SetSystemPauseDateTo = () => {
    if (systemPauseDateToV === "") return;

    setLoading(true);

    const docRef = doc(dbInfoCollection, "systemPause");

    updateDoc(docRef, {
      systemPauseDateTO: Number(systemPauseDateToV),
    }).then(() => {
      setLoading(false);
      setSystemPauseDateToV("");
      setUpdateBoolean(!updateBoolean);
    });
  };

  const goToMainPage = () => {
    navigate("/mainPage");
  };

  return (
    <div className={!loading ? null : "disable-events"}>
      {!loading ? null : (
        <GridLoader className="loader" color="#1D566B" size={30} />
      )}
      <div className={!loading ? null : "opacity-container"}>
        <div className="month__report--content-div">
          <main className="main__section--MonthReportPage">
            <PageHeader />
            <div className="there__was--no-div-but-i-wanted-padding-top-and-bottom ">
              <div className="month__report-df">
              <IconButton className="arrow-back  back-icon" aria-label="delete" size="small" onClick={goToMainPage}>
            <ArrowBackIcon />
          </IconButton>
                <div></div>
                <div></div>
              </div>
              <div className="main__section--MonthReportPage-div">
                
                <div className="column-month">
                  <div className="label-content">
                    <label>Пауза-начална дата</label>
                  </div>
                  <h2  className="dateToday">Текуща дата - {systemPauseDateFromDisplay}</h2>
                  <input
                    type="number"
                    className="input"
                    placeholder="Дата:"
                    value={systemPauseDateFromV}
                    onChange={(e) => setSystemPauseDateFromV(e.target.value)}
                  />
                  <button
                    className="btn-changes"
                    onClick={SetSystemPauseDateFrom}
                  >
                    {" "}
                    Промени дата
                  </button>
                </div>
                <div className="column-month">
                  <div className="label-content">
                    <label>Пауза-крайна дата</label>
                  </div>
                  <h2 className="dateToday">Текуща дата - {systemPauseDateToDisplay}</h2>
                  <input
                    type="number"
                    className="input"
                    placeholder="Дата:"
                    value={systemPauseDateToV}
                    onChange={(e) => setSystemPauseDateToV(e.target.value)}
                  />
                  <button
                    className="btn-changes"
                    onClick={SetSystemPauseDateTo}
                  >
                    {" "}
                    Промени дата
                  </button>
                </div>
                <div className="column-month">
                  <div className="label-content">
                    <label>Дата за месечен отчет</label>
                  </div>
                  <h2 className="dateToday">Текуща дата - {dayForMonthlyReportDisplay}</h2>
                  <input
                    type="number"
                    className="input"
                    placeholder="Дата:"
                    value={dayForMonthlyReportV}
                    onChange={(e) => setDayForMonthlyReportV(e.target.value)}
                  />
                  <button
                    className="btn-changes"
                    onClick={SetNewDayForMonthlyReport}
                  >
                    {" "}
                    Промени дата{" "}
                  </button>
                </div>
              </div>
            </div>
            <PageFooter />
          </main>
        </div>
      </div>
    </div>
  );
}
