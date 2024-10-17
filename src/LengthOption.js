import React, { useState, useEffect } from "react";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

function LengthOption({
  handleLengthEdit,
  isLengthValid,
  handleSelectLength,
  length,
  isSelected,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [curLength, setCurLength] = useState(length);
  const [previousLength, setPreviousLength] = useState(length);

  const handleLengthChangeSubmit = () => {
    setIsEditing(false);
    //if its not a valid length set the length to the previous value
    if (!isLengthValid(curLength)) {
      setCurLength(previousLength);
    } else {
      setPreviousLength(curLength);
      handleLengthEdit(curLength);
    }
  };

  if (isEditing) {
    return (
      <div
        className="menu-button"
        style={{
          gap: "8px",
        }}
      >
        <span>&lt;</span>
        <input
          type="number"
          value={curLength}
          onChange={(e) => {
            setCurLength(e.target.value);
          }}
          onBlur={() => {
            handleLengthChangeSubmit();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLengthChangeSubmit();
            }
          }}
          className="edit-input"
          autoFocus
        />
        <span>words</span>
        <FontAwesomeIcon
          icon={faCheck}
          onClick={() => {
            handleLengthChangeSubmit();
          }}
          className="icon-button"
        />
      </div>
    );
  } else {
    return (
      <button
        className={`menu-button ${isSelected ? "selected" : ""}`}
        onClick={() => handleSelectLength(length)}
      >
        <span style={{ marginRight: "4px" }}>&lt; {curLength} words</span>
        <FontAwesomeIcon
          icon={faEdit}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="icon-button"
        />
      </button>
    );
  }
}

export default LengthOption;
