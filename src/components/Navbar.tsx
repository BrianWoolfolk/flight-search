import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { Link } from "react-router-dom";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// NavBar => Rename all instances to use (CTRL + SHIFT + L)
type NavBarProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _NavBar = (props: NavBarProps) => {
  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className + " navbar"}>
      <Link to="/">Landing</Link>

      <Link to="/search">Search</Link>

      <Link to="/results">Results</Link>

      <Link to="/details">Details</Link>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const NavBar = styled(_NavBar).attrs((props: NavBarProps): NavBarProps => {
  return { ...props };
})<NavBarProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default NavBar;
// #endregion
