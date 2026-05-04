import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    // Suppression du "/" initial pour assurer la compatibilité avec GitHub Pages
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData();
      setData(loadedData);
    } catch (err) {
      setError(err.message || err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [getData, data]);

  // Utilisation de useMemo pour optimiser les performances
  const value = useMemo(() => ({
    data,
    error,
  }), [data, error]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
