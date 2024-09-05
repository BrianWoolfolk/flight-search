import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// LandingScreen => Rename all instances to use (CTRL + SHIFT + L)
type LandingScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _LandingScreen = (props: LandingScreenProps) => {
  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <h1>Landing Screen</h1>

      <p>Here is the readme:</p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit esse illo
        ut impedit odio corrupti blanditiis modi molestias quidem pariatur,
        veniam aspernatur, excepturi hic ipsum sed sequi, eveniet quos. Libero.
      </p>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const LandingScreen = styled(_LandingScreen).attrs(
  (props: LandingScreenProps): LandingScreenProps => {
    return { ...props };
  }
)<LandingScreenProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default LandingScreen;
// #endregion
