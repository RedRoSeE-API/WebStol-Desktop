import React, { useState, useEffect, useRef } from "react";
import "../../../styles/menuForNextWeek.css";
import app from "../../../custom/firebase";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(app);
const dbMealsCollection = collection(db, "meals");
const dayOfTheWeekInBG = [
  "Понеделник",
  "Вторник",
  "Сряда",
  "Четвъртък",
  "Петък",
];

export default function MenuForThisWeek({
  setMenuForNextWeek_loading,
  boolean,
  setBoolean,
}) {
  const [newMeals, setNewMeals] = useState([]);
  const divRef = useRef(null);

  useEffect(() => {
    getMeals();
  }, [boolean]);

  const getMeals = async () => {
    await getDocs(dbMealsCollection).then((docsSnap) => {
      setNewMeals([]);
      docsSnap.forEach((doc) => {
        let updatedValue = doc.data();
        setNewMeals((newMeals) => [...newMeals, updatedValue]);
      });
    });
    setMenuForNextWeek_loading(false);
  };

  const resetValues = (i) => {
   
    divRef.current.children[i].children[1].children[1].value = "";
    divRef.current.children[i].children[2].children[1].value = "";
    divRef.current.children[i].children[3].children[1].value = "";
    divRef.current.children[i].children[4].children[1].value = "";
  };

  const handleChange = (e) => {
    let eValue = e.target.value;
    let eMealNumber = e.target.getAttribute("meal-number");
    let eNumKey = e.target.getAttribute("num-key");

    let newArray = newMeals.map((obj, index) => {
      if (index == eNumKey) obj[eMealNumber] = eValue;
      return obj;
    });
    console.log(newArray);
    setNewMeals(newArray);
  };

  const submitChanges = async () => {
    setMenuForNextWeek_loading(false);
    await newMeals.map(async (obj, index) => {
      let docRef = doc(dbMealsCollection, `${index + 1}`);
      await updateDoc(docRef, {
        firstMeal: obj.firstMeal,
        secondMeal: obj.secondMeal,
        thirdMeal: obj.thirdMeal,
        price: Number(obj.price),
      });
    });
    for (let i = 0; i < 5; i++) {
      resetValues(i);
    }
    console.log(boolean);
    setBoolean(!boolean);
    console.log(boolean);
  };


  return (
    <>
      <h3 className="week__title-two ">Въведете менюто за следващата седмица </h3>
      <div className="next-week" ref={divRef}>
        {newMeals.map((element) => (
          <div className="next-week-menu" key={element.dayOfTheWeek}>
            <div className="label-content-three">
              <p className="para">{dayOfTheWeekInBG[element.indexKey]}</p>
            </div>
            <div className="column-meal">
              <label>Първо</label>
              <input
                num-key={element.indexKey}
                meal-day={element.dayOfTheWeek}
                meal-number="firstMeal"
                onChange={handleChange}
              ></input>
            </div>
            <div className="column-meal">
              <label>Второ</label>
              <input
                num-key={element.indexKey}
                meal-day={element.dayOfTheWeek}
                meal-number="secondMeal"
                onChange={handleChange}
              ></input>
            </div>
            <div className="column-meal">
              <label>Трето</label>
              <input
                num-key={element.indexKey}
                meal-day={element.dayOfTheWeek}
                meal-number="thirdMeal"
                onChange={handleChange}
              ></input>
            </div>
            <div className="column-meal">
              <label>Цена</label>
              <input
                num-key={element.indexKey}
                meal-day={element.dayOfTheWeek}
                meal-number="price"
                onChange={handleChange}
              ></input>
            </div>
          </div>
        ))}
      </div>
      <div className="btn-content">
        <button className="save" onClick={submitChanges}>
          Запази меню
        </button>
      </div>
    </>
  );
}
