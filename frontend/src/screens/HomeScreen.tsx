import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import AlertMessage from "@components/AlertMessage";
import { Outlet, useNavigation } from "react-router";
import NotFoundScreen from "./NotFoundScreen";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// HomeScreen => Rename all instances to use (CTRL + SHIFT + L)
type HomeScreenProps = {
  isNotFound?: boolean;
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _HomeScreen = (props: HomeScreenProps) => {
  const navigation = useNavigation();

  // ---------------------------------------------------------------------- RETURN
  return (
    <>
      <AlertMessage />

      {props.isNotFound ? <NotFoundScreen /> : <Outlet />}

      {navigation.state === "loading" ? (
        <div className="spinner">Loading...</div>
      ) : navigation.state === "submitting" ? (
        <div className="spinner">Submitting...</div>
      ) : (
        <></>
      )}
    </>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const HomeScreen = styled(_HomeScreen).attrs(
  (props: HomeScreenProps): HomeScreenProps => {
    return { ...props };
  }
)<HomeScreenProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default HomeScreen;
// #endregion
