// dateUtils.js

export const getDaysInMonth = (year, month) => {
    // The month argument is 1-based, but Date object months are 0-based
    const lastDayOfMonth = new Date(year, month, 0);
    return lastDayOfMonth.getDate();
};

export const getMonthName = (month) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNames[month - 1];
};

export const getAllDatesInMonth = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const datesArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    return datesArray;
};
