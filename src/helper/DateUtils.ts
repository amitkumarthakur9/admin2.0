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
        : "NA";
    return formattedDate;
};

export const dateTimeFormat = (value) => {
    const formattedDate = value
        ? moment(new Date(value)).format("DD-MM-YYYY hh:mm a")
        : "-";
    return formattedDate;


} ;

// format("Do MMM YYYY hh:mm a")

export const getNextSipDate = (newstartDate) => {
    // let startDate: Date = new Date(dates);

    // const formattedDate = moment(newstartDate).format("YYYY-MM-DD");
    // let startDate: Date = new Date(formattedDate);
    // const date = startDate.getDate();
    // let a = new Date();
    // const month = a.getDate() < date ? a.getMonth() : a.getMonth() + 1;
    // const year =
    //     month === 11 && a.getDate() > date
    //         ? a.getFullYear() + 1
    //         : a.getFullYear();
    // const nextSipDate = new Date(year, month, date);
    // const momentDate = moment(nextSipDate);
    // const newformattedDate = momentDate.format("DD-MM-YYYY");


    const startDate = new Date(newstartDate);
    const nextSipDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
    const momentDate = moment(nextSipDate);
    const newFormattedDate = momentDate.format("DD-MM-YYYY");
    
    return newFormattedDate;
};

export const mappedMonths = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 }
];

export const NewyearRange = Array.from({ length: 2051 - 1970 }, (_, index) => ({
    label: "" + (1970 + index),
    value: 1970 + index,
}));


