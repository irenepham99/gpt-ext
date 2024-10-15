import React from "react";

const ScrollUpButton = () => {
  const [isAtBottom, setIsAtBottom] = React.useState(false);
  const [isArticleLong, setIsArticleLong] = React.useState(false);

  const scrollToLastArticle = () => {
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
      //console.log(rect.bottom, window.innerHeight);
      const isAtBottom = rect.bottom <= window.innerHeight;
      setIsAtBottom(isAtBottom);
    }
  };

  //checks if the last article is long
  const checkIfArticleIsLong = () => {
    const articles = document.querySelectorAll("article div[class*='m-auto']");
    const hfullDiv = document.querySelector("main div.h-full");
    if (articles.length > 0 && hfullDiv) {
      const lastArticle = articles[articles.length - 1];
      const lastArticleHeight = lastArticle.offsetHeight;
      const hfullHeight = hfullDiv.offsetHeight;
      //console.log("Height of h-full div:", hfullHeight);
      const adjustedHeight = hfullHeight - 100;
      //console.log("Adjusted height:", adjustedHeight);
      //console.log("last article height", lastArticleHeight);
      //console.log(lastArticleHeight > adjustedHeight);
      setIsArticleLong(lastArticleHeight > adjustedHeight);
    } else {
      console.log("no articles or hfull div found", articles, hfullDiv);
    }
    return null;
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      checkIfAtBottom();
      checkIfArticleIsLong();
      //   console.log("isAtBottom", isAtBottom);
      //   console.log("isArticleLong", isArticleLong);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    isAtBottom &&
    isArticleLong && (
      <button
        style={{
          position: "fixed",
          bottom: "100px",
          right: "250px",
          backgroundColor: "red",
        }}
        onClick={scrollToLastArticle}
      >
        Scroll to Last Article
      </button>
    )
  );
};

export default ScrollUpButton;
