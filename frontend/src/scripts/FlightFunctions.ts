import { Carriers, Itinerary, Locations } from "@utils/ClassTypes";

/** Prints time like "9/30/2024, 8:00 AM - 10:30 AM" depending of the itinerary passed */
export function getFlightTime(itin: Itinerary) {
  const firstDate = new Date(itin.segments[0].departure.at || "");
  const lastDate = new Date(
    itin.segments[itin.segments.length - 1].arrival.at || ""
  );

  return parseFlightTime(firstDate, lastDate);
}

/** Prints time like "9/30/2024, 8:00 AM - 10:30 AM" depending of dates given */
export function parseFlightTime(
  firstDate: string | Date,
  lastDate: string | Date
) {
  firstDate = typeof firstDate === "string" ? new Date(firstDate) : firstDate;
  lastDate = typeof lastDate === "string" ? new Date(lastDate) : lastDate;

  const firstHour = firstDate.toLocaleString().replace(":00 ", " ");
  let lastHour = "";

  // OMIT DATE IF SAME DAY
  if (firstDate.toLocaleDateString() === lastDate.toLocaleDateString()) {
    lastHour = lastDate.toLocaleTimeString().replace(":00 ", " ");
  } else {
    lastHour = lastDate.toLocaleString().replace(":00 ", " ");
  }

  return firstHour + " - " + lastHour;
}

/** Prints airports name & code, to know the origin and destination */
export function getFlightLocations(itin: Itinerary, locations: Locations) {
  const origIata = itin.segments[0].departure.iataCode;
  const destIata = itin.segments[itin.segments.length - 1].arrival.iataCode;

  const origAirline = locations[origIata].name;
  const destAriline = locations[destIata].name;

  return `${origAirline} (${origIata}) - ${destAriline} (${destIata})`;
}

/** Prints duration from a given string in format `PnYnMnDTnHnMnS`. Only grabs Hrs + Mins */
export function getDuration(str: string) {
  const reg = /T(?:(\d+)H)?(?:(\d+)M)?/;
  const match = reg.exec(str);
  let newStr = "";

  if (match) {
    newStr += match[1] ? match[1] + "h " : "";
    newStr += match[2] ? match[2] + "m" : "";
  }

  return newStr;
}

/** Prints all the flight stops if any. */
export function getFlightStops(itin: Itinerary) {
  const stopInfo: string[] = [];
  for (const segm of itin.segments) {
    if (segm.stops) {
      for (const fStop of segm.stops) {
        stopInfo.push(`${getDuration(fStop.duration)} in (${fStop.iataCode})`);
      }
    }
  }

  stopInfo.unshift(
    getDuration(itin.duration) +
      (stopInfo.length ? ` ${stopInfo.length} stop(s)` : " Nonstop")
  );

  return stopInfo;
}

/** Prints the airline for each segment of the flight. */
export function getCarriers(itin: Itinerary, carriers: Carriers) {
  const arr: string[] = [];

  for (const segm of itin.segments) {
    arr.push(carriers[segm.carrierCode] + ` (${segm.carrierCode})`);

    if (segm.operating && segm.operating.carrierCode !== segm.carrierCode) {
      arr.push(
        "Operated by " + carriers[segm.carrierCode] + ` (${segm.carrierCode})`
      );
    }
  }

  return [...new Set<string>(arr)];
}
