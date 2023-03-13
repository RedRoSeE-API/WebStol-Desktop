import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../../AuthContext";

import app from "../../../custom/firebase";
  import {
    getFirestore,
    doc,
    updateDoc,
    collection,
    getDocs,
    getDoc,
    query,
    where,
  } from "firebase/firestore";
  
import "../../../styles/DisplayUsersList.css";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const db = getFirestore(app);
const dbUsersUIDcollection = collection(db, "usersUID");
const dbMealsCollection = collection(db, "meals");
const dbInfoCollection = collection(db, "dbInfo");


export default function DisplayUsersList({
  setDisplayUsersListLoading,
  setDisplayUsersListLoading2,
  boolean,
  setBoolean,
   Set_UL_CC_GetEatNumber_Loading,
}) {
  const { _TIME } = useAuth();

  const [priceToday, setPriceToday] = useState();
  const [priceYesterday, setPriceYesterday] = useState();
  const [usersInfo, setUsersInfo] = useState([]);
  const [usersClass, setUsersClass] = useState(1);
  const [eatNumberForTomorrow, setEatNumberForTomorrow] = useState();
  const [eatNumberForToday, serEatNumberForToday] = useState();

  useEffect(() => {
    getUsers();
    getPrice();
    GetEatNumber();
  }, [boolean]);

  const GetEatNumber = async () => {
    let eatNumberLet = 0;
    const q = query(dbUsersUIDcollection, where("EatTrueFalse", "==", true));

    await getDocs(q).then((res) => {
      res.forEach(() => {
        eatNumberLet++;
      });
      setEatNumberForTomorrow(eatNumberLet);
    });

    const docRef = doc(dbInfoCollection, "eatTimesForToday");

    await getDoc(docRef).then((doc) => {
      serEatNumberForToday(doc.data().eatTimesForToday);
    });

  };


  const getUsers = async () => {

    const q = query(dbUsersUIDcollection);
    const querySnapshot = await getDocs(q);
    setUsersInfo([]);
    querySnapshot.forEach((doc) => {
      if (doc.data().role === "student") {
        let updatedValue = doc.data();
        updatedValue.docID = doc.id;
        setUsersInfo((usersInfo) => [...usersInfo, updatedValue]);
      }
      setDisplayUsersListLoading2(false);
    });

  };

  const getPrice = async () => {
    let docRefToday;
    let docRefYesterday;

    if (_TIME >= 1 && _TIME <= 5) {
      docRefToday = doc(dbMealsCollection, `${_TIME}`);
      _TIME === 1
        ? (docRefYesterday = doc(dbMealsCollection, "5"))
        : (docRefYesterday = doc(dbMealsCollection, `${_TIME - 1}`));
    } else {
      docRefToday = doc(dbMealsCollection, "1");
      docRefYesterday = doc(dbMealsCollection, "5");
    }

    getDoc(docRefToday).then((res) => {
      setPriceToday(res.data().price);
    });

    getDoc(docRefYesterday).then((res) => {
      console.log(res.data());
      setPriceYesterday(res.data().price);
    });
  };

  function EatOrNotForDisplayUsers({ eatTrueOrFalse }) {
    if (eatTrueOrFalse) {
      return <p className="student-div-middle">Записан/а</p>;
    } else {
      return <p className="student-div-middle">Не е записан/а</p>;
    }
  }

  function DisplayUsers() {
    usersInfo.sort((a, b) => a.numberInClass - b.numberInClass);

    let newUsersInfo = usersInfo.filter((user) => user.class === usersClass);
    return (
      <div className="map-div">
        {newUsersInfo.map((item) => (
          <div className="student-div" key={item.numberInClass}>
            <div className="student-div-left">
              <div className="df-users-name">
                <p id="number">№ {item.numberInClass}</p>
                <p id="name">{item.fullName}</p>
              </div>
            </div>

            <EatOrNotForDisplayUsers eatTrueOrFalse={item.EatTrueFalse} />

         
            <div className="student-div-middle-2">
              <button className="btn shadow-none" onClick={ButtonYES(item)}>
                Да
              </button>
              <button className="btn shadow-none" onClick={ButtonNO(item)}>
                Не
              </button>
            </div>

            <div className='student-div-middle-3'>
                  {/* <p className="student-div-middle-title">Добави?</p> */}
                    <button className="btn shadow-none" onClick={ButtonYES_PLUS(item)}>+</button>
                    <button className="btn shadow-none" onClick={ButtonNO_MINUS(item)}>-</button>
            </div>

            <div className="student-div-middle-4">
            <p className="student-div-middle-title">Този месец:</p>
              <p>{(item.PriceDueThisMont).toFixed(2)}лв.</p>
            </div>

            <div className="student-div-middle-4">
            <p className="student-div-middle-title">Обядвал до сега:</p>
            {item.EatTimesThisMonth === 1 ? (
               <p> {item.EatTimesThisMonth} път</p>
            ): (

              <p>{item.EatTimesThisMonth} пъти</p>
            )}
            </div>

            <div className="student-div-middle-5">
            <p className="student-div-middle-title">Дължи общо:</p>
              {item.PricePaid === true ? (
                <p className="price-paid">{(item.PriceMustPay).toFixed(2)}лв.</p>
              ) : (
                <p className="price-not-paid">{(item.PriceMustPay).toFixed(2)}лв.</p>
              )}
            </div>

            <div className="student-div-right">
              <button className="btn shadow-none" onClick={ButtonPaid(item)}>
                Платено
              </button>
              <button className="btn shadow-none" onClick={ButtonNotPaid(item)}>
                Неплатено
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const ButtonYES = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);

      getDoc(docRef)
        .then((res) => {
          if (!res.data().EatTrueFalse) {
            setDisplayUsersListLoading(true);
            updateDoc(docRef, {
              EatTrueFalse: true,
              EatTimesThisMonth: res.data().EatTimesThisMonth + 1,
              PriceDueThisMont: res.data().PriceDueThisMont + priceToday,
            })
              .then(() => {
                setDisplayUsersListLoading(false);
                setBoolean(!boolean);
              })
              .catch((err) => console.log(err));

            if (!res.data().CheckIndicatorBoolean) {
              updateDoc(docRef, {
                CheckIndicatorBoolean: true,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const ButtonNO = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);
      getDoc(docRef)
        .then((res) => {
          if (res.data().EatTrueFalse) {
            setDisplayUsersListLoading(true);
            updateDoc(docRef, {
              EatTrueFalse: false,
              EatTimesThisMonth: res.data().EatTimesThisMonth - 1,
              PriceDueThisMont: res.data().PriceDueThisMont - priceToday,
            })
              .then(() => {
                setDisplayUsersListLoading(false);
                setBoolean(!boolean);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const ButtonYES_PLUS = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);

      getDoc(docRef)
        .then((res) => {
          if (res.data().CheckIndicatorPriceBoolean === false) {
            setDisplayUsersListLoading(true);
            updateDoc(docRef, {
              EatTimesThisMonth: res.data().EatTimesThisMonth + 1,
              PriceDueThisMont: res.data().PriceDueThisMont + priceYesterday,
              CheckIndicatorPriceBoolean: true,
            })
              .then(() => {
                setDisplayUsersListLoading(false);
                setBoolean(!boolean);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const ButtonNO_MINUS = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);

      getDoc(docRef)
        .then((res) => {
          if(res.data().CheckIndicatorPriceBoolean === true){
          setDisplayUsersListLoading(true);
          updateDoc(docRef, {
            EatTimesThisMonth: res.data().EatTimesThisMonth - 1,
            PriceDueThisMont: res.data().PriceDueThisMont - priceYesterday,
            CheckIndicatorPriceBoolean: false,
          })
            .then(() => {
              setDisplayUsersListLoading(false);
              setBoolean(!boolean);
            })
            .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const ButtonPaid = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);

      getDoc(docRef)
        .then((res) => {
          if (!res.data().PricePaid) {
            setDisplayUsersListLoading(true);
            updateDoc(docRef, {
              PricePaid: true,
            })
              .then(() => {
                setDisplayUsersListLoading(false);
                setBoolean(!boolean);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const ButtonNotPaid = (id) => {
    return function() {
      const docRef = doc(dbUsersUIDcollection, id.docID);

      getDoc(docRef)
        .then((res) => {
          if (res.data().PricePaid) {
            setDisplayUsersListLoading(true);
            updateDoc(docRef, {
              PricePaid: false,
            })
              .then(() => {
                setDisplayUsersListLoading(false);
                setBoolean(!boolean);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };
  const navigate = useNavigate();
  const goToMainPage = () => {
    navigate("/mainPage");
  };

  return (
    <div className="main-div-displayUsersList">
      <div className="data-container">
        {eatNumberForToday === 1 ? (
          <div className="data data-today">Днес ще обядва:<span>{eatNumberForToday}</span>ученик</div>
        ):(
          <div className="data data-today">Днес ще обядват:<span>{eatNumberForToday}</span>ученици</div>
        )}
        {eatNumberForTomorrow === 1 ? (

          <div className="data data-tomorrow">До момента утре ще обядва:<span>{eatNumberForTomorrow}</span>ученик</div>
          ): (
            <div className="data data-tomorrow">До момента утре ще обядват:<span>{eatNumberForTomorrow}</span>ученици</div>
          )}
      </div>
      <div className="df students-df">
          <div className="icon-button-div">
            <IconButton className="arrow-back  back-icon" aria-label="delete" size="small" onClick={goToMainPage}>
              <ArrowBackIcon />
            </IconButton>
          </div>
        <h2 className="selector-title">Ученици от клас {usersClass}</h2>
        <div className="selector-caret">
          <select
            className="student-select"
            type="number"
            min={1}
            onChange={(e) => {
              if (e.target.value == 0) {
                setUsersClass(e.target.value);
              } else {
                setUsersClass(Number(e.target.value));
              }
            }}
            value={usersClass}
          >
            <option  value="1">
              1
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <div className="caret"></div>
        </div>
      </div>
      <DisplayUsers />
    </div>
  );
}
