import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "@/types/movie";
import { mockShowtimes } from "@/types/show";
import "./BookingPage.css";

type BookingRouteParams = {
  movie_id: string;
  show_id: string;
};

function BookingPage() {
  // Retrieve movie_id, show_id from the route in App.tsx
  const { movie_id, show_id } = useParams<BookingRouteParams>();
  const [movie, setMovie] = useState<Movie | null>(null);

  // For HTTP errors
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [adultTickets, setAdultTickets] = useState<number>(0);
  const [childTickets, setChildTickets] = useState<number>(0);
  const [seniorTickets, setSeniorTickets] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Find the mock showtime matching the show_id
  const show = mockShowtimes.find((candidate) => candidate.id === Number(show_id));

  // Set movieTitle and showtime. If the title or time are null set to unknown
  const movieTitle = movie?.title ?? "Unknown Movie";
  const showtime = show?.time ?? "Unknown Showtime";
  const showDate = show?.date.toDateString() ?? "Unknown Show Date";

  // Retrieve movie details for movie title
  useEffect(() => {
    const movieId = Number(movie_id);

    if (!movie_id || Number.isNaN(movieId)) {
      setError("Invalid movie ID provided in URL.");
      setIsLoading(false);
      return;
    }

    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8080/movies/${movie_id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch movie details (Status: ${response.status})`);
        }

        setMovie(await response.json() as Movie);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [movie_id]);

  if (isLoading) {
    return <div>Loading booking details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const adultPrice: number = 12.00;
  const childPrice: number = 8.00;
  const seniorPrice: number = 10.00;

  const toggleSeat = (seat: string): void => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(
        selectedSeats.filter(
          (selectedSeat) => selectedSeat !== seat
        )
      );
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const total: number =
    adultTickets * adultPrice +
    childTickets * childPrice +
    seniorTickets * seniorPrice;

  return (
    <div className="booking-page">

      {/* Page header */}
      <div className="booking-header">
        <h1>Book Your Tickets</h1>

        <div className="booking-movie-info">
          <strong>{movieTitle}</strong>
          <span> — {showtime} : {showDate}</span>
        </div>
      </div>


      {/* Main booking content */}
      <div className="booking-content">

        {/* Ticket selection */}
        <section className="ticket-section">
          <h2>Tickets</h2>

          <div className="ticket-row">
            <span className="ticket-type">
              Adult
            </span>

            <span className="ticket-price">
              ${adultPrice.toFixed(2)}
            </span>

            <input
              className="ticket-quantity"
              type="number"
              min="0"
              value={adultTickets}
              onChange={(e) =>
                setAdultTickets(Number(e.target.value))
              }
            />
          </div>

          <div className="ticket-row">
            <span className="ticket-type">
              Child
            </span>

            <span className="ticket-price">
              ${childPrice.toFixed(2)}
            </span>

            <input
              className="ticket-quantity"
              type="number"
              min="0"
              value={childTickets}
              onChange={(e) =>
                setChildTickets(Number(e.target.value))
              }
            />
          </div>

          <div className="ticket-row">
            <span className="ticket-type">
              Senior
            </span>

            <span className="ticket-price">
              ${seniorPrice.toFixed(2)}
            </span>

            <input
              className="ticket-quantity"
              type="number"
              min="0"
              value={seniorTickets}
              onChange={(e) =>
                setSeniorTickets(Number(e.target.value))
              }
            />
          </div>
        </section>


        {/* Seating */}
        <section className="seating-section">
          <h2>Select Your Seats</h2>

          <div className="cinema-screen">
            SCREEN
          </div>

          <div className="seat-layout">

            {["A", "B", "C", "D", "E", "F"].map(
              (row: string) => (
                <div
                  className="seat-row"
                  key={row}
                >

                  <span className="row-label">
                    {row}
                  </span>

                  {[1, 2, 3, 4, 5, 6, 7, 8].map(
                    (number: number) => {

                      const seat: string =
                        `${row}${number}`;

                      return (
                        <button
                          key={seat}
                          className={
                            selectedSeats.includes(seat)
                              ? "seat selected"
                              : "seat"
                          }
                          onClick={() =>
                            toggleSeat(seat)
                          }
                        >
                          {number}
                        </button>
                      );
                    }
                  )}

                </div>
              )
            )}

          </div>
        </section>

      </div>


      {/* Booking summary */}
      <section className="booking-summary">

        <h2>Booking Summary</h2>

        <div className="booking-summary-row">
          <span>Movie</span>
          <span>{movieTitle}</span>
        </div>

        <div className="booking-summary-row">
          <span>Showtime</span>
          <span>{showtime}</span>
        </div>

        <div className="booking-summary-row">
          <span>Adult Tickets</span>
          <span>{adultTickets}</span>
        </div>

        <div className="booking-summary-row">
          <span>Child Tickets</span>
          <span>{childTickets}</span>
        </div>

        <div className="booking-summary-row">
          <span>Senior Tickets</span>
          <span>{seniorTickets}</span>
        </div>

        <div className="booking-summary-row">
          <span>Selected Seats</span>

          <span>
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "None"}
          </span>
        </div>

        <div className="booking-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button className="booking-continue">
          Continue
        </button>

      </section>

    </div>
  );
}

export default BookingPage;