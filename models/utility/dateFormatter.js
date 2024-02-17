async function formatDateToDDMMYY(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString().substr(-2);

    return `${day}-${month}-${year}`; // DD-MM-YY (as in database)
}

module.exports = { formatDateToDDMMYY };