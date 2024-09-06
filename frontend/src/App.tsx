// #region ##################################################################################### IMPORTS
// ---------------------------------------------------------------------- NORMAL IMPORTS
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRefresh } from "scripts/FunctionsBundle";
import * as _T from "@utils/ClassTypes";
import { useEffect } from "react";
import HomeScreen from "@screens/HomeScreen";
import SearchFlightScreen from "@screens/SearchFlightScreen";
import LandingScreen from "@screens/LandingScreen";
import ResultsScreen from "@screens/ResultsScreen";
import DetailsScreen from "@screens/DetailsScreen";

// ---------------------------------------------------------------------- TYPESCRIPT IMPORTS
type _LoaderFunctionArgs = import("react-router-dom").LoaderFunctionArgs;
// type _ActionFunctionArgs = import("react-router-dom").ActionFunctionArgs;
// #endregion

// #region ##################################################################################### GLOBAL STATE
/**
 * Objeto principal de estado global. Almacena toda la información de la base de datos relevante.
 */
export const GS = new _T.Global();

// shortcut
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// #endregion

// #region ##################################################################################### FUNCIONES LOADERS
// ---------------------------------------------------------------------- LOAD FLIGHT
/** Obtiene información sobre un ticket específico. */
async function loadFlight(req: _LoaderFunctionArgs) {
  // ============================== GET PARAMS
  const url = new URL(req.request.url);
  const composedUrl = BACKEND_URL + "/searchFlight" + url.search;

  // ============================== GET DATA
  const data = await fetch(composedUrl).catch(() => null);

  // NO DATA
  if (!data) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Service unavailable. Try again in a few minutes.",
    });
  }

  // RETURN DATA
  return data;
}
// #endregion

// #region ##################################################################################### FUNCIONES ACTIONS
// ---------------------------------------------------------------------- TO BE DEFINED
// #endregion

// #region ##################################################################################### MAIN APPLICATION
function App() {
  // ---------------------------------------------------------------------- GLOBAL STATE
  const [refresh] = useRefresh();
  GS.refresh = refresh;

  // ---------------------------------------------------------------------- FIRST TIME
  useEffect(() => {
    const a = (GS.cache = setTimeout(() => {
      GS.firstTime = false;
      GS.refresh();
    }, 1000));

    return () => {
      GS.firstTime = false;
      clearTimeout(a);
    };
  }, []);

  // ---------------------------------------------------------------------- RETURN
  return (
    <RouterProvider
      router={createBrowserRouter([
        // -------------------------------------------------- APPLICATION ROOT
        {
          path: "/",
          errorElement: <HomeScreen isNotFound />,
          element: <HomeScreen />,
          children: [
            // -------------------------------------------------- SEARCH TICKET CONTROLS
            {
              index: true,
              element: <LandingScreen />,
            },
            // -------------------------------------------------- SEARCH PAGE
            {
              path: "search",
              loader: undefined,
              element: <SearchFlightScreen />,
            },
            // -------------------------------------------------- RESULTS PAGE
            {
              path: "results",
              loader: loadFlight,
              action: undefined,
              shouldRevalidate: (req) => {
                return req.currentUrl.pathname === "/search";
              },
              element: <ResultsScreen />,
            },
            // -------------------------------------------------- TICKETS PAGE
            {
              path: "details",
              element: <DetailsScreen />,
            },
          ],
        },
        // -------------------------------------------------- NOT FOUND SCREEN
        {
          path: "*",
          element: <HomeScreen isNotFound />,
        },
      ])}
    />
  );
}
// #endregion

// #region ##################################################################################### EXPORTS
export default App;
// #endregion
