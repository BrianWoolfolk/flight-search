import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { useNavigate } from "react-router";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// ResultCard => Rename all instances to use (CTRL + SHIFT + L)
type ResultCardProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _ResultCard = (props: ResultCardProps) => {
  const navi = useNavigate();

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className} onClick={() => navi("/details")}>
      <div className="flight-time">1:40pm - 10:37pm</div>

      <div>San Francisco (SFO) - New York (JFK)</div>

      <div className="flight-stops">
        <span>5h 57m (1 stop)</span>
        <span>1h 3m in Los Angeles (LAX)</span>
      </div>

      <div>Delta (DL)</div>

      <div className="flight-price">
        <div>
          <span>$1,500.00 MXN</span>
          <span>total</span>
        </div>

        <div>
          <span>$500 MXN</span>
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

    .flight-stops {
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
