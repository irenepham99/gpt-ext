import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "./css/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LengthOption({ handleLengthEdit, handleSelectLength, length }) {
  //when the edit button is clicked change the appearance
  //when the new length is entered pass it back to the parent

  const [isEditing, setIsEditing] = useState(false);
  const [curLength, setCurLength] = useState(length);
  const [previousLength, setPreviousLength] = useState(length);

  const handleLengthChangeSubmit = () => {
    setIsEditing(false);
    if (!handleLengthEdit(curLength)) {
      setCurLength(previousLength);
    } else {
      setPreviousLength(curLength);
    }
  };

  //if length  is not valid set it to previous length
  if (isEditing) {
    return (
      <div style={{ display: "flex", alignItems: "center", width: "auto" }}>
        <span>&lt;</span>
        <input
          type="number"
          value={curLength}
          onChange={(e) => {
            setCurLength(e.target.value);
            console.log("edited length", e.target.value);
          }}
          onBlur={() => {
            console.log("blurred");
            handleLengthChangeSubmit();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("enter key pressed");
              handleLengthChangeSubmit();
            }
          }}
          className="number-input"
          autoFocus
          style={{
            backgroundColor: "transparent",
            border: "1px solid blue",
            color: "white",
            padding: "2px 4px",
            width: "60px",
            height: "24px",
          }}
        />
        <span>words</span>
      </div>
    );
  } else {
    return (
      <button
        style={{
          padding: "12px 8px",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
        onClick={() => handleSelectLength(length)}
      >
        <span style={{ marginRight: "4px" }}>&lt; {curLength} words</span>
        <FontAwesomeIcon
          icon={faEdit}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="edit-icon"
        />
      </button>
    );
  }
}

export default LengthOption;
