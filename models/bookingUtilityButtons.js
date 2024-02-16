const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


async function generateDurationButtons(interaction, buttonDate, userId, buttonHour, checkForConflictingReservations) {
    let components = [];
    let currentRow = new ActionRowBuilder();
    const increments = [60, 120, 180, 240];
    const guildId = interaction.guildId.toString();

    for (let duration of increments) {
        const durationHours = Math.floor(duration / 60);
        const durationMinutes = duration % 60;
        const durationLabel = `${durationHours}:${durationMinutes.toString().padStart(2, '0')}`;
        const customId = `book_type_${buttonDate}_${userId}_${buttonHour}_${duration}`;

        const isDurationAvailable = await checkForConflictingReservations(buttonDate, buttonHour, duration, guildId);

        let style = ButtonStyle.Secondary;
        let disabled = false;

        if (!isDurationAvailable) {
            style = ButtonStyle.Danger;
            disabled = true;
        }

        const button = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(durationLabel)
            .setStyle(style)
            .setDisabled(disabled);

        currentRow.addComponents(button);

        if (currentRow.components.length === 5) {
            components.push(currentRow);
            currentRow = new ActionRowBuilder();
        }
    }

    if (currentRow.components.length > 0) {
        components.push(currentRow);
    }
    return components;

}

module.exports = { generateDurationButtons };
