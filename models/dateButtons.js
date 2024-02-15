const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function generateDateButtons(currentDate, userId, guildId, getDayBookingStatus) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    let components = [];
    let currentRow = new ActionRowBuilder();

    for (let day = 1; day <= daysInMonth + 1; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayBookingStatus = await getDayBookingStatus(date, guildId);

        let style = ButtonStyle.Secondary;
        let disabled = false;

        switch (dayBookingStatus) {
            case 'FullyBooked':
                style = ButtonStyle.Danger;
                disabled = true;
                break;
            case 'PartiallyBooked':
                style = ButtonStyle.Primary;
                break;
        }

        if (date >= new Date()) {
            const button = new ButtonBuilder()
                .setCustomId(`book_date_${date.toISOString().slice(0, 10)}_${userId}`)
                .setLabel((day - 1).toString())
                .setStyle(style)
                .setDisabled(disabled);

            if (currentRow.components.length < 5) {
                currentRow.addComponents(button);
            } else {
                components.push(currentRow);
                currentRow = new ActionRowBuilder().addComponents(button);
            }
        }
    }
    if (currentRow.components.length > 0) {
        components.push(currentRow);
    }

    return components.slice(0, 5);
}

async function generateHourButtons(interaction, selectedDate, userId, getAllBookingsForDate) {
    const guildId = interaction.guildId;
    const dayBookings = await getAllBookingsForDate(selectedDate, guildId); // Assume this function is implemented

    // Initialize hour availability
    let hourSlotAvailability = {};
    for (let hour = 8; hour <= 22; hour++) { // Implement variables changable by command
        hourSlotAvailability[hour] = true; // Assume all hours are available initially
    }

    // Process bookings to update hourSlotAvailability
    dayBookings.forEach(booking => {
        const startHour = parseInt(booking.hour.split(':')[0]);
        hourSlotAvailability[startHour] = false; // Mark start hour as unavailable

        const durationInHours = booking.duration / 60; // Assuming duration is in minutes
        for (let i = 1; i < durationInHours; i++) {
            hourSlotAvailability[startHour + i] = false; // Mark affected hours as unavailable
        }
    });

    let components = [];
    let currentRow = new ActionRowBuilder();

    for (let hour = 8; hour <= 22; hour++) {
        const hourLabel = `${hour}:00`;
        const customId = `book_hour_${selectedDate}_${hour}_${userId}`;
        const style = hourSlotAvailability[hour] ? ButtonStyle.Primary : ButtonStyle.Danger;
        const disabled = !hourSlotAvailability[hour];

        const button = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(hourLabel)
            .setStyle(style)
            .setDisabled(disabled);

        if (currentRow.components.length < 5) {
            currentRow.addComponents(button);
        } else {
            components.push(currentRow);
            currentRow = new ActionRowBuilder().addComponents(button);
        }
    }

    if (currentRow.components.length > 0) {
        components.push(currentRow);
    }

    return components;
}


module.exports = { generateDateButtons, generateHourButtons };