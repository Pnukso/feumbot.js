const BookingStatus = require('../models/database/BookingStatus');
const { describe, beforeEach, afterEach } = require('node:test');

// Mock the database connection and query method
jest.mock('../models/database/databaseConnection.js', () => ({
    query: jest.fn(),
}));

describe('BookingStatus.checkForConflictingReservations', () => {
    // Setup mock return values for database queries
    beforeEach(() => {
        require('../models/database/databaseConnection.js').query.mockImplementation((sql, params) => {
            if (sql.includes('SELECT hour, duration, bookingtype, date, username, booking_id, user_id, slot, guild_id FROM bookings')) {
                // Simulate database response
                return Promise.resolve({
                    rows: [
                        {
                            hour: '10',
                            duration: 120,
                            bookingtype: 'type1',
                            date: '2023-01-01',
                            username: 'user1',
                            booking_id:1,
                            user_id: 'userId1',
                            slot: 'slot1',
                            guild_id: 'guildId1' },
                    ],
                });
            }
            throw new Error('Unexpected query');
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should detect a conflicting reservation', async () => {
        const selectedDate = '2023-01-01'; // Same date as in mock data
        const selectedHour = '9'; // This will conflict with the mock booking from 10 to 12
        const duration = 120; // 2 hours
        const guildId = 'guildId1'; // Same guild ID as in mock data

        const result = await BookingStatus.checkForConflictingReservations(selectedDate, selectedHour, duration, guildId);
        expect(result).toBe(false); // Expecting a conflict
    });

    test('should detect no conflicting reservation', async () => {
        const selectedDate = '2023-01-01'; // Same date as in mock data
        const selectedHour = '13'; // After the mock booking, so no conflict
        const duration = 60; // 1 hour
        const guildId = 'guildId1'; // Same guild ID as in mock data

        const result = await BookingStatus.checkForConflictingReservations(selectedDate, selectedHour, duration, guildId);
        expect(result).toBe(true); // Expecting no conflict
    });

    // Add more tests as needed to cover different scenarios and edge cases
});
