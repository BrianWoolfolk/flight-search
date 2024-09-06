import styled, { css } from "styled-components";
import {
  fromInputDate,
  intoInputDate,
  parseCSS,
  parseID,
  parseNumber,
  parsePrice,
  useRefresh,
  handleKeyDown,
  randomID,
} from "scripts/FunctionsBundle";
import { useCallback, useEffect, useRef, useState } from "react";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// Template => Rename all instances to use (CTRL + SHIFT + L)
export type InputProps = {
  /** Texto a mostrar con un label, si no existe no se genera label. */
  _label?: string;
  /** Texto a mostrar dentro del placeholder. */
  _placeholder?: string;
  /** Texto a mostrar cuando el cursor se pose encima del input. */
  _tooltip?: string;
  /** Cualquier elemento a colocar después del elemento de error (ej. para el CRUD, el botón de eliminar). */
  children?: React.JSX.Element;
  /** Tamaño del Input, acepta alguna palabra clave o un numero de caracteres que se convertirá en ch. */
  _width?: "xs" | "s" | "m" | "l" | "xl" | "max" | number;
  /** Nombre de la clase, por default es input */
  _className?: string;

  /** Tipo de Input a generar. */
  _type?: "textarea" | "checkbox" | "date" | "password" | "text" | "search";
  /** Indica si el valor a guardar se coloca en un parseNumber() antes de almacenarse en _store. */
  _as_number?: true;
  /** Indica si este input será un select de un grupo de valores. */
  _select_from?: string[] | string;
  /** Indica si crear un conjunto de radio buttons para seleccionar de algún valor marcado. El Map contiene `Key-Value`. */
  _options?: Map<string | number, string | number | boolean>;
  /** En caso de que exista `_options`, indica si crear `<radio-buttons>` o un `<select>`. Default `false`. */
  _options_as_radio?: boolean;
  /** Un objeto que le pasa una propiedad refresh para mutarla con un `refresh` de este mismo elemento. */
  _refresh_onCommand?: { refresh: () => void };

  /** Dicta algunos presets para _validator y _charset. */
  _preset?:
    | "email"
    | "tel"
    | "float"
    | "money"
    | "int"
    | "name"
    | "date"
    | "two names"
    | "boolean"
    | "sexo";
  /** RegExp para validar los datos, mostrando un mensaje de alerta. /^contenido$/ */
  _validator?: RegExp;
  /** Texto que contiene el mensaje de alerta para el validador de datos. */
  _validator_text?: string;
  /** RegExp que dice qué caracteres NO se pueden usar dentro del input. /[^validos]/ */
  _charset?: RegExp;
  /** Mensaje a mostrar cuando se pulse una tecla que no se puede validar. */
  _charset_text?: string;
  /** Si el input es requerido o no para evitar strings vacios. El texto que se muestra. */
  _required?: string;
  /** Rango para validar los números o fechas, y si va detener la escritura o no. */
  _range?: [
    number | string | Date | undefined,
    number | string | Date | undefined,
    boolean?
  ];
  /** Texto a mostrar si el valor no está dentro del rango. El primer valor es para el mínimo, el segundo para el máximo.
   * Después de cada mensaje se coloca la cantidad en cuestión: "Mensaje por debajo " + min */
  _range_text?: [string?, string?];
  /** Rango de caracteres para validar los inputs, funciona como min y max. El ultimo es si va detener la escritura o no. */
  _length?: [number?, number?, boolean?];
  /** Texto a mostrar si el valor no tiene el tamaño indicado. Primero por muy corto, después por muy alto. */
  _length_text?: [string?, string?];

  /** Nombre del campo, para autocompletar cosas. */
  _name?: string;
  /** Si el Input está desabilitado. */
  _disabled?: boolean;

  /** Objeto de variable de donde se desea guardar la información (semi-controlado). */
  _store: object;
  /** Nombre de la propiedad del objeto que alojará la nueva información. */
  _store_var: string;
  /** Función de cambio para cada vez que se modifique el valor del Input. Si regresa un valor `string` se coloca como error. */
  _onChange?: (value: string, el: HTMLInputElement) => void | string;
  /** Similar al _onChange, pero esta vez se ejecuta después de que la información haya sido validada y modificada. */
  _afterChange?: (value: string, el: HTMLInputElement) => void;
  /** Función de cambio para cada vez que se salga del Input. Sirve principalmente para efectuar cambios finales en el value. */
  _onBlur?: (value: string, el: HTMLInputElement) => void;
  /** Función de cambio para cada vez que entre al Input. Sirve principalmente para re-validar los datos antes que nada. */
  _onFocus?: (value: string, el: HTMLInputElement) => void;
  /** Ref para el input, si no se marca una, se usa una default para poder usar _refresh_onCommand */
  _inputRef?: React.MutableRefObject<null>;

  /** Indica si se incluye una advertencia para que el usuario pueda ver restricciones e información adicional. */
  _withWarning?: boolean;
  /** Indica si se incluye un `div.wrapper` alrededor del `input` y `label`. */
  _withWrapper?: boolean;
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _Input = (props: InputProps) => {
  // ---------------------------------------------------------------------- HOOK STATES
  const [LS, setLS] = useState<any>(props._store[props._store_var] ?? "");
  const [showError, setShowError] = useState("");
  const [refresh] = useRefresh();
  let ref = useRef(null);
  if (props._inputRef) ref = props._inputRef;

  // ---------------------------------------------------------------------- HOPEFULLY UNIQUE ID
  const [id] = useState(
    parseID(props._name || "") +
      "_" +
      parseID(props._store_var) +
      "_" +
      randomID()
  );

  // ---------------------------------------------------------------------- ELEMENTS
  let input: React.JSX.Element = <></>;

  // ---------------------------------------------------------------------- TOOLTIP
  let tooltip = props._tooltip || "";
  if (
    props._type?.includes("text") &&
    !props._select_from &&
    props._charset_text
  )
    tooltip = props._charset_text + "\n" + tooltip;
  if (props._required) tooltip = props._required + "\n" + tooltip;

  // ---------------------------------------------------------------------- SET VALID FUNCTION
  function valid(err: string, el: HTMLInputElement, noFocus?: boolean) {
    el.setCustomValidity(err);
    if (!noFocus) el.reportValidity();
    setShowError(err);
  }

  // ---------------------------------------------------------------------- HANDLE CHANGE = VALIDATIONS
  const handleChange = useCallback(
    (e: any, blurring?: boolean) => {
      const el = e.target as HTMLInputElement;
      let val = el.value;

      // -------------------------------------------------- HANDLE CHECK
      if (props._type === "checkbox") {
        setLS(el.checked); // UPDATE INPUT
        props._store[props._store_var] = el.checked; // VALID DATA
        props._afterChange?.(val, el);
        return;
      }

      // -------------------------------------------------- HANDLE OPTIONS
      if (props._options) {
        // ALREADY HANDLED BY RADIO BUTTONS THEMSELVES
        props._afterChange?.(val, el);
        return;
      }

      // -------------------------------------------------- CHECK REQUIRED
      if (props._required && !val) {
        valid(props._required + "\n" + props._charset_text, el, blurring);
        setLS(val); // UPDATE INPUT
        return;
      }

      // -------------------------------------------------- HANDLE DATE
      if (props._type === "date") {
        const dd = fromInputDate(val);

        // ARE NULL DATES ALLOWED?
        if (props._required && !dd) {
          valid(props._required + "\n" + props._charset_text, el, blurring);
          setLS(dd); // UPDATE INPUT
          return;
        }

        if (props._onChange) {
          const err = props._onChange(val, el);
          if (err) {
            valid(err, el, blurring);
            setLS(dd); // UPDATE INPUT
            return;
          }
        }

        valid("", el); // REMOVE ERRORS
        setLS(dd); // UPDATE INPUT
        props._store[props._store_var] = dd;
        props._afterChange?.(val, el);
        return;
      }

      // -------------------------------------------------- CHARSET VALIDATION
      if (props._charset && props._charset.test(val)) {
        // valid(props._charset_text || "**", el);
        return;
      }

      // -------------------------------------------------- LENGTH VALIDATION
      if (props._length) {
        const [start = val.length, end = val.length, cut] = props._length;
        // ============================== MENOR QUE EL TAMAÑO MINIMO
        if (val.length < start) {
          valid(props._length_text?.[0] || "**", el, blurring);
          setLS(val); // UPDATE INPUT
          return;
        } else if (val.length > end) {
          // ============================== MAYOR QUE EL TAMAÑO MAXIMO
          if (!cut) {
            valid(props._length_text?.[1] || "**", el, blurring);
            setLS(val); // UPDATE INPUT
            return;
          } else {
            // ============================== SI SE CORTA EL STRING, SEGUIMOS
            val = val.substring(0, end);
          }
        }
      }

      // -------------------------------------------------- RANGE VALIDATION
      if (props._range) {
        let rev = parseNumber(val, true);
        let [start = rev, end = rev, cut] = props._range;
        start = start instanceof Date ? start.getTime() : parseNumber(start);
        end = end instanceof Date ? end.getTime() : parseNumber(end);

        // ============================== MENOR QUE EL RANGO MINIMO
        if (rev < start) {
          valid((props._range_text?.[0] || "") + start + ".", el, blurring);
          setLS(val); // UPDATE INPUT
          return;
        } else if (rev > end) {
          // ============================== MAYOR QUE EL RANGO MAXIMO
          if (!cut) {
            valid((props._range_text?.[1] || "") + end + ".", el, blurring);
            setLS(val); // UPDATE INPUT
            return;
          } else {
            // ============================== SI EXISTE UN LIMITE, SEGUIMOS
            val = end + "";
          }
        }
      }

      // -------------------------------------------------- PATTERN VALIDATION
      if (props._validator && val && !props._validator.test(val)) {
        valid(props._validator_text + "\n" + props._charset_text, el, blurring);
        setLS(val); // UPDATE INPUT
        return;
      }

      // -------------------------------------------------- CUSTOM ONCHANGE
      if (props._onChange) {
        const err = props._onChange(val, el);
        if (err) {
          valid(err, el, blurring);
          setLS(val); // UPDATE INPUT
          return;
        }
      }

      // -------------------------------------------------- NO ERRORS SO FAR, SAVE VALID DATA
      valid("", el);
      setLS(val); // UPDATE INPUT
      props._store[props._store_var] = props._as_number
        ? parseNumber(val, true)
        : val;

      // -------------------------------------------------- EXECUTE ANY AFTER CHANGE FUNCTION
      props._afterChange?.(val, el);
    },
    [props]
  );

  // ---------------------------------------------------------------------- HANDLE BLUR = SET CUSTOM FORMAT
  const handleBlur = useCallback(
    (e: any) => {
      const el = e.target as HTMLInputElement;
      let val = el.value;

      props._onBlur?.(val, el);

      if (props._preset === "money") {
        el.value = parsePrice(val, true, undefined, 2);
      }
    },
    [props]
  );

  // ---------------------------------------------------------------------- HANDLE FOCUS = PRE-CHECK
  const handleFocus = useCallback(
    (e: any) => {
      const el = e.target as HTMLInputElement;
      let val = el.value;

      props._onFocus?.(val, el);
      handleChange(e);
    },
    [handleChange, props]
  );

  // ---------------------------------------------------------------------- OPTIONS GROUP && TEXTAREA && INPUT ELEMENT
  if (props._options) {
    const arr: React.JSX.Element[] = [];
    if (props._options_as_radio) {
      props._options.forEach((value, key) => {
        arr.push(
          <label key={key} style={{ margin: "0px" }}>
            <input
              name={id}
              type={"radio"}
              defaultChecked={props._store[props._store_var] === value}
              onClick={() => (props._store[props._store_var] = value)}
              title={tooltip}
              className="input"
              autoComplete={"one-time-code"}
              disabled={props._disabled}
              // checked={LS === value}
            />
            {key}
          </label>
        );
      });

      input = (
        <div
          ref={ref}
          id={id}
          title={tooltip}
          className={
            (props._className ? props._className : "") + " options-wrapper"
          }
          style={props._style}
        >
          {arr}
        </div>
      );
    } else {
      props._options.forEach((value, key) => {
        arr.push(
          <option
            key={key}
            defaultChecked={props._store[props._store_var] === value}
            value={value.toString()}
            disabled={props._disabled}
          >
            {key}
          </option>
        );
      });

      input = (
        <select
          ref={ref}
          id={id}
          title={tooltip}
          className={props._className || ""}
          style={props._style}
        >
          {arr}
        </select>
      );
    }
  } else if (props._type === "textarea") {
    // ---------------------------------------------------------------------- TEXTAREA ELEMENT
    input = (
      <textarea
        ref={ref}
        id={id}
        name={props._name}
        className="input"
        disabled={props._disabled}
        value={LS}
        placeholder={props._placeholder}
        title={tooltip}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={props._style}
      />
    );
  } else {
    // ---------------------------------------------------------------------- INPUT ELEMENT
    input = (
      <input
        list={
          typeof props._select_from === "string"
            ? props._select_from
            : props._select_from
            ? id + "-list"
            : ""
        }
        ref={ref}
        id={id}
        type={props._type}
        name={props._name}
        autoComplete={"one-time-code"}
        className={"input " + (props._className || "")}
        disabled={props._disabled}
        value={props._type === "date" ? intoInputDate(LS) : LS}
        checked={LS}
        placeholder={props._placeholder}
        title={tooltip}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        min={
          props._range?.[0] instanceof Date
            ? intoInputDate(props._range?.[0])
            : props._range?.[0]
        }
        max={
          props._range?.[1] instanceof Date
            ? intoInputDate(props._range?.[1])
            : props._range?.[1]
        }
        minLength={props._length?.[0]}
        maxLength={props._length?.[1]}
        style={props._style}
      />
    );
  }

  // ---------------------------------------------------------------------- REFRESH ON COMMAND LINK
  if (props._refresh_onCommand) {
    props._refresh_onCommand.refresh = () => {
      if (ref.current) {
        const input = ref.current as HTMLInputElement;
        handleChange({ target: input }, true);
        handleBlur({ target: input });
      }
      refresh();
    };
  }

  // ---------------------------------------------------------------------- USE EFFECT
  useEffect(() => {
    if (ref.current) {
      const input = ref.current as HTMLInputElement;
      handleChange({ target: input });
      handleBlur({ target: input });
    }
  }, [handleChange, handleBlur]);

  // ---------------------------------------------------------------------- RETURN
  return (
    <>
      {props._label && (
        <label htmlFor={id} className={showError && "invalid"}>
          {props._label + (props._required ? "*" : "")}
        </label>
      )}

      {props._withWrapper ? (
        <div className="wrapper">
          {input}

          {typeof props._select_from === "object" && (
            <datalist id={id + "-list"}>
              {props._select_from.map((value, index) => (
                <option key={index} value={value} />
              ))}
            </datalist>
          )}

          {props._withWarning && (
            <div
              className="wrapper warning"
              style={{ visibility: showError ? "visible" : "hidden" }}
            >
              ⚠️ <div className="wrapper floating">{"*" + showError}</div>
            </div>
          )}

          {props.children}
        </div>
      ) : (
        <>
          {input}

          {typeof props._select_from === "object" && (
            <datalist id={id + "-list"}>
              {props._select_from.map((value, index) => (
                <option key={index} value={value} />
              ))}
            </datalist>
          )}

          {props._withWarning && (
            <div
              className="wrapper warning"
              style={{ visibility: showError ? "visible" : "hidden" }}
            >
              ⚠️ <div className="wrapper floating">{"*" + showError}</div>
            </div>
          )}

          {props.children}
        </>
      )}
    </>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const Input = styled(_Input).attrs((props: InputProps): InputProps => {
  let letterSpacing = "";
  // ---------------------------------------------------------------------- PRESETS
  if (props._preset === "email") {
    props = {
      _validator: /^[\w-.]+@(?:[\w-]+\.)+[\w-]{2,4}$/,
      _validator_text: "Ingrese un email válido.",
      _charset: /[^\w-.@]/,
      _charset_text:
        "Solo se admiten letras, números y los siguientes caracteres: _ @ . -",
      _required: "*",
      _width: "m",
      ...props,
    };
  } else if (props._preset === "int") {
    letterSpacing = "1px";
    props = {
      _validator: /^-?[\d]+$/,
      _validator_text: "Ingrese un número entero válido.",
      _charset: /[^-\d]/,
      _charset_text: "Solo se admiten números y el signo negativo -",
      _required: "*",
      _as_number: true,
      _width: "xs",
      ...props,
    };
  } else if (props._preset === "float") {
    letterSpacing = "1px";
    props = {
      _validator: /^-?[\d]+(?:\.\d+)?$/,
      _validator_text: "Ingrese un número válido.",
      _charset: /[^-\d]/,
      _charset_text:
        "Solo se admiten números, punto decimal . y el signo negativo -",
      _required: "*",
      _as_number: true,
      _width: "xs",
      ...props,
    };
  } else if (props._preset === "money") {
    letterSpacing = "1px";
    props = {
      _validator: /^\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?$|^\$?\d+(?:\.\d+)?$/,
      _validator_text: "Ingrese una cantidad monetaria válida.",
      _charset: /[^$\d.,]/,
      _charset_text:
        "Solo se admiten números, punto decimal . y los signos $ , ",
      _required: "*",
      _as_number: true,
      _width: "s",
      ...props,
    };
  } else if (props._preset === "tel") {
    letterSpacing = "1px";
    props = {
      _validator: /^(?:\+?(?:-| )?\d){10,13}$/,
      _validator_text: "Ingrese número de teléfono válido.",
      _charset: /[^\d- ]/,
      _charset_text: "Solo se admiten números y el signo -",
      _required: "*",
      _width: "s",
      ...props,
    };
  } else if (props._preset === "name") {
    props = {
      _charset: /[^A-Z ñáéíóú'ü.()+]/i,
      _charset_text:
        "Solo se admiten letras, espacios, tildes (á ñ ü) y los caracteres ' . ( ) +",
      _required: "*",
      _tooltip:
        "Ingrese un nombre completo válido, separado con espacios donde sea necesario.",
      _width: "l",
      ...props,
    };
  } else if (props._preset === "date") {
    props = {
      _tooltip: "Ingrese una fecha válida.",
      _required: "*",
      _type: "date",
      _width: "s",
      ...props,
    };
  } else if (props._preset === "two names") {
    props = {
      _placeholder: "Ejemplo: 'Nombre apellido y nombre apellido'",
      _type: "textarea",
      _charset: /[^A-Z ñáéíóú'ü,.&\n()+]/i,
      _charset_text:
        "Solo se admiten letras, espacios, tildes (á ñ ü) y los caracteres ' . , & ( ) +",
      _validator: /^[^&,]+(?:,|&| y )[^,&]+$/i,
      _validator_text:
        "Ingrese un par de nombres separados por alguno de los siguientes: 'y' ',' '&'.",
      _required: "*",
      _width: "l",
      ...props,
    };
  } else if (props._preset === "boolean") {
    props = {
      _options_as_radio: true,
      _options: new Map([
        ["No", false],
        ["Si", true],
      ]),
      ...props,
    };
  } else if (props._preset === "sexo") {
    props = {
      _options_as_radio: true,
      _options: new Map([
        ["Hombre", false],
        ["Mujer", true],
      ]),
      ...props,
    };
  }

  if (props._required === "-" || props._disabled) props._required = undefined;
  else if (props._required === "*")
    props._required = "Este campo no puede quedar vacío.";

  if (!props._name) {
    props._name = parseID(props._label || "", true);
  }

  let ww = ""; // "70%"
  if (!props._width) {
    if (props._type === "textarea") props._width = "l";
    else if (props._type === "text") props._width = "l";
    else if (props._type === "date") props._width = "s";
    else if (props._as_number) props._width = "xs";
    else if (props._length?.[1]) ww = props._length[1] + "ch";
  }

  if (props._width === "max") ww = "100%";
  else if (props._width === "xs") ww = "10ch";
  else if (props._width === "s") ww = "16ch";
  else if (props._width === "m") ww = "25ch";
  else if (props._width === "l") ww = "35ch";
  else if (props._width === "xl") ww = "50ch";
  else if (props._width !== undefined) ww = props._width + "ch";

  if (props._type === "checkbox" || props._options) {
    ww = "";
    props = {
      _label: "Seleccione:",
      _placeholder: "Seleccione",
      _validator_text: "",
      _charset_text: "",
      ...props,
    };
  }

  return {
    _label: "Nuevo input:",
    _type: "text",
    _placeholder: "<Vacío>",
    _validator_text: "El valor ingresado no es válido.",
    _charset_text: "Se puede ingresar cualquier texto.",
    _tooltip: "",
    _range_text: [
      "No se permiten valores por debajo de ",
      "No se permiten valores por encima de ",
    ],
    _style: {
      width: ww,
      maxWidth: props._width === "max" ? "100%" : undefined,
      letterSpacing,
      ...props._style,
    },
    _withWrapper: true,
    ...props,
  };
})<InputProps>`
  ${(props) => css`
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default Input;
// #endregion
