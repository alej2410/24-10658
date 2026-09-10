///
/// List.tsx
///

import Table from "react-bootstrap/Table";


type Event = {
  name: string;
  loc: string;
  date: string;
};


const events: Event[] = [

  {
    name: "Lambda Days 2020",
    loc: "Kraków",
    date: "February 2020",
  },

  {
    name: "ICICT 2020 Demo Presentation",
    loc: "San Diego, CA",
    date: "March 2020",
  },

  {
    name: "ICICT 2021 Paper Presentation",
    loc: "Kahului, HI",
    date: "March 2021",
  },

  {
    name: "IEEE ITPC 2021",
    loc: "Ewing, NJ",
    date: "March 2021",
  },

  {
    name: "IEEE ITPC 2022",
    loc: "Ewing, NJ",
    date: "March 2022",
  },

  {
    name: "TFPIE 2023",
    loc: "Boston, MA",
    date: "January 2023",
  },

  {
    name: "TFP 2023",
    loc: "Boston, MA",
    date: "January 2023",
  },

  {
    name: "IEEE ISEC 2023",
    loc: "Baltimore, MD",
    date: "March 2023",
  },

  {
    name: "IEEE ITPC 2023",
    loc: "Ewing, NJ",
    date: "March 2023",
  },

  {
    name: "Academia Nacional de Ingeniería",
    loc: "Caracas",
    date: "May 2023",
  },

  {
    name: "TFP 2024",
    loc: "South Orange, NJ",
    date: "January 2024",
  },

  {
    name: "IEEE ITPC 2024",
    loc: "Ewing, NJ",
    date: "March 2024",
  },

  {
    name: "IFL 2024",
    loc: "Nijmegen",
    date: "August 2024",
  },

  {
    name: "ICFP 2024",
    loc: "Milano",
    date: "September 2024",
  },

  {
    name: "TFP 2025",
    loc: "Oxford",
    date: "January 2025",
  },

  {
    name: "IEEE ITPC 2025",
    loc: "Ewing, NJ",
    date: "March 2025",
  },

  {
    name: "ICEMT 2026",
    loc: "Macau, China",
    date: "September 2026",
  },
];


const List = () => {

  return (

    <section className="events-panel">

      <header className="events-header">

        <span className="events-kicker">
          RESEARCH LOG
        </span>

        <h3>
          Presentations at Conferences and Seminars
        </h3>

        <p>
          Scientific activity and technical dissemination
        </p>

      </header>


      {/*
       * Este div es quien hace scroll.
       *
       * El footer nunca tiene que moverse ni superponerse
       * sobre la tabla.
       */}
      <div className="events-table-scroll">

        <Table
          bordered
          hover
          variant="dark"
          className="events-table"
        >

          <thead>

            <tr>
              <th>Event</th>
              <th>Location</th>
              <th>Date</th>
            </tr>

          </thead>


          <tbody>

            {
              events.map(
                event => (

                  <tr key={event.name}>

                    <td>
                      {event.name}
                    </td>

                    <td>
                      {event.loc}
                    </td>

                    <td>
                      {event.date}
                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </Table>

      </div>

    </section>
  );
};


export default List;