import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "./css/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LengthOption({
  handleLengthEdit,
  isLengthValid,
  handleSelectLength,
  length,
}) {
  //when the edit button is clicked change the appearance
  //when the new length is entered pass it back to the parent

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
      <div className="menu-button" style={{ gap: "8px" }}>
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
          className="edit-input"
          autoFocus
        />
        <span>words</span>
      </div>
    );
  } else {
    return (
      <button
        className="menu-button"
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
