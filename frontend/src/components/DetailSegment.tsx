import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// DetailSegment => Rename all instances to use (CTRL + SHIFT + L)
type DetailSegmentProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _DetailSegment = (props: DetailSegmentProps) => {
  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <div className="content">
        <span>Segment 1</span>

        <span>YYYY-MM-DD HH:mm - YYYY-MM-DD HH:mm</span>

        <span>San Francisco (SFO) - New York (JFK)</span>

        <span>Aeromexico (AM) 65AM</span>

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
