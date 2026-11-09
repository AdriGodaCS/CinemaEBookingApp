// "2026-10-15" -> "Thu, Oct 15, 2026". Built from the parts so the date never shifts by a day
// (new Date("2026-10-15") is read as midnight UTC, which is the previous evening in US time zones).
export function formatShowDate(value: string): string {
    const [year, month, day] = value.split('-').map(Number)
    if (!year || !month || !day) return value

    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

// "19:30" -> "7:30 PM". Values that already contain AM or PM are returned unchanged.
export function formatShowTime(value: string): string {
    if (/[ap]m/i.test(value)) return value

    const match = /^(\d{1,2}):(\d{2})/.exec(value)
    if (!match) return value

    const hours = Number(match[1])
    const suffix = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 === 0 ? 12 : hours % 12

    return `${hour12}:${match[2]} ${suffix}`
}