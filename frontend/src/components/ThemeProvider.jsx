import { useSelector } from "react-redux";
import { useEffect } from 'react';

const ThemeProvider = ({children}) => {
  const { theme } = useSelector((state) => state.theme);

  // Add transition class to body when theme changes
  useEffect(() => {
    document.body.classList.add('transition-colors', 'duration-300');
    return () => {
      document.body.classList.remove('transition-colors', 'duration-300');
    };
  }, [theme]);

  return (
    <div className={`${theme} transition-colors duration-300`}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen transition-colors duration-300">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
