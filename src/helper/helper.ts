export const getInitials = (name: string) => {
    if(!name) return "-"
    const words = name.split(" ");
    if (words.length >= 2) {
        const firstWord = words[0];
        const secondWord = words[1];
        return `${firstWord[0]}${secondWord[0]}`;
    } else if (words?.length === 1) {
        return words[0][0];
    } else {
        return "";
    }
};

export const RupeeSymbol = "₹";

export const maskLetters = (str: string) => {
    if (str.length <= 4) {
        return str;
    }

    const maskedStr = str.slice(0, -4).replace(/[a-zA-Z0-9]/g, 'x') + str.slice(-4);

    return maskedStr;
}