export const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
        const firstWord = words[0];
        const secondWord = words[1];
        return `${firstWord[0]}${secondWord[0]}`;
    } else if (words.length === 1) {
        return words[0][0];
    } else {
        return '';
    }
}