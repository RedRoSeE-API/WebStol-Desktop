import React, { useState, useEffect } from "react";
import "../../../styles/changeMoneyForBread.css";
import app from "../../../custom/firebase";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDoc,
} from "firebase/firestore";

const db = getFirestore(app);
const dbInfoCollection = collection(db, "dbInfo");

export default function ChangeMoneyForBread({ setPriceForBread_loading }) {
  const [priceForBread, setPriceForBread] = useState();
  const [priceForBreadNew, setPriceForBreadNew] = useState("");
  const [breadPackages, setBreadPackages] = useState();
  const [breadPackagesNew, setBreadPackagesNew] = useState("");
  const [newPrice_loading, setNewPrice_loading] = useState(false);

  useEffect(() => {
    getPrice();
  }, [newPrice_loading]);

  const getPrice = () => {
    const docRef = doc(dbInfoCollection, "price");

    getDoc(docRef).then((res) => {
      setPriceForBread(res.data().breadPrice);
      setBreadPackages(res.data().breadPackagesForToday);
      setPriceForBread_loading(false);
    });
  };

  const SetNewPriceForBread = () => {
    if (priceForBreadNew === "") return;
    setPriceForBread_loading(true);

    const docRef = doc(dbInfoCollection, "price");

    updateDoc(docRef, {
      breadPrice: Number(priceForBreadNew),
    }).then(() => {
      setNewPrice_loading(!newPrice_loading);
      setPriceForBreadNew("");
      setPriceForBread_loading(false);
    });
  };

  const SetNewBreadPackages = () => {
    if (breadPackagesNew === "") return;
    setPriceForBread_loading(true);

    const docRef = doc(dbInfoCollection, "price");

    updateDoc(docRef, {
      breadPackagesForToday: Number(breadPackagesNew),
    }).then(() => {
      setNewPrice_loading(!newPrice_loading);
      setBreadPackagesNew("");
      setPriceForBread_loading(false);
    });
  };


  return (
    <>
      
      <div className="bread-money">
        <div className="price">
          {priceForBread && 
          <p>Цена на хляба - {priceForBread.toFixed(2)}</p>
          }
          <div className="column-bread">
            <input
              value={priceForBreadNew}
              onChange={(e) => setPriceForBreadNew(e.target.value)}
            ></input>
            <button onClick={SetNewPriceForBread}>Запази</button>
          </div>
        </div>
        <div className="packages">
          {breadPackages && 
          <p>Брой - {breadPackages}</p>
          }
          <div className="column-bread">
            <input
              value={breadPackagesNew}
              onChange={(e) => setBreadPackagesNew(e.target.value)}
            ></input>
            <button onClick={SetNewBreadPackages}>Запази</button>
          </div>
        </div>
      </div>
    </>
  );
}
