import { intoInputDate } from "scripts/FunctionsBundle";

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

// #region ##################################################################################### API MODELS
// ---------------------------------------------------------------------- AVAILABLE CURRENCIES
export enum Currency {
  USD = "USD",
  MXN = "MXN",
  EUR = "EUR",
}

// ---------------------------------------------------------------------- FLIGHT SEARCH PARAMS
/**
 * Represents a SearchParams to correctly get all desired values for the API.
 * 1. {@link id} - ***readonly*** `string | null`.
 * 1. {@link originLocationCode} - `string`.
 * 1. {@link destinationLocationCode} - `string`.
 * 1. {@link departureDate} - `Date`.
 * 1. {@link returnDate} - `Date`.
 * 1. {@link adults} - `number`.
 * 1. {@link currency} - `Currency`.
 * 1. {@link nonStop} - `boolean`.
 * */
export class FlightSearchParams extends _setup {
  /** `string` - IATA code of the origin airport. */
  originLocationCode: string = "";
  /** `string` - IATA code of the destination airport. */
  destinationLocationCode: string = "";
  /** `Date` - In the format yyyy-MM-dd. Required. */
  departureDate: Date = (() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t;
  })();
  /** `Date | null` - In the format yyyy-MM-dd. Not required. */
  returnDate: Date | null = null;
  /** `number` - Number of adults traveling. */
  adults: number = 1;
  /** `Currency` - Currency to consider for the flight. */
  currency: Currency = Currency.USD;
  /** `boolean` - Indicates if the plane could have stops in other cities. */
  nonStop: boolean = false;

  /**
   * Creates a URLSearchParams object with all the info needed to request
   */
  readonly createSearch = () => {
    const search = new URLSearchParams();
    search.append("originLocationCode", this.originLocationCode.slice(-4, -1));
    search.append(
      "destinationLocationCode",
      this.destinationLocationCode.slice(-4, -1)
    );
    search.append("departureDate", intoInputDate(this.departureDate));
    if (this.returnDate) {
      console.log(this);
      search.append("returnDate", intoInputDate(this.returnDate));
    }
    search.append("adults", this.adults.toString());
    search.append("currency", this.currency.toString());
    search.append("nonStop", this.nonStop.toString());
    return search;
  };

  /**
   * Coloca todos los props automáticamente.
   * @param ini Objeto de donde obtener los datos iniciales.
   *
   * 1. Puede estar vacío y puede omitir algunos campos.
   * 2. Se toma el valor por defecto de las propiedades que no se incluyan.
   * 3. Si el tipo de dato de las propiedades no coincide, se ignora.
   * 4. Se pueden incluir propiedades de más.
   */
  constructor(ini?: AutoKeys<FlightSearchParams>) {
    super(ini);
    this.update(ini);
  }
}
// #endregion

// #region ##################################################################################### MISCELLANEOUS
// ---------------------------------------------------------------------- LOADER DATA MODEL
// #endregion
