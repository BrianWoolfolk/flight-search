import styled, { css } from "styled-components";
import {
  fromInputDate,
  intoInputDate,
  parseCSS,
} from "scripts/FunctionsBundle";
import Input from "@components/Input";
import { useState } from "react";
import { Form, Link } from "react-router-dom";
import IATA from "@utils/airports.json";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// SearchFlightScreen => Rename all instances to use (CTRL + SHIFT + L)
type SearchFlightScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _SearchFlightScreen = (props: SearchFlightScreenProps) => {
  const [LS, setLS] = useState<any>({});

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <h1>Flight Search</h1>

      <Form method="POST" action="/results">
        <fieldset>
          <legend>Flight Information</legend>

          <Input
            _label="Departure Airport"
            _name="departure"
            _store={LS}
            _store_var="departure"
            _required="*"
            _select_from={"airports-list"}
            _width={"xl"}
            _onBlur={(value, el) => {
              if (!IATA.codes.includes(value)) return "Please select a option";
            }}
          />

          <Input
            _label="Arrival Airport"
            _store={LS}
            _name="arrival"
            _store_var="arrival"
            _required="*"
            _select_from={"airports-list"}
            _width={"xl"}
            _onBlur={(value, el) => {
              if (!IATA.codes.includes(value)) return "Please select a option";
            }}
          />

          <datalist id={"airports-list"}>
            {IATA.codes.map((value, index) => (
              <option key={index} value={value} />
            ))}
          </datalist>

          <Input
            _label="Departure Date"
            _store={LS}
            _store_var="departure_date"
            _preset="date"
            _range={[intoInputDate(new Date()), undefined, undefined]}
            _onChange={(val, el) => {
              if (fromInputDate(val).getTime() <= Date.now())
                return "Please select a date in the future";
            }}
          />

          <Input
            _label="Return Date"
            _store={LS}
            _store_var="return_date"
            _preset="date"
            _required=""
            _range={[intoInputDate(new Date()), undefined, undefined]}
            _onChange={(val, el) => {
              if (!val) return "";

              if (fromInputDate(val).getTime() <= Date.now())
                return "Please select a date in the future";

              if (
                !LS["departure_date"] ||
                fromInputDate(val).getTime() <= LS["departure_date"].getTime()
              )
                return (
                  "Return date must be after the departure date.\n" +
                  "Please select a valid date or leave empty for a non-return flight"
                );
            }}
          />

          <Input
            _label="Currency"
            _store={LS}
            _store_var="currency"
            _options={
              new Map([
                ["USD", "usd"],
                ["MXN", "mxn"],
                ["EUR", "eur"],
              ])
            }
          />

          <Input
            _label="Flight type"
            _store={LS}
            _store_var="non_stop"
            _options_as_radio
            _options={
              new Map([
                ["Non-stop", true],
                ["With stops", false],
              ])
            }
            _style={{ flexDirection: "row" }}
          />
        </fieldset>

        <button>Enviar</button>
      </Form>

      <Link to={"/results"}>Search</Link>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const SearchFlightScreen = styled(_SearchFlightScreen).attrs(
  (props: SearchFlightScreenProps): SearchFlightScreenProps => {
    return { ...props };
  }
)<SearchFlightScreenProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default SearchFlightScreen;
// #endregion
