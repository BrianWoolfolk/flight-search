import styled, { css } from "styled-components";
import { parseCSS, parseNumber } from "scripts/FunctionsBundle";
import DetailSegment from "@components/DetailSegment";
import { Link, useParams, useRouteLoaderData } from "react-router-dom";
import { APIData } from "@utils/ClassTypes";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// DetailsScreen => Rename all instances to use (CTRL + SHIFT + L)
type DetailsScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _DetailsScreen = (props: DetailsScreenProps) => {
  const loaderData = useRouteLoaderData("results") as APIData;
  const { index } = useParams();

  function createSegments() {
    const offer = loaderData.data[parseNumber(index || "")];
    const arr: JSX.Element[] = [];

    for (const itin of offer.itineraries) {
      if (offer.itineraries.length > 1) {
        if (arr.length) arr.push(<h2 key={arr.length}>First Trip</h2>);
        else arr.push(<h2 key={arr.length}>Return Trip</h2>);
      }

      let i = 0;
      for (const segm of itin.segments) {
        arr.push(
          <DetailSegment
            key={arr.length}
            _data={segm}
            _index={i}
            _dictionary={loaderData.dictionaries!}
          />
        );
        ++i;
      }
    }

    return arr;
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <h1>DETAILS SCREEN</h1>

      <Link to={"/results"} className="as-button login">
        {"< Go back"}
      </Link>

      <div className="detail-summary">
        <div className="detail-segments">{createSegments()}</div>

        <div className="detail-breakdown">
          <span>Price Breakdown</span>

          <p>
            Base <br />
            Feeds <br />
            Total
          </p>

          <img src="https://picsum.photos/200/500" alt="Per traveler" />
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

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default DetailsScreen;
// #endregion
