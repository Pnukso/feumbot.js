const pool = require('./databaseConnection');

class BookingStatus {
    static async getDayBookingStatus(date, guildId) {
        const dateString = date.toISOString().slice(0, 10);
        const query = `--sql
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
}

module.exports = BookingStatus;