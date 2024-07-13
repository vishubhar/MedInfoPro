import React, { useState, useEffect } from "react";
import "./App.css";
import searchImage from "./Assests/icons/search.png";
import backImage from "./Assests/icons/arrow_back.png";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDiscountMessage, setShowDiscountMessage] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchTerm && searched) {
      fetchData();
    }
  }, [searchTerm, searched]);

  async function fetchData() {
    const pharmacyIds = "1,2,3";
    const apiUrl = `https://backend.cappsule.co.in/api/v1/new_search?q=${searchTerm}&pharmacyIds=${pharmacyIds}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);
      const { medicineSuggestions } = data.data;

      setResults(medicineSuggestions);
      setShowDiscountMessage(false);
      setSearched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleSearch = () => {
    setSearched(true);
    fetchData();
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSearched(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearched(true);
      fetchData();
    }
  };

  const handleBack = () => {
    setResults([]);
    setSearchTerm("");
    setSearched(false);
    setShowDiscountMessage(true);
  };

  const extractForm = (text) => {
    const forms = [
      "Tablet",
      "Syrup",
      "Injection",
      "Oral Suspension",
      "Oral Gel",
      "Eye Drop",
      "Capsule",
      "Cream",
      "Ointment",
      "Lotion",
      "Nasal Spray",
      "Spray",
      "Powder for Solution",
      "Powder",
      "Powder for Injection",
      "Drops",
      "Patch",
      "Lozenge",
      "Mouthwash",
      "Suppository",
      "Chewable Tablet"
    ];
    return forms.find((form) => text && text.includes(form)) || "N/A";
  };

  const extractStrength = (text) => {
    if (!text) return "N/A";
    const regex = /(\d+(\.\d+)?%?\s?[a-zA-Z]+\/[a-zA-Z]+|\d+(\.\d+)?%?\s?[a-zA-Z]+)/g;
    const match = text.match(regex);
    if (!match) return "N/A";
    return match.join(" + ").replace(/\+/g, " & ");
  };


  const trimSaltName = (saltFull) => {
    if (!saltFull) return "N/A";
    const parts = saltFull.split(" ");
    return parts.slice(0, -1).join(" ");
  };

  const extractPackaging = (nameWithShortPack) => {
    if (!nameWithShortPack) return "N/A";
    const packaging = nameWithShortPack.split(" - ")[1];
    return packaging ? packaging.replace(/\+/g, " & ") : "N/A";
  };

  const extractName = (nameWithShortPack) => {
    if (!nameWithShortPack) return "N/A";
    const trimmedName = nameWithShortPack.trim().split(" - ")[0];
    const regex = /^(.*?)(?=\d|-)/;
    const match = trimmedName.match(regex);
    return match ? match[0] : trimmedName;
  };

  const handlePText = (text) => {
    if (!text) return "N/A";
    return text.replace(/\+/g, " & ");
  };

  return (
    <div className="App">
      <p className="Header">MedInfoPro</p>
      <p className="Header2">Platform to find the best for you</p>

      <div className="search">
        <div className="search2">
          <img
            src={searched ? backImage : searchImage}
            alt={searched ? "Back" : "Search"}
            style={{
              width: "23px",
              height: "23px",
              margin: "10px",
              marginRight: "30px",
              cursor: searched ? "pointer" : "default",
            }}
            onClick={searched ? handleBack : null}
          />
          <input
            type="text"
            placeholder="Type your medicine name here"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="searchInput"
          />
        </div>
        <button
          className="searchButton"
          onClick={handleSearch}
          disabled={!searchTerm.trim()}
        >
          Search
        </button>
      </div>

      <div className="line"></div>

      {!results.length && showDiscountMessage && (
        <div className="bottomText">
          <p>"Find medicines with amazing discount"</p>
        </div>
      )}

      <div className="results">
        {results.map((result) => {
          const nameWithShortPack = result.name_with_short_pack || "";
          const form = extractForm(result.salt_full || nameWithShortPack);
          const strength = extractStrength(result.salt_full || nameWithShortPack);
          const packaging = extractPackaging(nameWithShortPack);
          const name = extractName(nameWithShortPack);

          return (
            <div key={result.id} className="resultItem">
              <div className="leftresult">
                <p>Product ID: {result.product_id}</p>
                <p>Form: {form}</p>
                <p>Strength: {strength}</p>
                <p>Packaging: {packaging}</p>
              </div>
              <div className="midresult">
                <h3>{name}</h3>
                <p>{result.salt_or_category.replace(/\+/g, " & ")}</p>
                {/* <p>{handlePText(trimSaltName(result.salt_full))}</p> */}
              </div>
              <div className="rightresult">
                <p>From ₹{result.mrp}</p>
                <h5>By - {result.manufacturer_name}</h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
