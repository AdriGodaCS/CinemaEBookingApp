import type { BookingDraft } from '@/context/BookingContext'
import { TICKET_TYPES } from '@/types/show'

// Online booking fee charged per ticket, in dollars
export const BOOKING_FEE_PER_TICKET = 2

// Sales tax rate. Assumption: it applies to the tickets plus the booking fee.
// If the tax should apply to the tickets only, change getOrderTotals below.
export const TAX_RATE = 0.08

export function getTotalTickets(booking: BookingDraft): number {
    return TICKET_TYPES.reduce((sum, type) => sum + booking.tickets[type], 0)
}

// Ticket prices only: no fee, no tax
export function getSubtotal(booking: BookingDraft): number {
    return TICKET_TYPES.reduce((sum, type) => sum + booking.tickets[type] * booking.prices[type], 0)
}

export interface OrderTotals {
    ticketCount: number
    subtotal: number
    bookingFee: number
    tax: number
    total: number
}

// All the money for an order. Worked out in whole cents so amounts like 0.1 + 0.2 never drift.
export function getOrderTotals(booking: BookingDraft): OrderTotals {
    const ticketCount = getTotalTickets(booking)
    const subtotalCents = Math.round(getSubtotal(booking) * 100)
    const feeCents = Math.round(ticketCount * BOOKING_FEE_PER_TICKET * 100)
    const taxCents = Math.round((subtotalCents + feeCents) * TAX_RATE)

    return {
        ticketCount,
        subtotal: subtotalCents / 100,
        bookingFee: feeCents / 100,
        tax: taxCents / 100,
        total: (subtotalCents + feeCents + taxCents) / 100,
    }
}

// A draft can go to checkout only when it has tickets and exactly one seat per ticket
export function isBookingComplete(booking: BookingDraft | null): booking is BookingDraft {
    if (!booking) return false
    const total = getTotalTickets(booking)
    return total > 0 && booking.seats.length === total
}