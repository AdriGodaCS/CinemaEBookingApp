import { createContext, useContext, useEffect, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { TicketType } from '@/types/show'

// The in-progress order. It is saved in sessionStorage, so the chosen seats stay held for this browser
// session through the login redirect, a page refresh, and the checkout pages.
// TODO (final demo): replace with a server-side seat hold that expires after 5 minutes.
export interface BookingDraft {
    movieId: number
    movieTitle: string
    showId: number
    showDate: string
    showTime: string
    showroomId: number
    tickets: Record<TicketType, number>
    seats: string[]
    prices: Record<TicketType, number>
    email: string
}

interface BookingContextType {
    booking: BookingDraft | null
    setBooking: Dispatch<SetStateAction<BookingDraft | null>>
    clearBooking: () => void
}

const STORAGE_KEY = 'cinemaBookingDraft'

const BookingContext = createContext<BookingContextType | undefined>(undefined)

function loadDraft(): BookingDraft | null {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        return stored ? (JSON.parse(stored) as BookingDraft) : null
    } catch {
        return null
    }
}

export function BookingProvider({ children }: { children: ReactNode }) {
    const [booking, setBooking] = useState<BookingDraft | null>(loadDraft)

    useEffect(() => {
        try {
            if (booking) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking))
            else sessionStorage.removeItem(STORAGE_KEY)
        } catch {
            // Storage can be unavailable (private mode); the draft then lasts only until a refresh
        }
    }, [booking])

    const clearBooking = () => setBooking(null)

    return (
        <BookingContext.Provider value={{ booking, setBooking, clearBooking }}>
            {children}
        </BookingContext.Provider>
    )
}

export function useBooking() {
    const context = useContext(BookingContext)

    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider')
    }

    return context
}