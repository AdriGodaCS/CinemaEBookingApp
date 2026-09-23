export interface Show {
    id: number;
    time: string
    date: Date
    room: number
}

export const mockShowtimes: Show[] = [
    {id:1, time:'2:00PM', date: new Date('2027-01-02'), room:1}, 
    {id:2, time:'5:00PM', date: new Date('2027-01-02'), room:2}, 
    {id:3, time:'8:00PM', date: new Date('2027-01-02'), room:3}
];
