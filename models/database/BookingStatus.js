const pool = require('./databaseConnection');

class BookingStatus {
    static async getDayBookingStatus(date, guildId) {
        const dateString = date.toISOString().slice(0, 10);
        const query = `
            SELECT COUNT(*)
            FROM bookings
            WHERE date = $1 AND guild_id = $2;
        `;

        try {
            const res = await pool.query(query, [dateString, guildId]);
            const bookingsCount = parseInt(res.rows[0].count, 10);
            if (bookingsCount === 0) return 'Empty';
            if (bookingsCount >= 14) return 'FullyBooked';
            return 'PartiallyBooked';
        } catch (err) {
            console.error('Error executing day booking status.', err.stack);
            throw err;
        }
    }
    static async getAllBookingsForDate(selectedDate, guildId) {
        const bookings = [];
        const query = `
            SELECT hour, duration, bookingtype, date, username, booking_id, user_id, slot, guild_id
            FROM bookings
            WHERE date = $1 AND guild_id = $2;
        `;

        try {
            const { rows } = await pool.query(query, [selectedDate, guildId]);
            rows.forEach(row => {
                bookings.push({
                    Hour: row.hour,
                    Duration: row.duration,
                    BookingType: row.bookingtype,
                    Date: row.date,
                    Username: row.username,
                    BookingId: row.booking_id,
                    UserId: row.user_id,
                    Slot: row.slot,
                    GuildId: row.guild_id,
                });
            });
            return bookings;
        } catch (err) {
            console.error('Error fetching bookings for date.', err.stack);
            throw err;
        }
    }
}

module.exports = BookingStatus;