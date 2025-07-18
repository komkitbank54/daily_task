import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api/grids";
const USER_ID = "komkit";

export function useGrids() {
    const [grids, setGrids] = useState([]);

  useEffect(() => {
    fetchGrids();
  }, []);

    const fetchGrids = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}?user=${USER_ID}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array")
        }

        setGrids((data));
        console.log(`data= ${data}`)
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }
  return {
    grids
  };
}