import { useCallback, useEffect, useRef, useState } from "react";
type _CSSProperties = import("react").CSSProperties;

// #region ##################################################################################### SHORTCUTS
// ---------------------------------------------------------------------- RANDOM RANGE
/**
 * Create some random number between the specified ranges.
 *
 * @param _min Range's start (inclusive), `default: 0`.
 * @param _max Range's end (inclusive), `default: 10`.
 * @param _decimal Whether to output a `int` number or a `float` number, `default: false`.
 * @returns A random `number`.
 */
export function randomRange(_min = 0, _max = 10, _decimal?: boolean) {
  const _diff = _max - _min;

  if (!_decimal) return Math.round(_min + _diff * Math.random());
  return _min + _diff * Math.random();
}

// ---------------------------------------------------------------------- BOUNDARIES
/**
 * Returns a valid number between some specific limits (inclusive) without letting it to overflow.
 *
 * @param _value Value to check.
 * @param _min Inferior limit, pass `undefined` for limitless.
 * @param _max Superior limit, pass `undefined` for limitless.
 * @param _wrap Jump the value to the other limit in case of overflow, `default: false`.
 * @returns A `number` between those limits.
 */
export function boundaries(
  _value: number,
  _min?: number,
  _max?: number,
  _wrap?: boolean
) {
  _min = _min ?? _value;
  _max = _max ?? _value;

  if (!_wrap) {
    if (_value < _min) return _min;
    if (_value > _max) return _max;
    return _value;
  }

  if (_value < _min) return _max;
  if (_value > _max) return _min;
  return _value;
}

// ---------------------------------------------------------------------- APPROACH
/**
 * Approach the `_start` param to the `_end` param without overflowing it.
 *
 * @param _start Start value.
 * @param _end End value.
 * @param _amount Step to take, `default: 1`.
 * @returns The new value `_start` one `_amount` step closer to `_end`.
 */
export function approach(_start: number, _end: number, _amount?: number) {
  _amount = _amount ?? 1;

  if (_start < _end) return Math.min(_start + _amount, _end);
  else return Math.max(_start - _amount, _end);
}

// ---------------------------------------------------------------------- STALL
/**
 * Función para simular un tiempo de espera, se utiliza con `async/await`.
 *
 * @param stallTime Tiempo de espera en milisegundos, `default = 3000ms (3s)`.
 * @example console.log("Tiempo inicial");
 * await stall(); // Espera 3s
 * console.log("Después de 3s");
 */
export async function stall(stallTime = 3000) {
  return new Promise<boolean>((r) => setTimeout(() => r(true), stallTime));
}

// ---------------------------------------------------------------------- RANDOM DATE
/**
 * Genera una fecha aleatoria entre dos límites inclusivos.
 *
 * @param start Fecha de inicio, en ISOstring o `Date`, `default: "2000-01-01"`.
 * @param end Fecha final, en ISOstring o `Date`, `default: new Date()`.
 * @returns {Date} Una fecha generada aleatoriamente dentro del rango determinado.
 */
export function randomDate(
  start: string | Date = new Date("2000-01-01"),
  end: string | Date = new Date()
): Date {
  start = new Date(intoInputDate(start));
  end = new Date(intoInputDate(end));

  const mul = 1000 * 3600 * 24;
  const ss = start.getTime() / mul;
  const ee = end.getTime() / mul;
  const rr = randomRange(ss, ee);

  const dd = new Date(rr * mul);
  return new Date(dd.getUTCFullYear(), dd.getUTCMonth(), dd.getUTCDate());
}

// ---------------------------------------------------------------------- CREATE TUPLE
/**
 * Creates a tuple from the given `Array`.
 *
 * @param args Array from which create the tuple.
 * @returns A `Tuple` type with the contents from `args`.
 */
export const createTuple = <T extends unknown[]>(args: [...T]): T => args;

// ---------------------------------------------------------------------- FIT STRING
/**
 * Ajusta un `string` a un tamaño determinado, ya sea abreviando alguna parte si se excede,
 * o agregando caracteres hasta que se complete dicho tamaño.
 * @param str Cadena de texto con la cual trabajar.
 * @param max Máximo de tamaño para ajustar, default `16`.
 * @param pos Alineación de hacia dónde ajustar o expandir (**izquierda**, **derecha** o al **medio**), default `0`.
 * @param grow Representa si debería de expandirse en caso de ser necesario, default `false`.
 * @param shortChar Representa el caracter con el cual abreviar, default `"..."`.
 * @param fillChar Representa el caracter con el cual rellenar, default `" "`.
 * @returns La cadena de texto correctamente ajustada, donde `str.length === max` (si se marca `grow`).
 */
export function fitString(
  str: string,
  max = 16,
  pos:
    | "left"
    | "right"
    | "middle"
    | -1
    | 0
    | 1
    | "start"
    | "end"
    | "center" = 0,
  grow?: boolean,
  shortChar = "...",
  fillChar = " "
) {
  let result = str;
  if (str.length > max) {
    const diff = max - shortChar.length;
    if (pos === "right" || pos === "end" || pos === 1) {
      result = str.substring(0, diff) + shortChar;
    } else if (pos === "left" || pos === "start" || pos === -1) {
      result = shortChar + str.substring(str.length - diff);
    } else {
      result =
        str.substring(0, diff / 2) +
        shortChar +
        str.substring(str.length - diff / 2);
    }
  } else if (grow) {
    if (pos === "right" || pos === "end" || pos === 1) {
      result = str.padEnd(max, fillChar);
    } else if (pos === "left" || pos === "start" || pos === -1) {
      result = str.padStart(max, fillChar);
    } else {
      result =
        str.substring(0, str.length / 2).padStart(max / 2, fillChar) +
        str.substring(str.length / 2).padEnd(max / 2, fillChar);
    }
  }

  return result;
}

// ---------------------------------------------------------------------- GET IMG SIZE
/**
 * Renders an image with an `HTMLImageElement` from the given url.
 * After the element loads, returns the `width` and `height`.
 * @param url Representing the `img.src`.
 * @returns An object with both `width` & `height` as numbers.
 */
export async function getImageSize(url: string) {
  return new Promise<{ width: number; height: number }>((r) => {
    const img = document.createElement("img");
    img.src = url;
    img.onload = () => {
      r({
        width: img.width,
        height: img.height,
      });
    };
  });
}
// #endregion

// #region ##################################################################################### PARSERS
// ---------------------------------------------------------------------- PARSE ID
/**
 * Parses any given `string` to match an alphanumeric type ID, replacing any other char
 * with a hyphen `-` and removes punctuation marks from `Á É Í Ó Ú á é í ó ú Ä Ë Ï Ö Ü ä ë ï ö ü Ý ý ÿ` etc.
 *
 * @param val `string` to transform.
 * @param {boolean} hyphen Whether or not to replace every white space with hyphens. `from this`, `to-this`, default: `false`.
 * @returns Transformed `string`.
 */
export function parseID(val: string, hyphen: boolean = false): string {
  // const rr = /[\u0300-\u036f]/g;
  const a = val
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(REGEXPS._removeAccents, "");

  return hyphen ? a.replace(/[\s\W_]+/gim, "-") : a;
}

// ---------------------------------------------------------------------- PARSE PRICE
/**
 * Parses any given `number` to match an price-based formatting, including `$` at start
 * and a `,` for separation every thousand.
 *
 * @param number `number` to format, it can be a `string` too.
 * @param showDollar Whether or not show a `$` at the start of the number.
 * @param decimalMax Specify the maximum number of decimals shown, limiting the length.
 * @param decimalMin Specify the minimum number of decimals shown, autofilled with `0`.
 * @returns Transformed `string` with formatting, or the same `string` if it does not holds a number.
 */
export function parsePrice(
  number: string | number,
  showDollar: boolean = true,
  decimalMax: number = 0,
  decimalMin: number = 0
): string {
  let temp: string | number = parseNumber(number, true);
  let decimal = temp.toString().replace(/([0-9]*\.*)^([0-9])+/gim, "");
  let dummy = "";
  while (dummy.length < decimalMin) dummy += "0";
  decimal = decimal.slice(1, decimalMax + 1);
  decimal += dummy.slice(decimal.length);

  temp = Number.parseInt(temp.toString()).toString();
  let aux = temp;
  for (let i = temp.length - 4; i >= 0; i -= 3) {
    aux = aux.slice(0, i + 1) + "," + aux.slice(i + 1);
  }

  temp =
    (showDollar ? "$" : "") + aux + (decimal.length === 0 ? "" : "." + decimal);

  return temp;
}

// ---------------------------------------------------------------------- PARSE NUMBER
/**
 * Extended version of `Number.parseInt` & `Number.parseFloat`, it accepts any kind of `string` and does
 * not returns `NaN`, in that case returns `0`.
 *
 * @param str String to parse.
 * @param decimal Whether to use `parseFloat` or `parseInt`, defaults to `false`.
 * @returns A number correctly parsed, or a default `0` if it catches a `NaN`.
 */
export function parseNumber(
  str: string | number,
  decimal: boolean = false
): number {
  if (typeof str === "number") return str;
  const neg = /^[^\d]*-.*\d/.test(str) ? -1 : 1;
  str = str.replace(/[^0-9.]+/gim, "");
  if (decimal) return Number.parseFloat(str || "0") * neg;
  else return Number.parseInt(str || "0") * neg;
}

// ---------------------------------------------------------------------- PARSE CSS
/**
 * Converts an `CSSProperties` object into `string` with correct CSS' sintax,
 * this can be inserted direclty to the `css` function from `styled-components`.
 *
 * @param JS `CSSProperties` object to convert into `string`.
 * @returns parsed `string` with CSS' sintax.
 */
export const parseCSS = (JS?: _CSSProperties) => {
  if (JS === undefined) return "";
  let cssString = "";

  for (const objectKey in JS) {
    cssString +=
      objectKey.replace(/([A-Z])/g, (g) => `-${g[0]?.toLowerCase()}`) +
      ": " +
      JS[objectKey] +
      ";\n";
  }

  return cssString;
};

// ---------------------------------------------------------------------- PARSE DATE
/**
 * Muestra una fecha con formato `"día del mes del año"`.
 *
 * @param date Ya sea tipo `Date` o un ISO string.
 * @param wDay Incluir el día en el resultado, default `true`.
 * @param wYear Incluir el año en el resultado, default `true`.
 */
export function parseDate(date: string | Date, wDay = true, wYear = true) {
  const tt = new Date(date);
  const dd = tt.getDate();
  const mm = MONTHS[tt.getMonth()];
  const yy = tt.getFullYear();

  let res = wDay ? dd + " de " + mm : mm;
  if (wYear) res += " del " + yy;

  return res;
}

// ---------------------------------------------------------------------- INTO INPUT DATE
/**
 * Pasamos de un formato `Date` o un ISO string normal, a algo que entienda el `input[type="date"]`.
 *
 * Cuando creamos un `Date` se crea en tiempo ISO, pero después se "traduce" al tiempo local.
 * Un `input[type="date"]` **SIEMPRE** trabaja con ISO, lo que es un problema porque nosotros lo manipulamos
 * como si fuera el tiempo local.
 *
 * @param date Una fecha real la cual meter al input.
 */
export function intoInputDate(date: string | Date) {
  if (!date || (typeof date === "string" && !date.trim())) return "";

  const tt = new Date(date);
  const dd = tt.getDate().toString();
  const mm = (tt.getMonth() + 1).toString();
  const yy = tt.getFullYear().toString();

  const st =
    yy.padStart(4, "0") + "-" + mm.padStart(2, "0") + "-" + dd.padStart(2, "0");
  return st;
}

// ---------------------------------------------------------------------- FROM INPUT DATE
/**
 * Método opuesto al `intoInputDate`, siendo que este revierte los cambios.
 *
 * Cuando un `input[type="date"]` cambia de valor, te regresa un string como "yyyy-MM-dd"
 * según la fecha que le colocaste, pero esa fecha está en tiempo local (porque
 * tú mismo la seleccionaste pensando en tu tiempo local), entonces, si lo conviertes
 * de regreso a ISO, el tiempo local se va a alterar hacia delante o hacia atrás.
 *
 * @param date `string` directamente sacado como value del input.
 */
export function fromInputDate(date: string) {
  if (isNaN(new Date(date).getTime())) return null;

  const yy = parseNumber(date.substring(0, 4));
  const mm = parseNumber(date.substring(5, 7)) - 1;
  const dd = parseNumber(date.substring(8, 10));

  const dt = new Date(yy, mm, dd);
  dt.setFullYear(yy);
  return dt;
}

// ---------------------------------------------------------------------- AS TYPE
/**
 * Trick `typescript` into *'misinterpreting'* a variable's type as another type passed.
 *
 * ***WARNING:*** as stated, this could lead to *accidental-intentional* errors in runtime, but it also
 * serves like a *'typescript disable'* in certain specific cases.
 *
 * @param val Any variable to misinterpretate, the value will stay the same.
 * @param T `Type` parameter to which trick typescript into.
 * @returns The same value passed in `val` but interpreted like the new `Type`.
 */
export function asType<T extends any>(val: any): T {
  let temp: T = val;
  return temp;
}

// ---------------------------------------------------------------------- PARSE DATA SIZE
/**
 * The `returnFileSize()` function takes a number (of bytes, eg. taken from the current file's size property),
 * and turns it into a nicely formatted size in bytes/KB/MB.
 *
 * Taken from MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#examples
 * @param number Number of bytes.
 * @returns Formatted size in bytes/KB/MB.
 */
export function parseDataSize(number: number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

// ---------------------------------------------------------------------- PARSE FILE DATA
/**
 * Manipula cierta información los strings para trabajar con URLs de los archivos. Por ejemplo, permite
 * extraer el nombre de un archivo de Firebase Cloud Storage separado por ";;".
 *
 * @param str String para trabajar, puede ser el `File.name`;
 * @param type Tipo de acción a realizar, si manipular el nombre o la extensión.
 * @param remove En caso de extraer u omitir el nombre o extensión.
 */
export function parseFileData(
  str: string,
  type: "before" | "full" | "name" | "extension" | "random" | "after",
  encoded?: boolean
) {
  if (encoded) {
    str = decodeURI(str.replace(/%2F/gim, "/").replace(/%3B/gim, ";"));
  }

  const match = REGEXPS._parseFileData.exec(str);
  if (!match) return str;
  const data = {
    before: str.substring(0, match.index),
    full: match[0],
    name: match[1],
    random: match[2],
    extension: match[3],
    after: str.substring(match[0].length + match.index),
  };

  return data[type] || str;
}
// #endregion

// #region ##################################################################################### PROCESSORS
// ---------------------------------------------------------------------- MAP OBJECT
/**
 * Calls the defined `callback` with each property from the given `object` and returns
 * another object with identical properties but holding the return value from the `callback`.
 *
 * Similar to `Array.map` but with an object.
 *
 * @param object Object to operate with.
 * @param callback Callback to apply to each property value from the given object.
 * @returns An `object` with the same properties as the given object but containing
 * the return value of the callback applied with it.
 */
export function mapObject<T, K>(
  object: T,
  callback: (property: string, index: number, obj: typeof object) => K
) {
  let temp = {} as { [Property in keyof T]: K };

  let i: number = 0;
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      temp[key] = callback(key, i, object);
    }
    ++i;
  }

  return temp;
}

// ---------------------------------------------------------------------- HANDLE ERROR
/**
 * Auto-error handler, prints to the console any error passed. Also shows an `window.alert`
 * for user interpretation.
 *
 * @param error Any object containing error data.
 * @param params Which params interpretate in console.
 * @param loc `string` telling at which point the error ocurred (for user interpretation).
 * @param alert Whether or not to show the `window.alert`.
 */
export function handleError(
  error: any,
  params: string | Array<string> = "",
  loc: string = "",
  alert: boolean = true
) {
  if (alert) window.alert("Something went wrong... " + loc);
  if (params !== "") {
    if (typeof params === "string") {
      console.log(error?.[params]);
    } else {
      params.forEach((key) => console.log(key, error?.[params[key]]));
    }
  } else console.log(error);
}

// ---------------------------------------------------------------------- USER SESSION
/**
 * Administra la sesion de usuario, ya sea guardándola en `sessionStorage` o extrayéndola desde ahí.
 *
 * @param param Datos a almacenar, en caso de que no exista (`undefined`), entonces buscará por datos guardados.
 * @returns Un objeto con forma de `param` cuando busca info, y no regresa nada cuando agrega info.
 */
export function userSession(
  param?: { user: string; email: string; pass: string },
  clear?: true
) {
  if (clear) {
    sessionStorage.removeItem("userSession");
    return;
  }

  try {
    if (!param) {
      // Get session
      const i = sessionStorage.getItem("userSession");
      if (i) param = JSON.parse(cipher(i, true));
    } else {
      // Set session
      sessionStorage.setItem("userSession", cipher(JSON.stringify(param)));
    }
  } catch (err) {
    console.error(new Error("User Session Not Found"));
  }
  return param;
}

// ---------------------------------------------------------------------- CIPHER
/**
 * Ciphers any given string for a *slighty* misunderstanding of it.
 *
 * This is not 100% un breakable, but is secure enough of small and really non important data.
 *
 * @param val Value to work with.
 * @param reverse To cipher or de-cipher, defaults to `false` (to cipher).
 * @returns {string} A correctly ciphered or de-ciphered `string`.
 */
export function cipher(val: string, reverse: boolean = false): string {
  let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (reverse) {
    let rev = "";
    for (let i = 0; i < alpha.length; i++) rev = alpha[i] + rev;
    alpha = rev;
  }

  const regex = /[a-z]/gim;
  let prevIndex = 0;
  let output = "";
  let num = 0;

  for (let match = regex.exec(val); match !== null; match = regex.exec(val)) {
    let i = alpha.indexOf(match[0]);
    output +=
      val.slice(prevIndex, match.index) +
      alpha.charAt((i + num) % alpha.length);

    prevIndex = match.index + 1;
    num++;
  }

  output += val.slice(prevIndex);
  return output;
}

// ---------------------------------------------------------------------- RANDOM ID GENERATOR - TEMPORAL
/**
 * Regresa caracteres random como si de un ID de `firebase` se tratase.
 * @returns Un string con un nombre o id random.
 */
export function randomID(): string {
  let res: string = "";
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 16; i++) {
    if (randomRange(0, 1)) res += randomRange(0, 9);
    else if (randomRange(0, 1)) res += alpha[randomRange(0, 25)];
    else res += alpha[randomRange(0, 25)].toLowerCase();
  }

  return res;
}

// ---------------------------------------------------------------------- HANDLE KEYDOWN
/**
 * Función que maneja los focus de los elementos tipo Input, TextArea, Select o Button cuando pulsamos
 * la tecla 'Enter' en algún campo de texto (como si pulsáramos TAB para dirigirnos al siguiente campo).
 *
 * Funciona con `queryselector` y no es un método muy _React_ de hacer las cosas.
 * Para que funcione con los TextArea, es necesario pulsar CTRL + ENTER, de lo contrario se aplicará un '\n'.
 *
 * @param e El evento de onKeyDown, esta función se pasa directamente como: `onkeydown={handleKeyDown}`.
 */
export function handleKeyDown(e: any) {
  // NO ENTER o SI ENTER sin CTRL + NO INPUT
  if (e.key !== "Enter" || (e.currentTarget.nodeName !== "INPUT" && !e.ctrlKey))
    return;

  e.preventDefault();
  if (!e.currentTarget.reportValidity()) return;

  // SALTAR AL SIGUIENTE ELEMENTO
  let el: any = e.currentTarget;

  while (el && el.nodeName !== "FORM") {
    if (!el.nextElementSibling) {
      el = el.parentElement;
      continue;
    }

    el = el.nextElementSibling;
    if (
      !el.disabled &&
      (el.type === "submit" ||
        el.nodeName === "INPUT" ||
        el.nodeName === "SELECT" ||
        el.nodeName === "TEXTAREA")
    ) {
      el.focus?.();
      break;
    }

    const next: any = el.querySelector(
      "input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button[type='submit']"
    );
    if (next) {
      next.focus?.();
      break;
    }
  }
}

// ---------------------------------------------------------------------- TIME BETWEEN
/**
 * Gets the time between two given dates, in every single time unit.
 *
 * @param goal Goal date to calc the time.
 * @param from Initial date, defaults to `Date.now()`.
 * @returns Object containing every unit with its corresponding value associated.
 */
export function timeBetween(goal: Date, from?: Date) {
  type timeObj = {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    date: number;
    month: number;
    fullYear: number;
    rawDays: number;
  };

  from = from || new Date();

  if (from > goal) {
    const c = from;
    from = goal;
    goal = c;
  }

  let leftOver = 0;
  let current = 0;
  const absoluteDiff = goal.getTime() - from.getTime();
  const timeDiff = {
    rawDays: Math.floor(absoluteDiff / (24000 * 3600)),
  };

  const tags: [string, number][] = [
    ["milliseconds", 1000],
    ["seconds", 60],
    ["minutes", 60],
    ["hours", 24],
    ["date", 30],
    ["month", 12],
    ["fullYear", 1],
  ];

  // ############################################ START CYCLE
  for (const tag of tags) {
    const [name, unit] = tag;
    const fn = `UTC${name[0].toUpperCase()}${name.substring(1)}`;

    // ignore months leftovers
    if (name === "month") {
      goal.setUTCDate(1);
      from.setUTCDate(1);
    }

    // adapt leftover
    if ((name === "date" || name === "month") && leftOver) {
      goal[`set${fn}`](goal[`get${fn}`]() - 1);
      leftOver = 0;
    }

    // calc
    current = goal[`get${fn}`]() - from[`get${fn}`]() - leftOver;
    leftOver = 0;

    // check leftover
    if (current < 0) {
      leftOver = 1;

      if (name === "date") {
        const ff = new Date(from);
        ff.setUTCDate(1);
        ff.setUTCMonth(ff.getUTCMonth() + 1);
        ff.setUTCDate(ff.getUTCDate() - 1);
        current = ff.getUTCDate() - from.getUTCDate();
        current += goal.getUTCDate();
      } else current = unit + current;
    }

    timeDiff[name] = current; // SAVE
  }

  return timeDiff as timeObj;
}
// #endregion

// #region ##################################################################################### HOOKS
// ---------------------------------------------------------------------- WINDOW SCROLL
/**
 * Hook que reacciona al scroll vertical de la pantalla, de forma similar a como lo hace el componente `Header`.
 *
 * @param threshold Marca el límite para el scroll vertical, `default: 100`.
 * @returns `true` cuando se hace scroll vartical pasado el punto de `threshold`, `false` cuando no.
 */
export const useWindowScroll = (threshold: number = 100) => {
  const [scrolled, setScrolled] = useState(false);

  const changeScroll = useCallback(() => {
    if (window.scrollY > threshold) setScrolled(true);
    else setScrolled(false);
  }, [threshold]);

  useEffect(() => {
    document.addEventListener("scroll", changeScroll);
    return () => document.removeEventListener("scroll", changeScroll);
  }, [changeScroll]);

  return scrolled;
};

// ---------------------------------------------------------------------- ON SCREEN
/**
 * Hook para conocer si un elemento está a la vista (en pantalla).
 *
 * @param ref referencia hacia el elemento al cual observar.
 * @returns `true` si el elemento se encuentra dentro de la pantalla, `false` si no lo está.
 */
export function useOnScreen(ref: any) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
}

// ---------------------------------------------------------------------- SCROLL TO TOP
/**
 * Scrolls the window all the way to the top when rendering.
 *
 * Use this as `<ScrollToTopOnMount/>`.
 */
export function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}

// ---------------------------------------------------------------------- USE REFRESH
/**
 * Hook para forzar "reloads" en algún componente.
 *
 * Para remontar un componente completo se usa `volkey` como `key`.
 * (Porque en react los componentes se re-ejecutan o re-montan cuando su llave cambia).
 *
 * @returns Una función que cuando se ejecuta, se refresca el componente.
 */
export function useRefresh(): [() => void, number] {
  const [volkey, sv] = useState(0);
  return [() => sv((p) => p + 1), volkey];
}

// ---------------------------------------------------------------------- USE IS FIRST RENDER
/**
 * Hook para saber si estamos en el primer render o no, para así evitar acciones o permitir otras.
 *
 * @returns `boolean` sobre si estamos en el primer render o no.
 */
export const useIsFirstRender = () => {
  const ifrRef = useRef(true);
  useEffect(() => {
    ifrRef.current = false;
  }, []);
  return ifrRef.current;
};

// ---------------------------------------------------------------------- USE REF CALLBACK
type cleanUp = (prev: HTMLElement) => void | Promise<void>;
/**
 * Simulate a `useEffect` but with a ref element. That is, every time `ref.current` changes
 * the callbacks get executed.
 *
 * Cheers to: https://gist.github.com/thebuilder/fb07c989093d4a82811625de361884e7.
 *
 * @param onMount Callback to execute every time the `ref.current` points to a new element.
 * @param cleanUp Similar to `onMount`, but executes *with* the previous element as to clean up.
 * @param onNull Executes every time the element unmounts, after the `cleanUp` function.
 * @returns `ref function` to insert as a `ref` parameter of any HTMLElement.
 */
export function useRefCallback(
  onMount?: (el: HTMLElement) => void | cleanUp | Promise<void | cleanUp>,
  onNull?: () => void | Promise<void>
) {
  const ref = useRef<null | HTMLElement>(null);
  const [LS] = useState<{ fn: cleanUp | void }>({ fn: undefined });

  const setRef = useCallback(
    async (node: null | HTMLElement) => {
      if (ref.current) await LS.fn?.(ref.current);

      if (node) LS.fn = await onMount?.(node);
      else await onNull?.();

      // Save a reference to the node
      ref.current = node;
    },
    [LS, onMount, onNull]
  );

  return setRef;
}
// #endregion

// #region ##################################################################################### CONSTANTS
// ---------------------------------------------------------------------- REGEXPS
/**
 * Grupo de **Expresiones Regulares** muy utilizadas a lo largo de las funciones y del proyecto.
 *
 * Solo se incluyen aquellas expresiones que sean lo suficientemente complejas como para que valga
 * la pena guardarse por separado, mínimamente para ahorrar espacio.
 *
 * Se usan mayormente dentro de algunas funciones, pero pueden usarse individualmente en la app.
 */
export const REGEXPS = {
  /** Busca espacios en blanco y cosas, se usa con ayuda de `formatText`. */
  _formatText: /(?:[\n\t\r\s]{2,})|(?:[\n\t\r])/g,
  /** Busca caracteres escapados, se usa con ayuda de `escapeChars`. */
  _escapedCharacters: /\\([\s\S])/g,
  /** Busca caracteres especiales de RegExp, se usa con ayuda de `searchAll`. */
  _escapeRegExp: /[+*?^$.[\]{}()|/-]/gim,
  /** Busca e identifica propiedades dentro de `styleText`. */
  _getProperties: /((?:[\S].*?)+?)(?::(?:({[^}]+})|([^,\n\t]+)))?(?:[,\n]|$)/g,
  /** Quita todos los acentos de las letras, se usa con ayuda de `parseID`. */
  _removeAccents: /[\u0300-\u036f]/g,
  /** Busca todos los emails dentro de un string. */
  _email: /[\w-.]+@(?:[\w-]+\.)+[\w-]{2,4}/gm,
  /** Para usarse con la función `parseFileData`. */
  _parseFileData: /(?!\/)([^/]+);;([\w-]+)\.([\w]+)(?:(?=\?)|$)/,
};

// ---------------------------------------------------------------------- MONTHS
/**
 * Lista con los meses del año, se usa para `parseDate`.
 */
export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
// #endregion
