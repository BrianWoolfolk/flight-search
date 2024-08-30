import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { useNavigate, useRouteError } from "react-router";
import { Helmet } from "react-helmet";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// NotFoundScreen => Rename all instances to use (CTRL + SHIFT + L)
type NotFoundScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _NotFoundScreen = (props: NotFoundScreenProps) => {
  const navigate = useNavigate();
  const error = useRouteError() as any;
  const errtext = error?.statusText || error?.message;
  if (error) console.warn(error);

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className + " screen"}>
      <Helmet>
        <title>Not Found | Flight Search</title>
      </Helmet>

      <img
        src={"https://picsum.photos/400"}
        alt="Unable to load content"
        className="img-not-found"
      />

      {errtext && <h4>{errtext}</h4>}

      <button
        className="login"
        onClick={() => {
          navigate("/");
        }}
      >
        Go Back
      </button>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const NotFoundScreen = styled(_NotFoundScreen).attrs(
  (props: NotFoundScreenProps): NotFoundScreenProps => {
    return { ...props };
  }
)<NotFoundScreenProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffff;

    .img-not-found {
      width: 300px;
      // height: 32%;
    }

    h4 {
      color: var(--color-palette-brown);
      font-weight: 400;
    }

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default NotFoundScreen;
// #endregion