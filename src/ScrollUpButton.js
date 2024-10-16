import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const ScrollUpButton = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isArticleLong, setIsArticleLong] = useState(false);
  const [showText, setShowText] = useState(window.innerWidth >= 592);

  //show button text based on screen size
  useEffect(() => {
    const handleResize = () => {
      setShowText(window.innerWidth >= 592);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToTopLastArticle = () => {
    const articles = document.getElementsByTagName("article");
    if (articles.length > 0) {
      const lastArticle = articles[articles.length - 1];
      lastArticle.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  //checks if the end of the last article is at the bottom of the page
  const checkIfAtBottom = () => {
    const articles = document.querySelectorAll("article div[class*='m-auto']");
    if (articles.length > 0) {
      const lastArticle = articles[articles.length - 1];
      const rect = lastArticle.getBoundingClientRect();
      const isAtBottom = rect.bottom <= window.innerHeight;
      setIsAtBottom(isAtBottom);
    }
  };

  //checks if the last article height exceeds the height of the window and if scrolling up makes sense
  const checkIfArticleIsLong = () => {
    const articles = document.querySelectorAll("article div[class*='m-auto']");
    const hfullDiv = document.querySelector("main div.h-full");
    if (articles.length > 0 && hfullDiv) {
      const lastArticle = articles[articles.length - 1];
      const lastArticleHeight = lastArticle.offsetHeight;
      const hfullHeight = hfullDiv.offsetHeight;
      const adjustedHeight = hfullHeight - 100;
      setIsArticleLong(lastArticleHeight > adjustedHeight);
    }
    return null;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkIfAtBottom();
      checkIfArticleIsLong();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    isAtBottom &&
    isArticleLong && (
      <button
        className="gpt-ext-button scroll-up-button"
        onClick={scrollToTopLastArticle}
      >
        <FontAwesomeIcon icon={faArrowUp} className="icon" />
        {showText && "To Response Start"}
      </button>
    )
  );
};

export default ScrollUpButton;
