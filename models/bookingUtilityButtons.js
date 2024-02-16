const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function generateDurationButtons(interaction, buttonDate, userId, buttonHour, getHourAvailability) {
    let components = [];
    let currentRow = new ActionRowBuilder();

    for (let hour = 1; hour <= 4; hour++) {
        const isHourAvailable = await getHourAvailability(buttonDate, buttonHour, userId);

        let style = ButtonStyle.Secondary;
        let disabled = false;

        if (isHourAvailable === false) {
            style = ButtonStyle.Danger;
            disabled = true;
        } else if (isHourAvailable === true && existingBookingType.toLowerCase() === 'b2b') {
            style = ButtonStyle.Primary;
        } else {
            style = ButtonStyle.Secondary;
        }
    }

    if (currentRow.components.length > 0) {
        components.push(currentRow);
    }

    return components;
}

module.exports = { generateDurationButtons };