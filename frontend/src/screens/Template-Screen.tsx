import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// Template => Rename all instances to use (CTRL + SHIFT + L)
type TemplateProps = {
  _ejemplo: "primero" | "segundo";
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _Template = (props: TemplateProps) => {
  // ---------------------------------------------------------------------- RETURN
  return <div className={props.className}></div>;
};
// #endregion

// #region ##################################################################################### STYLES
const Template = styled(_Template).attrs(
  (props: TemplateProps): TemplateProps => {
    return { ...props };
  }
)<TemplateProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default Template;
// #endregion