///
/// List.jsx
///

import Table from "react-bootstrap/Table";

type Event = { name: string, loc: string, date: string };

const events: Event[] = [
  { name: "Lambda Days 2020", loc: "Kraków", date: "February 2020" },
  { name: "ICICT 2020 Demo Presentation", loc: "San Diego, CA", date: "March 2020" },
  { name: "ICICT 2021 Paper Presentation", loc: "Kahului, HI", date: "March 2021" },
  { name: "IEEE ITPC 2021", loc: "Ewing, NJ", date: "March 2021" },
  { name: "IEEE ITPC 2022", loc: "Ewing, NJ", date: "March 2022" },
  { name: "TFPIE 2023", loc: "Boston, MA", date: "January 2023" },
  { name: "TFP 2023", loc: "Boston, MA", date: "January 2023" },
  { name: "IEEE ISEC 2023", loc: "Baltimore, MD", date: "March 2023" },
  { name: "IEEE ITPC 2023", loc: "Ewing, NJ", date: "March 2023" },
  { name: "Academia Nacional de Ingeniería", loc: "Caracas", date: "May 2023" },
  { name: "TFP 2024", loc: "South Orange, NJ", date: "January 2024" },
  { name: "IEEE ITPC 2024", loc: "Ewing, NJ", date: "March 2024" },
  { name: "IFL 2024", loc: "Nijmegen", date: "August 2024" },
  { name: "ICFP 2024", loc: "Milano", date: "September 2024" },
  { name: "TFP 2025", loc: "Oxford", date: "January 2025" },
  { name: "IEEE ITPC 2025", loc: "Ewing, NJ", date: "March 2025" },
  { name: "ICEMT 2026", loc: "Macau, China", date: "September 2026" }
];

const header = (
  <tr>
    <th>Event</th>
    <th>Location</th>
    <th>Date</th>
  </tr>
);

const row = (item: Event) => (
  <tr key={item.name}>
    <td>{item.name}</td>
    <td>{item.loc}</td>
    <td>{item.date}</td>
  </tr>
);

const body = <tbody>{events.map(row)}</tbody>;

const table = (
  <div className="Main-events">
    <h5>Presentations at Conferences and Seminars</h5>
    <Table striped bordered hover variant="dark">
      {header}
      {body}
    </Table>
  </div>
);

function Events() {
  return table;
}

export default Events;
