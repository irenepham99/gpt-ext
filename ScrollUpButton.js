import React from "react";

const ScrollUpButton = () => {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  const scrollToLastArticle = () => {
    const articles = document.getElementsByTagName("article");
    if (articles.length > 0) {
      const lastArticle = articles[articles.length - 1];
      lastArticle.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  //checks if the end of the last article is at the bottom of the page
  const checkIfAtBottom = () => {
    const articles = document.getElementsByTagName("article");
    if (articles.length > 0) {
      const lastArticle = articles[articles.length - 1];
      const rect = lastArticle.getBoundingClientRect();
      const isAtBottom = rect.bottom <= window.innerHeight;
      setIsAtBottom(isAtBottom);
    }
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      checkIfAtBottom();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    isAtBottom && (
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
