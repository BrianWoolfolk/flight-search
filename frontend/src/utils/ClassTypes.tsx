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
  currencyCode: Currency = Currency.USD;
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
      search.append("returnDate", intoInputDate(this.returnDate));
    }
    search.append("adults", this.adults.toString());
    search.append("currencyCode", this.currencyCode.toString());
    search.append("nonStop", this.nonStop.toString());
    return search;
  };

  readonly createResults = () => {
    return (
      <p className="search-status">
        Showing {this.nonStop && "non-stop"} flight offers from
        <br />
        <b>{this.originLocationCode}</b> to{" "}
        <b>{this.destinationLocationCode}</b>.
        <br />
        On {this.departureDate.toLocaleDateString()}
        {this.returnDate &&
          ", and including a return flight on " +
            this.returnDate.toLocaleDateString()}
        .
        <br />
        For{" "}
        <b>
          {this.adults} adult{this.adults > 1 && "(s)"}
        </b>
      </p>
    );
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

// #region ##################################################################################### DICTIONARY CLASS
// ---------------------------------------------------------------------- DICTIONARY
export class Dictionary extends _setup {
  locations: Locations = {};
  aircraft: Aircrafts = {};
  currencies: Currencies = {};
  carriers: Carriers = {};

  constructor(ini?: AutoKeys<Dictionary>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- LOCATIONS
export type Locations = {
  [x: string]: {
    cityCode: string;
    countryCode: string;
    name: string;
    iataCode: string;
    id: string;
    cityName: string;
  };
};

// ---------------------------------------------------------------------- AIRCRAFTS
export type Aircrafts = {
  [x: string]: string;
};

// ---------------------------------------------------------------------- CURRENCIES
export type Currencies = {
  [x: string]: string;
};

// ---------------------------------------------------------------------- CARRIERS
export type Carriers = {
  [x: string]: string;
};
// #endregion

// #region ##################################################################################### FLIGHT SEGMENT
// ---------------------------------------------------------------------- FLIGHT END POINT
export class FlightEndPoint extends _setup {
  iataCode: string = "";
  terminal?: string;
  /** This is a `$date-time` string like: `YYYY-MM-ddThh:mm:ss` */
  at?: string;

  constructor(ini?: AutoKeys<FlightEndPoint>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- FLIGHT SEGMENT
export class FlightSegment extends _setup {
  departure: FlightEndPoint = new FlightEndPoint();
  arrival: FlightEndPoint = new FlightEndPoint();
  carrierCode = "";
  number = 0;
  aircraft = { code: "" };
  operating = { carrierCode: "" };
  /** This is a `$stop-time` string like: `PnYnMnDTnHnMnS` */
  duration = "";
  numberOfStops = 0;
  stops?: FlightStop[];
  blacklistedInEU = false;
  co2Emissions = null; // WIP

  constructor(ini?: AutoKeys<FlightSegment>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- Flight Stop
export class FlightStop extends _setup {
  iataCode = "";
  /** This is a `$stop-time` string like: `PnYnMnDTnHnMnS` */
  duration = "";
  /** This is a `$date-time` string like: `YYYY-MM-ddThh:mm:ss` */
  arrivalAt?: string;
  /** This is a `$date-time` string like: `YYYY-MM-ddThh:mm:ss` */
  departureAt?: string;

  constructor(ini?: AutoKeys<FlightStop>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- Flight Offer
export class FlightOffer extends _setup {
  type = "";
  source: string[] = [];
  instantTicketingRequired?: boolean;
  nonHomogeneous?: boolean;
  oneWay?: boolean;
  isUpsellOffer?: boolean;
  /** This is a `$date` string like: `YYYY-MM-dd` */
  lastTicketingDate?: string;
  /** This is a `$date-time` string like: `YYYY-MM-ddThh:mm:ss` */
  lastTicketingDateTime?: string;
  numberOfBookableSeats?: number;
  itineraries: Itinerary[] = [];
  price: Price = new Price();
  pricingOptions: PricingOptions = new PricingOptions();
  validatingAirlineCodes?: string[];
  travelerPricings: TravelerPricing[] = [];

  constructor(ini?: AutoKeys<FlightOffer>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- Price
export class Price extends _setup {
  margin = "";
  /** Total amount paid by the user (including fees and selected additional services). */
  grandTotal = "";
  /** Currency of the payment. It may be different than the requested currency */
  billingCurrency = Currency.EUR;
  aditionalServices: AdditionalService[] = [];
  currency = Currency.EUR;
  /** Total amount paid by the user */
  total = "";
  /** Amount wwithout taxes */
  base = "";
  fees: Fee[] = [];
  taxes: Tax[] = [];
  refundableTaxes = "";

  constructor(ini?: AutoKeys<Price>) {
    super(ini);
    this.update(ini);
  }
}

enum AdditionalServiceType {
  CHECKED_BAGS = "CHECKED_BAGS",
  MEALS = "MEALS",
  SEATS = "SEATS",
  OTHER_SERVICES = "OTHER_SERVICES",
}

// ---------------------------------------------------------------------- AdditionalService
export class AdditionalService extends _setup {
  amount = "";
  type = AdditionalServiceType.CHECKED_BAGS;

  constructor(ini?: AutoKeys<AdditionalService>) {
    super(ini);
    this.update(ini);
  }
}

enum FareType {
  PUBLISHED = "PUBLISHED",
  NEGOTIATED = "NEGOTIATED",
  CORPORATE = "CORPORATE",
}

// ---------------------------------------------------------------------- PricingOptions
export class PricingOptions extends _setup {
  fareType: FareType[] = [];
  includedCheckedBagsOnly = false;
  refundableFare = false;
  noRestrictionFare = false;
  noPenaltyFare = false;

  constructor(ini?: AutoKeys<PricingOptions>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- Itinerary
export class Itinerary extends _setup {
  /** Format `PnYnMnDTnHnMnS` */
  duration = "";
  segments: FlightSegment[] = [];

  constructor(ini?: AutoKeys<Itinerary>) {
    super(ini);
    this.update(ini);
  }
}
// #endregion

// #region ##################################################################################### TRAVELER PRICING
enum FareOption {
  STANDARD = "STANDARD",
  INCLUSIVE_TOUR = "INCLUSIVE_TOUR",
  SPANISH_MELILLA_RESIDENT = "SPANISH_MELILLA_RESIDENT",
  SPANISH_CEUTA_RESIDENT = "SPANISH_CEUTA_RESIDENT",
  SPANISH_CANARY_RESIDENT = "SPANISH_CANARY_RESIDENT",
  SPANISH_BALEARIC_RESIDENT = "SPANISH_BALEARIC_RESIDENT",
  AIR_FRANCE_METROPOLITAN_DISCOUNT_PASS = "AIR_FRANCE_METROPOLITAN_DISCOUNT_PASS",
  AIR_FRANCE_DOM_DISCOUNT_PASS = "AIR_FRANCE_DOM_DISCOUNT_PASS",
  AIR_FRANCE_COMBINED_DISCOUNT_PASS = "AIR_FRANCE_COMBINED_DISCOUNT_PASS",
  AIR_FRANCE_FAMILY = "AIR_FRANCE_FAMILY",
  ADULT_WITH_COMPANION = "ADULT_WITH_COMPANION",
  COMPANION = "COMPANION",
}

enum TravelerType {
  ADULT = "ADULT",
  CHILD = "CHILD",
  SENIOR = "SENIOR",
  YOUNG = "YOUNG",
  HELD_INFANT = "HELD_INFANT",
  SEATED_INFANT = "SEATED_INFANT",
  STUDENT = "STUDENT",
}

// ---------------------------------------------------------------------- TravelerPricing
export class TravelerPricing extends _setup {
  travelerId = "";
  fareOption: FareOption = FareOption.STANDARD;
  travelerType: TravelerType = TravelerType.ADULT;
  associatedAdultId?: string;
  price: TravelerPrice = new TravelerPrice();
  fareDetailsBySegment: FareDetails[] = [];

  constructor(ini?: AutoKeys<TravelerPricing>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- TravelerPrice
export class TravelerPrice extends _setup {
  currency = "";
  /** Total amount paid by the user */
  total = "";
  /** Amount without taxes */
  base = "";
  fees: Fee[] = [];
  taxes: Tax[] = [];
  refundableTaxes = "";

  constructor(ini?: AutoKeys<TravelerPrice>) {
    super(ini);
    this.update(ini);
  }
}

enum FeeType {
  TICKETING = "TICKETING",
  FORM_OF_PAYMENT = "FORM_OF_PAYMENT",
  SUPPLIER = "SUPPLIER",
}

// ---------------------------------------------------------------------- Fee
export class Fee extends _setup {
  amount = "";
  type: FeeType = FeeType.TICKETING;

  constructor(ini?: AutoKeys<Fee>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- Tax
export class Tax extends _setup {
  amount = "";
  code = "";

  constructor(ini?: AutoKeys<Tax>) {
    super(ini);
    this.update(ini);
  }
}

enum CabinType {
  ECONOMY = "ECONOMY",
  PREMIUM_ECONOMY = "PREMIUM_ECONOMY",
  BUSINESS = "BUSINESS",
  FIRST = "FIRST",
}

// ---------------------------------------------------------------------- FareDetails
export class FareDetails extends _setup {
  segmentId = "";
  cabin = CabinType.ECONOMY;
  fareBasis = "";
  brandedFare = "";
  brandedFareLabel = "";
  class = "";
  isAllotment = false;
  allotmentDetails = {
    tourName: "",
    tourReference: "",
  };
  sliceDiceIndicator = "";
  includedCheckedBags = {
    quantity: 0,
    weight: 0,
    weightUnit: "",
  };
  additionalServices = new AdditionalServicesRequest();
  amenities: Amenity[] = [];

  constructor(ini?: AutoKeys<FareDetails>) {
    super(ini);
    this.update(ini);
  }
}

enum OtherServices {
  PRIORITY_BOARDING = "PRIORITY_BOARDING",
  AIRPORT_CHECKIN = "AIRPORT_CHECKIN",
}

// ---------------------------------------------------------------------- AdditionalServicesRequest
export class AdditionalServicesRequest extends _setup {
  chargeableCheckedBags = {
    quantity: 0,
    weight: 0,
    weightUnit: "",
    id: "",
  };
  chargeableSeat = {
    id: "",
    number: 0,
  };
  otherServices: OtherServices[] = [];

  constructor(ini?: AutoKeys<AdditionalServicesRequest>) {
    super(ini);
    this.update(ini);
  }
}

// ---------------------------------------------------------------------- Amenity
export class Amenity extends _setup {
  description = "";
  isChargeable = true;
  amenityType = "";
  amenityProvider = {
    name: "",
  };

  constructor(ini?: AutoKeys<Amenity>) {
    super(ini);
    this.update(ini);
  }
}
// #endregion

// ---------------------------------------------------------------------- APIData
export class APIData extends _setup {
  data: FlightOffer[] = [];
  dictionaries?: Dictionary;

  constructor(ini?: AutoKeys<APIData>) {
    super(ini);
    this.update(ini);
  }
}
