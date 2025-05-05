// src/components/ScrollToTopButton.js
import {useState, useEffect} from "react";

const ScroolTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          padding: "10px 15px",
          fontSize: "20px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#333",
          color: "#fff",
          cursor: "pointer",
          zIndex: 1000,
        }}
        aria-label="Scroll to top">
        ↑
      </button>
    )
  );
};

export default ScroolTopButton;
