const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function generateDateButtons(currentDate, userId, guildId, getDayBookingStatus) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    let components = [];
    let currentRow = new ActionRowBuilder();

    for (let day = 1; day <= daysInMonth; day++) {
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

module.exports = { generateDateButtons };