import styled, { css } from "styled-components";
import { parseCSS, parsePrice } from "scripts/FunctionsBundle";
import { useNavigate } from "react-router";
import { Dictionary, FlightOffer } from "@utils/ClassTypes";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// ResultCard => Rename all instances to use (CTRL + SHIFT + L)
type ResultCardProps = {
  _data: FlightOffer;
  _dictionary: Dictionary;
  _item: number;
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _ResultCard = (props: ResultCardProps) => {
  const navi = useNavigate();

  function getFlightTime() {
    const itin = props._data.itineraries[0];

    const firstHour = new Date(itin.segments[0].departure.at || "")
      .toLocaleTimeString()
      .replace(":00 ", "")
      .toLowerCase();

    const lastHour = new Date(
      itin.segments[itin.segments.length - 1].arrival.at || ""
    )
      .toLocaleTimeString()
      .replace(":00 ", "")
      .toLowerCase();

    return firstHour + " - " + lastHour;
  }

  function getFlightLocations() {
    const itin = props._data.itineraries[0];

    const origIata = itin.segments[0].departure.iataCode;
    const destIata = itin.segments[itin.segments.length - 1].arrival.iataCode;

    return `(${origIata}) - (${destIata})`;
  }

  function getDuration(str: string) {
    const reg = /T(?:(\d+)H)?(?:(\d+)M)?/;
    const match = reg.exec(str);
    let newStr = "";

    if (match) {
      newStr += match[1] ? match[1] + "h " : "";
      newStr += match[2] ? match[2] + "m" : "";
    }

    return newStr;
  }

  function getFlightStops() {
    const itin = props._data.itineraries[0];

    const stopInfo: string[] = [];
    for (const segm of itin.segments) {
      if (segm.stops) {
        for (const fStop of segm.stops) {
          stopInfo.push(
            `${getDuration(fStop.duration)} in (${fStop.iataCode})`
          );
        }
      }
    }

    stopInfo.unshift(
      getDuration(itin.duration) +
        (stopInfo.length ? ` ${stopInfo.length} stop(s)` : " Nonstop")
    );

    return stopInfo;
  }

  function getCarriers() {
    const itin = props._data.itineraries[0];
    const arr: string[] = [];

    for (const segm of itin.segments) {
      arr.push(
        props._dictionary.carriers[segm.carrierCode] + `(${segm.carrierCode})`
      );
    }

    return [...new Set<string>(arr)];
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className} onClick={() => navi(props._item + "")}>
      <div className="flight-time">{getFlightTime()}</div>

      <div>{getFlightLocations()}</div>

      <div className="flight-stops">
        {getFlightStops().map((val, i) => (
          <span key={i}>{val}</span>
        ))}
      </div>

      <div className="flight-carriers">
        {getCarriers().map((val, i) => (
          <span key={i}>{val}</span>
        ))}
      </div>

      <div className="flight-price">
        <div>
          <span>
            {parsePrice(props._data.price.grandTotal, true, 2, 2)}{" "}
            {props._data.price.currency}
          </span>
          <span>total</span>
        </div>

        <div>
          <span>
            {parsePrice(
              props._data.travelerPricings[0].price.total,
              true,
              2,
              2
            )}{" "}
            {props._data.travelerPricings[0].price.currency}
          </span>
          <span>per Traveler</span>
        </div>
      </div>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const ResultCard = styled(_ResultCard).attrs(
  (props: ResultCardProps): ResultCardProps => {
    return { ...props };
  }
)<ResultCardProps>`
  ${(props) => css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 2fr 1fr;
    background-color: var(--color-shadow-white);

    padding: 2em 1.75em;
    margin: var(--margin-big);

    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.95);
    }

    .flight-time {
      grid-column: 1 / 3;
    }

    .flight-stops,
    .flight-carriers {
      display: flex;
      flex-direction: column;
    }

    .flight-price {
      grid-column: 3;
      grid-row: 1 / -1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      & > div {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default ResultCard;
// #endregion
