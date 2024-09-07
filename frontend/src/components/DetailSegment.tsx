import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { Dictionary, FlightSegment } from "@utils/ClassTypes";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// DetailSegment => Rename all instances to use (CTRL + SHIFT + L)
type DetailSegmentProps = {
  _data: FlightSegment;
  _dictionary: Dictionary;
  _index: number;
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _DetailSegment = (props: DetailSegmentProps) => {
  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <div className="content">
        <span>Segment {props._index + 1}</span>

        <span>
          {props._data.departure.at?.slice(0, -3).replace("T", " ")} -{" "}
          {props._data.arrival.at?.slice(0, -3).replace("T", " ")}
        </span>

        <span>
          ({props._data.departure.iataCode}) - ({props._data.arrival.iataCode})
        </span>

        <span>
          {props._dictionary.carriers[props._data.carrierCode]} (
          {props._data.carrierCode})
        </span>

        <div className="img">
          <img src="https://picsum.photos/300" alt="Traveler fare details" />
        </div>
      </div>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const DetailSegment = styled(_DetailSegment).attrs(
  (props: DetailSegmentProps): DetailSegmentProps => {
    return { ...props };
  }
)<DetailSegmentProps>`
  ${(props) => css`
    margin: var(--margin-big);
    padding: 2em 1.75em;

    display: flex;
    background-color: var(--color-shadow-white);

    .content {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 1rem;
      position: relative;
    }

    .img {
      height: 100%;
      position: absolute;
      right: 0%;

      & > img {
        height: inherit;
      }
    }

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default DetailSegment;
// #endregion
