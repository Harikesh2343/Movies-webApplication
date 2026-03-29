import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMovieDetails, createMovieInDatabase, newBooking } from "../../api-helpers/api-helpers";
import axios from "axios";

const TIMINGS = ["07:30 PM", "11:30 PM", "03:30 AM"];
const TICKET_PRICE = 250;


const LAYOUT = [

  { left: ["A", "B"], right: null, centered: true },
  { left: ["C", "D"], right: ["E", "F"], centered: false },
  { left: ["G", "H"], right: ["I", "J"], centered: false },
];
const COLS = 9;

const Booking = () => {
  const [movie, setMovie] = useState(null);
  const [dbMovieId, setDbMovieId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTiming, setSelectedTiming] = useState(TIMINGS[0]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [preparingMovie, setPreparingMovie] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);

  const id = useParams().id;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");

  const totalPrice = TICKET_PRICE * selectedSeats.length;
  const canPay = !loading && !preparingMovie && dbMovieId && selectedSeats.length > 0 && date;

  useEffect(() => {
    const loadMovie = async () => {
      if (source === "database") {
        try {
          const res = await axios.get(`/movie/${id}`);
          if (res.data?.movie) {
            setMovie({
              title: res.data.movie.title,
              overview: res.data.movie.description,
              poster_path: res.data.movie.posterUrl,
              release_date: res.data.movie.releaseDate,
              actors: res.data.movie.actors,
              bookings: res.data.movie.bookings || [],
            });
            setDbMovieId(id);
          }
        } catch (err) { console.log(err); }
      } else {
        try {
          const res = await getMovieDetails(id);
          if (res?.movie) {
            setMovie(res.movie);
            setPreparingMovie(true);
            const dbRes = await createMovieInDatabase(res.movie);
            setPreparingMovie(false);
            if (dbRes?.movie) {
              setDbMovieId(dbRes.movie._id);
              setMovie(prev => ({ ...prev, bookings: dbRes.movie.bookings || [] }));
            }
          }
        } catch (err) { console.log(err); setPreparingMovie(false); }
      }
    };
    loadMovie();
  }, [id, source]);

  useEffect(() => {
    if (movie?.bookings && date && selectedTiming) {
      const actualBooked = movie.bookings
        .filter((b) => b.date === date && b.time === selectedTiming)
        .map((b) => b.seatNumber);
      setBookedSeats(actualBooked);
    } else {
      setBookedSeats([]);
    }
  }, [movie, date, selectedTiming]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const getSeatClass = (seat) => {
    if (bookedSeats.includes(seat))
      return "bg-white/5 border border-white/5 text-white/15 cursor-not-allowed";
    if (selectedSeats.includes(seat))
      return "bg-red-900 border border-red-500 text-white shadow-lg shadow-red-900/50 scale-105 cursor-pointer";
    return "bg-transparent border border-white/20 text-stone-300 hover:bg-red-900/30 hover:border-red-700 hover:text-white cursor-pointer transition-all duration-150";
  };

  // Renders a block of rows x 9 cols
  const SeatBlock = ({ rows }) => (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row} className="flex gap-2">
          {Array.from({ length: COLS }, (_, i) => {
            const seat = `${row}${i + 1}`;
            return (
              <button
                key={seat}
                type="button"
                onClick={() => toggleSeat(seat)}
                className={`w-10 h-9 rounded-md text-[11px] font-medium ${getSeatClass(seat)}`}
              >
                {seat}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  const handlePayment = async () => {
    if (!dbMovieId) { alert("Movie is not ready. Please try again."); return; }
    if (selectedSeats.length === 0) { alert("Please select at least one seat."); return; }
    if (!date) { alert("Please select a booking date."); return; }

    try {
      setLoading(true);
      const { data: keyData } = await axios.get("/payment/get-key");
      const { key } = keyData;
      const { data: orderData } = await axios.post("/payment/create-order", { amount: totalPrice });
      if (!orderData.success) throw new Error("Failed to create payment order");
      const { order } = orderData;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "MovieApp Tickets",
        description: `${selectedSeats.length} seat(s) for ${movie.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              for (const seat of selectedSeats) {
                await newBooking({ seatNumber: seat, date, time: selectedTiming, movie: dbMovieId });
              }
              navigate(`/payment-success?reference=${response.razorpay_payment_id}&movie=${movie.title}`);
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed!");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") ,
          email: localStorage.getItem("userEmail"),
        },
        theme: { color: "#7f1d1d" },
        modal: { ondismiss: () => { setLoading(false); alert("Payment cancelled"); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const imageUrl = movie?.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/400x600";

  return (
    <div
      className="min-h-screen text-stone-200"
      style={{
        background:
          "radial-gradient(ellipse at 20% 60%, #2d0808 0%, #0a0a0a 50%), radial-gradient(ellipse at 80% 20%, #1a0404 0%, transparent 50%)",
        backgroundColor: "#0a0a0a",
      }}
    >
      {movie && (
        <Fragment>
          {/* Header */}
          <div className="text-center pt-10 pb-4 px-4">
            <p className="text-xs tracking-[6px] text-red-800 uppercase mb-2 font-medium">Now Booking</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-100 uppercase">
              {movie.title}
            </h1>
            <div className="w-16 h-0.5 bg-red-800 mx-auto mt-3" />
          </div>

          {preparingMovie && (
            <p className="text-center text-yellow-500 text-lg py-2 tracking-wide">
              ⏳ Preparing movie for booking…
            </p>
          )}

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 pb-12 pt-4">

            {/* LEFT: Movie info panel */}
            <div className="flex flex-col items-center gap-4 lg:w-64 flex-shrink-0">
              <img
                src={imageUrl}
                alt={movie.title}
                className="w-48 lg:w-full rounded-xl shadow-2xl shadow-black ring-1 ring-white/10"
              />
              <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <p className="text-stone-400 text-lg leading-relaxed line-clamp-4">{movie.overview}</p>
                {movie.vote_average && (
                  <p className="text-lg text-stone-300">
                    <span className="text-stone-500">Rating </span>{movie.vote_average}/10
                  </p>
                )}
                {movie.actors?.length > 0 && (
                  <p className="text-lg text-stone-300">
                    <span className="text-stone-500">Cast </span>{movie.actors.join(", ")}
                  </p>
                )}
                <p className="text-lg text-stone-300">
                  <span className="text-stone-500">Release </span>
                  {new Date(movie.release_date).toDateString()}
                </p>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-green-400 font-semibold">₹{TICKET_PRICE} per seat</p>
                </div>
              </div>

              {/* Timings */}
              <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs tracking-[4px] text-stone-500 uppercase mb-3">Available Timings</p>
                <div className="flex flex-col gap-2">
                  {TIMINGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTiming(t)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-lg font-medium border transition-all duration-150 ${
                        selectedTiming === t
                          ? "bg-red-900/60 border-red-700 text-white"
                          : "bg-transparent border-white/10 text-stone-400 hover:border-red-900 hover:text-stone-200"
                      }`}
                    >
                      <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                        <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs tracking-[4px] text-stone-500 uppercase mb-3">Booking Date</p>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-stone-200 text-lg outline-none focus:border-red-700 transition-colors"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>

            {/* RIGHT: Seat map + summary */}
            <div className="flex-1 flex flex-col gap-6">

              {/* Seat map */}
              <div
                className="rounded-2xl p-6 border border-white/10"
                style={{ background: "rgba(0,0,0,0.4)" }}
              >
                {/* Screen */}
                <div className="text-center mb-8">
                  <p className="text-lg font-bold text-stone-200 mb-4 tracking-wide">Select your seat</p>
                  <div
                    className="h-1.5 rounded-full mx-auto"
                    style={{
                      maxWidth: "600px",
                      background: "linear-gradient(90deg, transparent 0%, #6b0f0f 15%, #dc2626 50%, #6b0f0f 85%, transparent 100%)",
                      boxShadow: "0 0 20px rgba(185,28,28,0.4)",
                    }}
                  />
                  <p className="text-[10px] tracking-[6px] text-stone-600 mt-2 uppercase">Screen Side</p>
                </div>

                {/* Seat rows — matching screenshot layout */}
                <div className="overflow-x-auto">
                  <div className="flex flex-col items-center gap-6 min-w-[640px]">

                    {/* A & B — centered single block */}
                    <div className="flex flex-col gap-2">
                      <SeatBlock rows={["A", "B"]} />
                    </div>

                    {/* Gap */}
                    <div className="w-full h-px bg-white/5" />

                    {/* C–D (left) and E–F (right) */}
                    <div className="flex gap-12 w-full justify-center">
                      <SeatBlock rows={["C", "D"]} />
                      <SeatBlock rows={["E", "F"]} />
                    </div>

                    {/* Gap */}
                    <div className="w-full h-px bg-white/5" />

                    {/* G–H (left) and I–J (right) */}
                    <div className="flex gap-12 w-full justify-center">
                      <SeatBlock rows={["G", "H"]} />
                      <SeatBlock rows={["I", "J"]} />
                    </div>

                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-8 mt-8 justify-center flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <div className="w-5 h-4 rounded bg-transparent border border-white/20" />
                    Available
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <div className="w-5 h-4 rounded bg-red-900 border border-red-500" />
                    Selected
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <div className="w-5 h-4 rounded bg-white/5 border border-white/5" />
                    Booked
                  </div>
                </div>
              </div>

              {/* Summary + Pay */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-xs tracking-[4px] text-stone-500 uppercase mb-3">Payment Summary</p>

                {selectedSeats.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedSeats.map((s) => (
                      <span
                        key={s}
                        onClick={() => toggleSeat(s)}
                        title="Click to deselect"
                        className="px-2 py-0.5 bg-red-900/60 border border-red-700/50 rounded text-xs text-red-200 cursor-pointer hover:bg-red-800/60 transition-colors"
                      >
                        {s} ✕
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-2 text-lg">
                  <div className="flex justify-between text-stone-400">
                    <span>Seats selected</span>
                    <span className="text-stone-200">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Price per seat</span>
                    <span className="text-stone-200">₹{TICKET_PRICE}</span>
                  </div>
                  {selectedTiming && (
                    <div className="flex justify-between text-stone-400">
                      <span>Show time</span>
                      <span className="text-stone-200">{selectedTiming}</span>
                    </div>
                  )}
                  {date && (
                    <div className="flex justify-between text-stone-400">
                      <span>Date</span>
                      <span className="text-stone-200">{new Date(date).toDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base text-stone-100 border-t border-white/10 pt-2 mt-1">
                    <span>Total</span>
                    <span className="text-green-400">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canPay}
                  onClick={handlePayment}
                  className={`w-full mt-4 py-3.5 rounded-xl font-bold text-base tracking-widest uppercase transition-all duration-200 ${
                    canPay
                      ? "bg-gradient-to-r from-red-900 to-red-700 text-white hover:from-red-800 hover:to-red-600 shadow-lg shadow-red-900/40 hover:-translate-y-0.5"
                      : "bg-white/5 text-white/25 cursor-not-allowed"
                  }`}
                >
                  {loading
                    ? "Processing…"
                    : preparingMovie
                    ? "Preparing…"
                    : selectedSeats.length === 0
                    ? "Select Seats to Continue"
                    : !date
                    ? "Pick a Date"
                    : `Pay ₹${totalPrice} & Confirm`}
                </button>

                <p className="text-center text-xs text-stone-600 mt-3">
                  🔒 Secure payment powered by Razorpay
                </p>
              </div>

            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Booking;