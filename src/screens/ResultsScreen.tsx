import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { Link } from "react-router-dom";
import ResultCard from "@components/ResultCard";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// ResultsScreen => Rename all instances to use (CTRL + SHIFT + L)
type ResultsScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _ResultsScreen = (props: ResultsScreenProps) => {
  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <Link to={"/search"}>{"< Return to Search"}</Link>

      <h1>Results Screen</h1>

      <ResultCard />
      <ResultCard />
      <ResultCard />
      <ResultCard />
      <ResultCard />
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
