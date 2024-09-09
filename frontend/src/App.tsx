// #region ##################################################################################### IMPORTS
// ---------------------------------------------------------------------- NORMAL IMPORTS
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRefresh } from "scripts/FunctionsBundle";
import * as _T from "@utils/ClassTypes";
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

  let search = "";
  if (GS.cache?.formData) search = GS.cache.formData;
  GS.cache = {};

  // ============================== GET DATA
  const response = await fetch(composedUrl).catch(() => null);

  // NO DATA
  if (!response) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Service unavailable. Try again in a few minutes.",
    });
  }

  // INVALID DATA
  if (!response.ok) throw response;

  // RETURN DATA
  const data = await response.json();
  return { data, search };
}
// #endregion

// #region ##################################################################################### MAIN APPLICATION
function App() {
  // ---------------------------------------------------------------------- GLOBAL STATE
  const [refresh] = useRefresh();
  GS.refresh = refresh;

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
              element: <SearchFlightScreen />,
            },
            // -------------------------------------------------- RESULTS PAGE
            {
              path: "results",
              id: "results",
              loader: loadFlight,
              shouldRevalidate: (req) => {
                return (
                  req.currentUrl.pathname === "/search" ||
                  req.currentUrl.search !== req.nextUrl.search
                );
              },
              children: [
                {
                  index: true,
                  element: <ResultsScreen />,
                },
                // -------------------------------------------------- TICKETS PAGE
                {
                  path: ":index",
                  element: <DetailsScreen />,
                },
              ],
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
