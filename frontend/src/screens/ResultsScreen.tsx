import styled, { css } from "styled-components";
import { parseCSS, parseNumber, useRefresh } from "scripts/FunctionsBundle";
import { Link, useRouteLoaderData } from "react-router-dom";
import ResultCard from "@components/ResultCard";
import { APIData } from "@utils/ClassTypes";
import Input from "@components/Input";
import { useCallback, useState } from "react";
import { getDuration } from "scripts/FlightFunctions";
import { Helmet } from "react-helmet";

// #region ##################################################################################### PROPS
type _Base = import("@utils/ClassTypes")._Base;
// ResultsScreen => Rename all instances to use (CTRL + SHIFT + L)
type ResultsScreenProps = {} & _Base;
// #endregion

// #region ##################################################################################### COMPONENT
const _ResultsScreen = (props: ResultsScreenProps) => {
  // ---------------------------------------------------------------------- ALL FLIGHT DATA
  const { data: loaderData, search: originalData } = useRouteLoaderData(
    "results"
  ) as {
    data: APIData;
    search: JSX.Element;
  };

  const [LS] = useState({ price: "ASC", duration: "ASC", order: true });
  const [page, setPage] = useState(1);
  const [refresh] = useRefresh();

  // ---------------------------------------------------------------------- HANDLE FILTERS
  function handleFilters() {
    function priceCompare(a, b) {
      const prcA = parseNumber(a.price.grandTotal);
      const prcB = parseNumber(b.price.grandTotal);

      return LS.price === "ASC" ? prcA - prcB : prcB - prcA;
    }

    function durationCompare(a, b) {
      let durA = 0;
      a.itineraries.forEach((it) => {
        durA += parseNumber(getDuration(it.duration, true));
      });

      let durB = 0;
      b.itineraries.forEach((it) => {
        durB += parseNumber(getDuration(it.duration, true));
      });

      return LS.duration === "ASC" ? durA - durB : durB - durA;
    }

    loaderData?.data?.sort((a, b) => {
      const first = LS.order ? priceCompare(a, b) : durationCompare(a, b);
      const second = LS.order ? durationCompare(a, b) : priceCompare(a, b);

      return first === 0 ? second : first;
    });

    refresh();
  }

  // ---------------------------------------------------------------------- SHOW PART OF ARRAY
  const showFrom = useCallback(() => {
    const maxCount = Math.min(page * 10, loaderData?.data?.length || 0);
    const start = Math.max((page - 1) * 10, 0);
    const items: JSX.Element[] = [];

    for (let i = start; i < maxCount; i++) {
      items.push(
        <ResultCard
          key={i}
          _data={loaderData.data[i]}
          _dictionary={loaderData.dictionaries!}
          _item={i}
        />
      );
    }

    return items;
  }, [loaderData.data, loaderData.dictionaries, page]);

  // ---------------------------------------------------------------------- CREATE PAGINATION
  const createPagination = useCallback(() => {
    const maxCount = Math.ceil((loaderData?.data?.length || 0) / 10);
    const buttons: JSX.Element[] = [];

    for (let i = 1; i <= maxCount; i++) {
      buttons.push(
        <button key={i} onClick={() => setPage(i)} disabled={page === i}>
          Page {i}
        </button>
      );
    }

    return <div className="pagination">{buttons}</div>;
  }, [loaderData?.data?.length, page]);

  // ---------------------------------------------------------------------- RETURN INCORRECT DATA
  if (!loaderData?.data?.length || !loaderData?.dictionaries) {
    return (
      <div className={props.className + " screen"}>
        <Helmet>
          <title>No Flights Found | Flight Search</title>
        </Helmet>

        <h1>Results Screen</h1>

        <h3>No flights found</h3>

        <div className="flex-row-center">
          <Link className="as-button warning" to="/search">
            Search another
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------- RETURN
  return (
    <div className={props.className + " screen"}>
      <Helmet>
        <title>See Results | Flight Search</title>
      </Helmet>

      <h1>Results Screen</h1>

      <Link to={"/search"} className="as-button login">
        {"< Return to Search"}
      </Link>

      <fieldset>
        <legend>Search controls</legend>

        <Input
          _label="Sort by price"
          _store={LS}
          _store_var="price"
          _options={
            new Map([
              ["Lower first", "ASC"],
              ["Higher first", "DESC"],
            ])
          }
        />

        <Input
          _label="Sort by duration"
          _store={LS}
          _store_var="duration"
          _options={
            new Map([
              ["Lower first", "ASC"],
              ["Higher first", "DESC"],
            ])
          }
        />

        <Input
          _label="Sort by price first"
          _store={LS}
          _store_var="order"
          _type="checkbox"
        />

        <button onClick={handleFilters}>Apply filters</button>
      </fieldset>

      {originalData}

      {createPagination()}

      {showFrom()}

      {createPagination()}
    </div>
  );
};
// #endregion

// #region ##################################################################################### STYLES
const ResultsScreen = styled(_ResultsScreen).attrs(
  (props: ResultsScreenProps): ResultsScreenProps => {
    return { ...props };
  }
)<ResultsScreenProps>`
  ${(props) => css`
    // Ingresa aquí todos los estilos.

    .search-status {
      margin: var(--margin-big);
      margin-left: 0;
      margin-right: 0;
    }

    .pagination {
      display: flex;
      justify-content: space-around;
    }

    ${parseCSS(props._style)}
  `}
`;
// #endregion

// #region ##################################################################################### EXPORTS
export default ResultsScreen;
// #endregion
