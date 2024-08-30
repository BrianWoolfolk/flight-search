import styled, { css } from "styled-components";
import { parseCSS, useRefresh } from "scripts/FunctionsBundle";
import { useEffect, useState } from "react";

import IP from "@utils/ImageProvider";
import { GS } from "App";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// AlertMessage => Rename all instances to use
export type AlertMessageProps = {
  /** Tipo de alerta a crear, determina los colores nada más. */
  _type?: "error" | "warning" | "success" | "informative";
  /** Mensaje de alerta a mostrar. */
  _message?: string;
  /** Tiempo de espera para ocultar el mensaje automáticamente. */
  _timer?: number;
  /** Indica si es que dispondrá de un botón para ocultar el mensaje o no. */
  _hideButton?: boolean;
};
// #endregion

// #region ##################################################################################### COMPONENT
const _AlertMessage = (props: _Base) => {
  const [close, setClose] = useState(!GS.alert._message);
  const [refresh, volkey] = useRefresh();
  GS.alertRef = refresh;

  GS.alert._type = GS.alert._type ?? "success";
  GS.alert._timer = GS.alert._timer ?? 5000;
  GS.alert._hideButton = GS.alert._hideButton ?? true;

  // ---------------------------------------------------------------------- USE EFFECT
  useEffect(() => {
    setClose(!GS.alert._message);

    const timout = setTimeout(() => setClose(true), GS.alert._timer);
    return () => clearTimeout(timout);
  }, [volkey]);

  // ---------------------------------------------------------------------- RETURN
  return (
    <div
      className={
        props.className + " popup " + GS.alert._type + (close ? " close" : "")
      }
    >
      {GS.alert._type === "error" ? (
        <img src={IP.icon.alert_error} alt="icon error alert" />
      ) : GS.alert._type === "warning" ? (
        <img src={IP.icon.alert_warning} alt="icon warning alert" />
      ) : GS.alert._type === "informative" ? (
        <img src={IP.icon.alert_info} alt="icon info alert" />
      ) : (
        <img src={IP.icon.alert_success} alt="icon correct alert" />
      )}
      {GS.alert._type === "error"
        ? "Error! "
        : GS.alert._type === "warning"
        ? "Advertencia! "
        : GS.alert._type === "informative"
        ? "Información "
        : "Realizado con éxito! "}
      {GS.alert._message}
      {GS.alert._hideButton && (
        <button className="close-button" onClick={() => setClose(true)}>
          x
        </button>
      )}
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const AlertMessage = styled(_AlertMessage).attrs((props: _Base): _Base => {
  return props;
})<AlertMessageProps>`
  ${(props) => css`
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default AlertMessage;
// #endregion