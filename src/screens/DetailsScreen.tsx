import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import DetailSegment from "@components/DetailSegment";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// DetailsScreen => Rename all instances to use (CTRL + SHIFT + L)
type DetailsScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _DetailsScreen = (props: DetailsScreenProps) => {
  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <h1>DETAILS SCREEN</h1>

      <div className="detail-summary">
        <div className="detail-segments">
          <DetailSegment />

          <DetailSegment />

          <DetailSegment />

          <DetailSegment />

          <DetailSegment />

          <DetailSegment />
        </div>

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
