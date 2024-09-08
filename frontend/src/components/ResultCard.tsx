import styled, { css } from "styled-components";
import { parseCSS, parsePrice } from "scripts/FunctionsBundle";
import { useNavigate } from "react-router";
import { Dictionary, FlightOffer } from "@utils/ClassTypes";
import {
  getFlightTime,
  getFlightLocations,
  getFlightStops,
  getCarriers,
} from "scripts/FlightFunctions";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// ResultCard => Rename all instances to use (CTRL + SHIFT + L)
type ResultCardProps = {
  _data: FlightOffer;
  _dictionary: Dictionary;
  _item: number;
  _disabled?: boolean;
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _ResultCard = (props: ResultCardProps) => {
  const navi = useNavigate();

  function handleClick() {
    if (!props._disabled) navi(props._item + "");
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className} onClick={handleClick}>
      <div className="flight-time">
        {getFlightTime(props._data.itineraries[0])}
      </div>

      <div>
        {getFlightLocations(
          props._data.itineraries[0],
          props._dictionary.locations
        )}
      </div>

      <div className="flight-stops">
        {getFlightStops(props._data.itineraries[0]).map((val, i) => (
          <span key={i}>{val}</span>
        ))}
      </div>

      <div className="flight-carriers">
        {getCarriers(
          props._data.itineraries[0],
          props._dictionary.carriers
        ).map((val, i) => (
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

    ${!props._disabled &&
    `
      cursor: pointer;

      &:hover {
        opacity: 0.9;
      }
  
      &:active {
        transform: scale(0.95);
      }
    `}

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
