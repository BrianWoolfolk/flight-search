import styled, { css } from "styled-components";
import { parseCSS } from "scripts/FunctionsBundle";
import { Link } from "react-router-dom";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// LandingScreen => Rename all instances to use (CTRL + SHIFT + L)
type LandingScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _LandingScreen = (props: LandingScreenProps) => {
  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className}>
      <h1>Landing Screen</h1>

      <h2>README</h2>

      <p>
        Go to the <Link to={"/search"}>Search Screen</Link> to start.
      </p>

      <h3>SEARCH SCREEN</h3>

      <p>
        Enter all the desired values to make a request to Amadeus API. <br />
        To search for an <b>IATA code</b>, simply type inside the input a
        keyword to search for all the matched airports. <br />
        <b>NOTE:</b> The application saves all previously searched IATA codes in{" "}
        <code>localStorage</code> for it to save some time between requests.{" "}
        <br />
        Once all needed data is written, the API might take <i>
          20~ seconds
        </i>{" "}
        to respond given the amount of response entries.
      </p>

      <h3>RESULTS SCREEN</h3>

      <p>
        After the search, this screen will show all results found (if any).
        Always having the option to go back and make another search. <br />
        The pagination & sorting controls are handled by the <b>Frontend</b> in
        an attempt to avoid further delays, and because Amadeus doen't support a
        pagination method with the <code>flight offers</code>. That being said,
        here we can sort by <b>price</b> and <b>flight duration</b>. <br />
        We can see 10 results per page for a maximum of <b>100 items</b> (10
        pages). <br />
        To see more details for any given flight offer, we can simply click on
        the card.
      </p>

      <h3>DETAILS SCREEN</h3>

      <p>
        There's not much to say about this screen aside for it being{" "}
        <b>the only way to see exaclty all info</b> for a given flight offer.{" "}
        <br />
        Here it shows again the <code>Result Card</code> that we just clicked
        and also shows all <b>pricing information</b>. <br />
        As always, we can go back to see other flight offers.
      </p>

      <h2>CONSIDERATIONS</h2>

      <p>
        The only known problem unfortunately without any work-around yet is the{" "}
        <b>IATA Code names</b>. <br />
        As it appears, Amadeus API{" "}
        <strong>doen't have enough info about certain IATA Codes</strong>, which
        is handled in the backend but can result in{" "}
        <b>displaying incorrect airport names</b>, displaying <b>"undefined"</b>{" "}
        or <b>nothing at all</b> (aside from the code itself). <br />
        Although this is very rare, it only impacts the "<i>info-displaying</i>"
        part of the application.
      </p>
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const LandingScreen = styled(_LandingScreen).attrs(
  (props: LandingScreenProps): LandingScreenProps => {
    return { ...props };
  }
)<LandingScreenProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.
    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default LandingScreen;
// #endregion
