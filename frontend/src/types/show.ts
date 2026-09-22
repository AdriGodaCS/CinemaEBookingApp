export interface Show {
    id: number;
    time: string
    date: string
    room: number
}

export const mockShowtimes: Show[] = [
    {id:1, time:'2:00PM', date:'1/02/2027', room:1}, 
    {id:2, time:'5:00PM', date:'1/02/2027', room:2}, 
    {id:3, time:'8:00PM', date:'1/02/2027', room:3}
]