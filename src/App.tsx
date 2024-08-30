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
type _ActionFunctionArgs = import("react-router-dom").ActionFunctionArgs;
// #endregion

// #region ##################################################################################### GLOBAL STATE
/**
 * Objeto principal de estado global. Almacena toda la información de la base de datos relevante.
 */
export const GS = new _T.Global();
// #endregion

// #region ##################################################################################### FUNCIONES LOADERS
// ---------------------------------------------------------------------- LOAD FLIGHT
/** Obtiene información sobre un ticket específico. */
async function loadFlight(req: _LoaderFunctionArgs) {
  // ============================== PREV CHECK
  // no needed

  /** ============================== GET PARAMS */
  const { ticketid } = req.params;

  // ============================== GET ALL USERS
  // const data = ticketid ? await FSAction("read", ticketid, { id: "" }) : null;
  const data = { ticketid };

  // NO DATA
  if (!data) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "No se encontró el ticket ingresado.",
    });
  }

  // RETURN DATA
  return data;
}
// #endregion

// #region ##################################################################################### FUNCIONES ACTIONS
// ---------------------------------------------------------------------- ACTION TICKET CRUD
/** Se encarga de enviar los checks para confirmar un ticket. */
async function actionTicket(req: _ActionFunctionArgs) {
  // ============================== PREV CHECK
  // no needed

  // ============================== RETRIEVE CACHE
  const data = GS.cache?.ticket as _T.Ticket;

  if (!data) {
    GS.setAlert({
      _message: "Falta información importante!",
      _type: "error",
    });
    return null;
  }

  // ============================== CHECK DATA
  data.members.forEach((memb) => {
    if (memb.accepted !== !!memb.acceptedDate) {
      memb.acceptedDate = memb.accepted ? new Date() : null;
    }
  });

  // ============================== FS ACTION
  const success = {};

  if (success) {
    GS.setAlert({
      _message: "Gracias por confirmar!",
      _type: "success",
    });
  }

  // ============================== RETURN
  GS.cache = {};
  return null;
}
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
              element: <SearchFlightScreen />,
            },
            // -------------------------------------------------- RESULTS PAGE
            {
              path: "results",
              loader: loadFlight,
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
