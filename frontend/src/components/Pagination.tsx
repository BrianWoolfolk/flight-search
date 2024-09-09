import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { useLocation, useNavigate } from "react-router";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// Pagination => Rename all instances to use (CTRL + SHIFT + L)
type PaginationProps = {
  _onClick?: () => void;
  _maxPage: number;
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _Pagination = (props: PaginationProps) => {
  const navi = useNavigate();
  const location = useLocation();

  const search = new URLSearchParams(location.search);

  function handleClick(i: number) {
    if (search.get("pag") === i + "") return;

    props._onClick?.();

    search.set("pag", i + "");
    navi({ pathname: "/results", search: "?" + search });
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      {new Array(props._maxPage).fill("").map((_, i) => (
        <button
          key={i}
          disabled={search.get("pag") === i + 1 + ""}
          onClick={() => handleClick(i + 1)}
        >
          Page {i + 1}
        </button>
      ))}
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const Pagination = styled(_Pagination).attrs(
  (props: PaginationProps): PaginationProps => {
    return { ...props };
  }
)<PaginationProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.

    display: flex;
    justify-content: space-around;

    margin: var(--margin-big);

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default Pagination;
// #endregion
