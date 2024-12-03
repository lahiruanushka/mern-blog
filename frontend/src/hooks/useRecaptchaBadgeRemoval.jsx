import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useRecaptchaBadgeRemoval = () => {
  const location = useLocation();

  useEffect(() => {
    const manageBadge = () => {
      const badges = document.querySelectorAll(".grecaptcha-badge");
      badges.forEach((badge) => {
        // Hide badge on all pages EXCEPT sign-in and sign-up pages
        if (location.pathname !== '/sign-in' && location.pathname !== '/sign-up') {
          badge.style.display = 'none';
          badge.style.opacity = '0';
          badge.style.visibility = 'hidden';
          badge.setAttribute('aria-hidden', 'true');
        } else {
          // Ensure badge is visible on sign-in and sign-up pages
          badge.style.display = '';
          badge.style.opacity = '';
          badge.style.visibility = 'visible';
          badge.removeAttribute('aria-hidden');
        }
      });
    };

    // Immediate management
    manageBadge();

    // Multiple strategies to ensure badge management
    const intervalId = setInterval(manageBadge, 100);
    const timeoutId = setTimeout(manageBadge, 500);

    // MutationObserver for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        manageBadge();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]);
};

export default useRecaptchaBadgeRemoval;