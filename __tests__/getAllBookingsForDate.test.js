const { BookingStatus } = require('../models/database/BookingStatus');
const { Pool } = require('pg');

const pool = new Pool();

jest.mock('pg', () => {
    return {
        Pool: jest.fn().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation((query, params) => {
                    if (query.trim().startsWith('SELECT hour')) {
                        return Promise.resolve({
                            rows: [
                                {
                                    hour: '10',
                                    duration: '2',
                                    bookingtype: 'Type X',
                                    date: '2023-12-25',
                                    username: 'user1',
                                    booking_id: '1',
                                    user_id: '2',
                                    slot: '3',
                                    guild_id: '4',
                                },
                            ],
                        });
                    }

                    throw new Error('Unrecognized query');
                }),
            };
        }),
    };
});

describe('BookingStatus', () => {
    describe('getAllBookingsForDate', () => {
        it('should return a list of bookings for a given date', async () => {
            const bookings = await BookingStatus.getAllBookingsForDate('2023-12-25', '4');
            expect(bookings).toEqual([
                {
                    Hour: '10',
                    Duration: '2',
                    BookingType: 'Type X',
                    Date: '2023-12-25',
                    Username: 'user1',
                    BookingId: '1',
                    UserId: '2',
                    Slot: '3',
                    GuildId: '4',
                },
            ]);
            expect(pool.query).toHaveBeenCalledTimes(1);
            expect(pool.query).toHaveBeenCalledWith(
                `
                    SELECT hour,
                           duration,
                           bookingtype,
                           date,
                           username,
                           booking_id,
                           user_id,
                           slot,
                           guild_id
                    FROM bookings
                    WHERE date = $1
                      AND guild_id = $2;
                `, ['2023-12-25', '4'],
            );
        });

        it('should throw an error if there was a problem with the query', async () => {
            pool.query.mockImplementationOnce(() => Promise.reject('Error'));
            await expect(BookingStatus.getAllBookingsForDate('2023-12-25', '4')).rejects.toThrow('Error');
        });
    });
});