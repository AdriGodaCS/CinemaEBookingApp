// Matches the backend Show model (JSON property names are camelCase).
// showDate is "YYYY-MM-DD" and showTime is 24-hour "HH:mm", for example "2026-10-15" and "19:30".
export interface Show {
    id: number
    movieId: number
    showroomId: number
    showDate: string
    showTime: string
    durationMinutes: number
    status: string
}

export type TicketType = 'ADULT' | 'CHILD' | 'SENIOR'

export const TICKET_TYPES: TicketType[] = ['ADULT', 'CHILD', 'SENIOR']

export const TICKET_LABELS: Record<TicketType, string> = {
    ADULT: 'Adult',
    CHILD: 'Child',
    SENIOR: 'Senior',
}

// Seat layout for one show. unavailableSeats holds seats that are already booked or held by someone else.
export interface SeatMap {
    showId: number
    rows: string[]
    seatsPerRow: number
    // Total seats in the showroom; the last row may have fewer than seatsPerRow seats
    seatCount: number
    unavailableSeats: string[]
    // Frontend-only: false when the server could not tell us which seats are booked
    availabilityKnown?: boolean
}