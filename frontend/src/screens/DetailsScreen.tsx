import styled, { css } from "styled-components";
import {
  ScrollToTopOnMount,
  parseCSS,
  parseNumber,
  parsePrice,
} from "scripts/FunctionsBundle";
import DetailSegment from "@components/DetailSegment";
import { Link, useParams, useRouteLoaderData } from "react-router-dom";
import { APIData } from "@utils/ClassTypes";
import ResultCard from "@components/ResultCard";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// DetailsScreen => Rename all instances to use (CTRL + SHIFT + L)
type DetailsScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _DetailsScreen = (props: DetailsScreenProps) => {
  const { data: loaderData } = useRouteLoaderData("results") as {
    data: APIData;
    search: JSX.Element;
  };
  const { index } = useParams();

  /** Shortcut. */
  const offer = loaderData.data[parseNumber(index || "")];

  function createSegments() {
    const arr: JSX.Element[] = [];

    for (const itin of offer.itineraries) {
      if (offer.itineraries.length > 1) {
        if (arr.length) arr.push(<h2 key={arr.length}>Return Trip</h2>);
        else arr.push(<h2 key={arr.length}>First Trip</h2>);
      }

      let i = 0;
      let prevArrival: string | undefined = undefined;
      for (const segm of itin.segments) {
        arr.push(
          <DetailSegment
            key={arr.length}
            _data={segm}
            _index={i}
            _dictionary={loaderData.dictionaries!}
            _travelerPricing={offer.travelerPricings[0]} // suppose every adult is the same
            _prevArrival={prevArrival}
          />
        );

        ++i;
        prevArrival = segm.arrival.at;
      }
    }

    return arr;
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <h1>DETAILS SCREEN</h1>

      <ScrollToTopOnMount />

      <Link to={"/results"} className="as-button login">
        {"< Go back"}
      </Link>

      <ResultCard
        _data={offer}
        _dictionary={loaderData.dictionaries!}
        _item={parseNumber(index || "")}
        _disabled
      />

      <div className="detail-summary">
        <div className="detail-segments">{createSegments()}</div>

        <div className="detail-breakdown">
          <h4>Price Breakdown</h4>

          <div>
            Base: {parsePrice(offer.price.base, true, 2, 2)}{" "}
            {offer.price.currency} <br />
            Fees:
            <ul className="detail-fees">
              {offer.price.fees?.map((fee, i) => (
                <li key={i}>
                  {fee.type}: {parsePrice(fee.amount, true, 2, 2)}{" "}
                  {offer.price.currency}
                </li>
              )) || " None"}
            </ul>
          </div>

          <span className="bold">
            Grand Total: {parsePrice(offer.price.grandTotal, true, 2, 2)}{" "}
            {offer.price.currency}
          </span>

          <div className="price-per-traveler">
            <span>Price per traveler</span>

            <ol>
              {offer.travelerPricings.map((tPrice, i) => (
                <li key={i}>
                  Type: {tPrice.travelerType} <br />
                  Base price: {parsePrice(tPrice.price.base, true, 2, 2)}{" "}
                  {tPrice.price.currency} <br />
                  Taxes:
                  {tPrice.price.taxes?.map((fee, i) => (
                    <li key={i}>
                      {fee.code}: {parsePrice(fee.amount, true, 2, 2)}{" "}
                      {tPrice.price.currency}
                    </li>
                  )) || " None"}{" "}
                  <br />
                  <span className="bold">
                    Total: {parsePrice(tPrice.price.total, true, 2, 2)}{" "}
                    {tPrice.price.currency}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const DetailsScreen = styled(_DetailsScreen).attrs(
  (props: DetailsScreenProps): DetailsScreenProps => {
    return { ...props };
  }
)<DetailsScreenProps>`
  ${(props) => css`
    .search-status {
      margin: var(--margin-big);
    }

    .detail-summary {
      display: flex;
    }

    .detail-segments {
      flex-grow: 7;
    }

    .detail-breakdown {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      flex-grow: 3;
      margin: var(--margin-big);
      padding: 2em 1.75em;
      background-color: var(--color-shadow-white);
      position: sticky;
      top: 1rem;
      height: fit-content;
      overflow: auto;
      max-height: calc(100svh - 2rem);
    }

    ol,
    ul {
      margin-left: 1.5rem;

      > li {
        padding-bottom: 0.5em;
      }
    }

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default DetailsScreen;
// #endregion
