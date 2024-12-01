import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const AutoScrollToTop = () => {
  const [shouldScroll, setShouldScroll] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Whenever the location changes, set the shouldScroll flag to true
    setShouldScroll(true);

    // Scroll to the top of the page
    window.scrollTo(0, 0);

    // Reset the shouldScroll flag after the scroll has completed
    const scrollTimeout = setTimeout(() => {
      setShouldScroll(false);
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [location]);

  // Don't render anything, this component just handles the scrolling behavior
  return null;
};

export default AutoScrollToTop;
