import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { Link, Outlet, useRouteLoaderData } from "react-router-dom";
import ResultCard from "@components/ResultCard";
import { APIData } from "@utils/ClassTypes";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// ResultsScreen => Rename all instances to use (CTRL + SHIFT + L)
type ResultsScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _ResultsScreen = (props: ResultsScreenProps) => {
  // ---------------------------------------------------------------------- ALL FLIGHT DATA
  const loaderData = useRouteLoaderData("results") as APIData;
  console.log("loaderdata:", loaderData);

  // ---------------------------------------------------------------------- RETURN INCORRECT DATA
  if (!loaderData?.data?.length || !loaderData?.dictionaries) {
    return (
      <div className={props.className}>
        <h1>Results Screen</h1>

        <h2>No flights found</h2>
        <Link className="as-button warning" to="/search">
          Search another
        </Link>
      </div>
    );
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <Link to={"/search"}>{"< Return to Search"}</Link>

      <h1>Results Screen</h1>
      {loaderData.data.map((item, i) => (
        <ResultCard
          key={i}
          _data={item}
          _dictionary={loaderData.dictionaries!}
          _item={i}
        />
      ))}

      <Outlet />
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const ResultsScreen = styled(_ResultsScreen).attrs(
  (props: ResultsScreenProps): ResultsScreenProps => {
    return { ...props };
  }
)<ResultsScreenProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default ResultsScreen;
// #endregion
