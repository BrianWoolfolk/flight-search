/* eslint-disable import/first */

// #region ##################################################################################### BACKGROUND
// #endregion

// #region ##################################################################################### SHAPE
// #endregion

// #region ##################################################################################### ICON
import icon_alert_error from "@icon/alert-error.png";
import icon_alert_info from "@icon/alert-info.png";
import icon_alert_success from "@icon/alert-success.png";
import icon_alert_warning from "@icon/alert-warning.png";
import icon_close from "@icon/close.png";
// #endregion

// #region ##################################################################################### MISC
import misc_not_found from "@misc/not-found.jpg";
// #endregion

/** Objeto **I**mage**P**rovider que almacena todas las rutas de todas las imágenes y contenido de la aplicación. */
const IP = {
  /** Imágenes utilizadas como **fondo de pantalla** (imágenes grandes). */
  bg: {},

  /** Imágenes utilizadas como **contenido** (imágenes medianas). */
  shape: {},

  /** Imágenes utilizadas como **íconos** (imágenes pequeñas). */
  icon: {
    alert_error: icon_alert_error,
    alert_info: icon_alert_info,
    alert_success: icon_alert_success,
    alert_warning: icon_alert_warning,
    close: icon_close,
  },

  /** Imágenes sin categoría utilizadas en ocasiones específicas. */
  misc: {
    not_found: misc_not_found,
  },
};

export default IP;
