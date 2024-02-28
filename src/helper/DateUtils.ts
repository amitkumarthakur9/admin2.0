// dateUtils.js
import moment from "moment";

export const getDaysInMonth = (year, month) => {
    // The month argument is 1-based, but Date object months are 0-based
    const lastDayOfMonth = new Date(year, month, 0);
    return lastDayOfMonth.getDate();
};

export const monthNames = () => {
    return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
};

export const getMonthName = (month) => {
    return monthNames()[month - 1];
};

export const getAllDatesInMonth = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const datesArray = Array.from(
        { length: daysInMonth },
        (_, index) => index + 1
    );
    return datesArray;
};

// export const dateFormat = "Do MMM YYYY";

export const dateFormat = (value) => {
    const formattedDate = value
        ? moment(new Date(value)).format("DD-MM-YYYY")
        : "-";
    return formattedDate;
};

export const dateTimeFormat = "Do MMM YYYY hh:mm a";

export const getNextSipDate = (newstartDate) => {
    // let startDate: Date = new Date(dates);

    const formattedDate = moment(newstartDate).format("YYYY-MM-DD");
    let startDate: Date = new Date(formattedDate);
    const date = startDate.getDate();
    let a = new Date();
    const month = a.getDate() < date ? a.getMonth() : a.getMonth() + 1;
    const year =
        month === 11 && a.getDate() > date
            ? a.getFullYear() + 1
            : a.getFullYear();
    const nextSipDate = new Date(year, month, date);
    const momentDate = moment(nextSipDate);
    const newformattedDate = momentDate.format("Do MMM YYYY");

    return newformattedDate;
};
