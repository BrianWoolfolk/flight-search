import styled, { css } from "styled-components";
import {
  fromInputDate,
  intoInputDate,
  parseCSS,
} from "scripts/FunctionsBundle";
import Input from "@components/Input";
import { useState } from "react";
import { GS } from "App";
import * as _T from "@utils/ClassTypes";
import { useNavigate } from "react-router";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// SearchFlightScreen => Rename all instances to use (CTRL + SHIFT + L)
type SearchFlightScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _SearchFlightScreen = (props: SearchFlightScreenProps) => {
  const [LS] = useState<{ timeout?: NodeJS.Timeout }>({});
  const [FormData] = useState<_T.FlightSearchParams>(
    new _T.FlightSearchParams()
  );
  const [IATAList, setIATAList] = useState<string[]>(
    JSON.parse(localStorage.getItem("IATACodes") || "[]")
  );

  const redirect = useNavigate();

  // ---------------------------------------------------------------------- GET IATA CODES
  async function getIATA(keyword: string, searchingFor: string) {
    if (!keyword.trim()) return;

    if (LS["prev_" + searchingFor] === keyword) return;
    LS["prev_" + searchingFor] = keyword;

    if (IATAList.includes(keyword)) return;

    const response = await fetch(
      "http://localhost:8080/searchIATA?keyword=" + keyword
    ).catch(() => {
      GS.setAlert({
        _message: "We're having trouble loading the Airports",
        _type: "warning",
      });
      return null;
    });

    // ERRORS DOES NOT HAVE DATA
    if (!response || !response.ok) return;

    const list = (await response.json()) as string[];
    localStorage.setItem("IATACodes", JSON.stringify(list));

    setIATAList([...new Set<string>([...IATAList, ...list])]);
  }

  // ---------------------------------------------------------------------- HANDLE CODES
  function handleDeparture(keyword: string) {
    clearTimeout(LS.timeout);
    LS.timeout = setTimeout(() => getIATA(keyword, "departure"), 1000);
  }

  function handleArrival(keyword: string) {
    clearTimeout(LS.timeout);
    LS.timeout = setTimeout(() => getIATA(keyword, "arrival"), 1000);
  }

  // ---------------------------------------------------------------------- HANDLE SUBMIT
  function handleSubmit(e) {
    e.preventDefault();

    const search = FormData.createSearch();
    GS.cache = { formData: FormData.createResults() };
    redirect("/results?" + search);
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <h1>Flight Search</h1>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Flight Information</legend>

          <Input
            _label="Departure Airport"
            _store={FormData}
            _store_var="originLocationCode"
            _required="*"
            _select_from={"airports-list"}
            _placeholder="Start writing to see suggestions..."
            _width={"xl"}
            _onChange={handleDeparture}
            _onBlur={(value, el) => {
              if (!IATAList.includes(value)) {
                el.setCustomValidity("Please select a option");
              }
            }}
          />

          <Input
            _label="Arrival Airport"
            _store={FormData}
            _store_var="destinationLocationCode"
            _required="*"
            _select_from={"airports-list"}
            _placeholder="Start writing to see suggestions..."
            _width={"xl"}
            _onChange={handleArrival}
            _onBlur={(value, el) => {
              if (!IATAList.includes(value)) {
                el.setCustomValidity("Please select a option");
              }
            }}
          />

          <datalist id={"airports-list"}>
            {IATAList.map((value, index) => (
              <option key={index} value={value} />
            ))}
          </datalist>

          <Input
            _label="Departure Date"
            _store={FormData}
            _store_var="departureDate"
            _preset="date"
            _range={[intoInputDate(new Date()), undefined, undefined]}
            _onChange={(val, el) => {
              const dd = fromInputDate(val);
              if (!dd || dd.getTime() <= Date.now())
                return "Please select a date in the future";
            }}
          />

          <Input
            _label="Return Date"
            _store={FormData}
            _store_var="returnDate"
            _preset="date"
            _required=""
            _range={[intoInputDate(new Date()), undefined, undefined]}
            _onChange={(val, el) => {
              if (!val) return "";

              const dd = fromInputDate(val);
              if (!dd || dd.getTime() <= Date.now())
                return "Please select a date in the future";

              if (
                !FormData.departureDate ||
                dd.getTime() <= FormData.departureDate.getTime()
              )
                return (
                  "Return date must be after the departure date.\n" +
                  "Please select a valid date or leave empty for a non-return flight"
                );
            }}
          />

          <Input
            _label="Currency"
            _store={FormData}
            _store_var="currencyCode"
            _options={
              new Map([
                ["USD", _T.Currency.USD],
                ["MXN", _T.Currency.MXN],
                ["EUR", _T.Currency.EUR],
              ])
            }
          />

          <Input
            _store={FormData}
            _store_var="adults"
            _label="No. of adults"
            _required="*"
            _preset="int"
            _range={[1, undefined, false]}
            _as_number
            _width={"s"}
          />

          <Input
            _label="Flight type"
            _store={FormData}
            _store_var="nonStop"
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

        <button>Search</button>
      </form>
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
