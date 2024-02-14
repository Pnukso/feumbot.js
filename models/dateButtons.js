const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function generateDateButtons(currentDate, userId, guildId, getDayBookingStatus) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    let components = [];

    for (let day = 1; day <= daysInMonth && components.length < 5; day++) {
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
                .setCustomId(`reserve_date_${date.toISOString().slice(0, 10)}_${userId}`)
                .setLabel(day.toString())
                .setStyle(style)
                .setDisabled(disabled);

            // Calculate index for organizing buttons into action rows, with a maximum of 5 rows
            const index = Math.floor((day - 1) / 5);
            if (!components[index]) components[index] = new ActionRowBuilder();
            if (components[index].components.length < 5) {
                components[index].addComponents(button);
            }
        }
    }

    return components.slice(0, 5);
}

module.exports = { generateDateButtons };