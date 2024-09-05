type _AlMsg = import("@components/AlertMessage").AlertMessageProps;

// #region ##################################################################################### ESSENTIALS
// ---------------------------------------------------------------------- ONLY KEYS
/**
 * Selecciona todas las propiedades de un objeto, sin importar el tipo de dato.
 */
export type OnlyKeys<T> = { [P in keyof T]?: any };

// ---------------------------------------------------------------------- AUTO KEYS
/**
 * Selecciona todas las propiedades y permite agregar nuevas.
 */
export type AutoKeys<T> = OnlyKeys<T> & { [key: string]: any };

// ---------------------------------------------------------------------- _SETUP
/**
 * Clase extensible que coloca `props` automáticamente.
 * 1. {@link id} - ***readonly*** `string | null`.
 */
abstract class _setup {
  /**
   * `string | null` - ID del elemento.
   *
   * Si proviene de `Firestore`, entonces se refiere al ID del documento.
   *
   * Todos los elementos tienen un ID aún si no se necesita.
   * */
  readonly id: string | null = null;

  /**
   * Coloca todos los props automáticamente.
   * @param ini Objeto de donde obtener los datos iniciales.
   *
   * 1. Puede estar vacío y puede omitir algunos campos.
   * 2. Se toma el valor por defecto de las propiedades que no se incluyan.
   * 3. Si el tipo de dato de las propiedades no coincide, se ignora.
   * 4. Se pueden incluir propiedades de más.
   * 5. Si el campo actual es `null`, entonces acepta **cualquier valor** (`null <-- any`).
   * 6. Es **imposible colocar `null`** a un campo que ya exista (`any <-/- null`).
   */
  protected update(ini?: AutoKeys<this>) {
    if (ini === undefined) return;
    for (const key in this) {
      const that = ini[key];
      if (that === undefined || that === null) continue;
      if (
        this[key] === null ||
        (typeof that === typeof this[key] &&
          (typeof that !== "object" ||
            Object.getPrototypeOf(that) === Object.getPrototypeOf(this[key])))
      ) {
        this[key as string] = that;
      }
    }
  }

  /**
   * Coloca todos los props automáticamente.
   * @param ini Objeto de donde obtener los datos iniciales.
   *
   * 1. Puede estar vacío y puede omitir algunos campos.
   * 2. Se toma el valor por defecto de las propiedades que no se incluyan.
   * 3. Si el tipo de dato de las propiedades no coincide, se ignora.
   * 4. Se pueden incluir propiedades de más.
   * 5. Si el campo actual es `null`, entonces acepta **cualquier valor** (`null <-- any`).
   * 6. Es **imposible colocar `null`** a un campo que ya exista (`any <-/- null`).
   */
  constructor(ini?: AutoKeys<_setup>) {
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- _BASE
/**
 * Provides basic prop structure for functional components
 */
export type _Base = {
  /** Overrides any other `className` passed. */
  className?: string;
  /** Overrides any other `style` passed. */
  _style?: import("react").CSSProperties;
};
// #endregion

// #region ##################################################################################### GLOBAL STATE
/**
 * Modelo para la variable global a utilizar en todo el sistema. Esta se creó con el propósito de minimizar las llamadas
 * a la base de datos (Firebase) y acceder a la información relevante más fácilmente.
 *
 * 1. {@link currentUser} - `User | null`.
 * 1. {@link cache} - `any`.
 * 1. {@link refresh} - `() => void`.
 * 1. {@link firstTime} - `boolean`.
 * 1. {@link alert} - `AlertMessageProps`.
 * 1. {@link alertRef} - `() => void`.
 * 1. {@link setAlert} - ***readonly*** `() => void`.
 */
export class Global {
  /** `User | null` - Representa el usuario con la sesión iniciada actualmente. También describe sus permisos. */
  // currentUser: User | null = null;
  /** `any` - Guarda cualquier clase de información, puede estar vacío y no es confiable. */
  cache: any = {};
  /** `() => void` - Representa una función para refrescar toda la aplicación desde la raíz. */
  refresh: () => void = () => {};
  /** `boolean` - Representa si es la primera vez que carga la aplicación desde el inicio. */
  firstTime: boolean = true;
  /**
   * `AlertMessageProps` - Parámetros para accionar el `AlertMessage`:
   *
   * 1. **`_type?`**: `"error"` | `"warning"` | `"success"` | `"informative"`; Color de la alerta, default: `"success"`.
   * 2. **`_message?`**: `string`; Mensaje de alerta a mostrar. Si no hay nada no se muestra.
   * 3. **`_timer?`**: `number`; Tiempo de espera (ms) para ocultar el mensaje automáticamente, default: `5000`.
   * 4. **`_hideButton?`**: `boolean`; Indica si es que dispondrá de un botón para ocultar el mensaje o no, default: `true`.
   */
  alert: _AlMsg = {};
  /** `() => void` - Función para accionar manualmente las alertas. */
  alertRef: () => void = () => {
    console.log((this.alert._type || "Alerta") + ":\n" + this.alert._message);
  };
  /** Actualiza las alertas y las ejecuta `alert = param` + `alertRef()`. */
  readonly setAlert = (p: _AlMsg) => {
    this.alert = p;
    this.alertRef();
  };
}
// #endregion

// #region ##################################################################################### DATABASE MODELS
// ---------------------------------------------------------------------- TO BE DEFINED
// #endregion

// #region ##################################################################################### MISCELLANEOUS
// ---------------------------------------------------------------------- LOADER DATA MODEL
// #endregion
