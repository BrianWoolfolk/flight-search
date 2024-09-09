import styled, { css } from "styled-components";
import { parseCSS, timeBetween } from "scripts/FunctionsBundle";
import { Dictionary, FlightSegment, TravelerPricing } from "@utils/ClassTypes";
import { getDuration, parseFlightTime } from "scripts/FlightFunctions";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// DetailSegment => Rename all instances to use (CTRL + SHIFT + L)
type DetailSegmentProps = {
  _data: FlightSegment;
  _dictionary: Dictionary;
  _index: number;
  _travelerPricing: TravelerPricing;
  _prevArrival?: string;
} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _DetailSegment = (props: DetailSegmentProps) => {
  /** Shortcut. Departure for this segment. */
  const depa = props._data.departure;
  /** Shortcut. Arrival for this segment. */
  const arri = props._data.arrival;

  /** Shortcut. Locations dictionary. */
  const locs = props._dictionary.locations;
  /** Shortcut. Carriers dictionary. */
  const cars = props._dictionary.carriers;

  /** Shortcut. FareDetails for this segment. */
  const fareDetails = props._travelerPricing.fareDetailsBySegment[props._index];

  let awaitTime = "";
  if (props._prevArrival) {
    awaitTime = "(";
    const timObj = timeBetween(
      new Date(props._prevArrival),
      new Date(props._data.departure.at!)
    );
    if (timObj.hours) awaitTime += timObj.hours + "hr(s) ";
    if (timObj.minutes) awaitTime += timObj.minutes + "min(s) ";
    awaitTime += "after previous segment)";
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <div className="content">
        <span>
          <b>Segment {props._index + 1}</b> {awaitTime}
        </span>

        <span className="segment-datetime">
          {parseFlightTime(depa.at!, arri.at!)}
        </span>

        <span className="segment-airports">
          {locs[depa.iataCode]?.name} ({depa.iataCode}) -{" "}
          {locs[arri.iataCode]?.name} ({arri.iataCode})
        </span>

        {props._data.stops && (
          <>
            <b>With stops in:</b>
            <ol>
              {props._data.stops.map((stop, i) => (
                <li key={i}>
                  {locs[stop.iataCode]?.name} ({stop.iataCode}) <br />
                  {parseFlightTime(stop.departureAt!, stop.arrivalAt!)} (
                  {getDuration(stop.duration)})
                </li>
              ))}
            </ol>
          </>
        )}

        <span>
          {cars[props._data.carrierCode]} ({props._data.carrierCode})
          {props._data.operating &&
          props._data.operating.carrierCode !== props._data.carrierCode ? (
            <>
              <br />
              Operated by {cars[props._data.operating.carrierCode]} (
              {props._data.operating.carrierCode})
            </>
          ) : (
            <></>
          )}
        </span>

        <span>Flight number: {props._data.number}</span>

        <span>
          Aircraft type: {props._dictionary.aircraft[props._data.aircraft.code]}{" "}
          ({props._data.aircraft.code})
        </span>
      </div>

      <div className="fare-details">
        <span>Traveler fare details</span>

        <span>Cabin: {fareDetails.cabin}</span>
        <span>Class: {fareDetails.class}</span>
        <span>Amenities: </span>

        <ol className="amenities">
          {fareDetails.amenities?.map((amen, i) => (
            <li key={i}>
              {amen.description} (
              {amen.isChargeable ? "Chargeable" : "Not Chargeable"})
            </li>
          )) || "None"}
        </ol>
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

    .fare-details {
      display: flex;
      flex-direction: column;

      .amenities {
        margin-left: 1.5rem;

        > li {
          padding-bottom: 0.5em;
        }
      }
    }

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default DetailSegment;
// #endregion
