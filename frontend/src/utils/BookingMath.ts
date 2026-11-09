import type { BookingDraft } from '@/context/BookingContext'
import { TICKET_TYPES } from '@/types/show'

export function getTotalTickets(booking: BookingDraft): number {
    return TICKET_TYPES.reduce((sum, type) => sum + booking.tickets[type], 0)
}

// Total before tax
export function getSubtotal(booking: BookingDraft): number {
    return TICKET_TYPES.reduce((sum, type) => sum + booking.tickets[type] * booking.prices[type], 0)
}

// A draft can go to checkout only when it has tickets and exactly one seat per ticket
export function isBookingComplete(booking: BookingDraft | null): booking is BookingDraft {
    if (!booking) return false
    const total = getTotalTickets(booking)
    return total > 0 && booking.seats.length === total
}