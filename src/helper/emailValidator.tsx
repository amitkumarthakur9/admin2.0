export function emailValidator(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const reWithQuotes = /^[^\s@]+(\s?\"?[\w\s]*\"?)@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email can't be empty.";
    if (!reWithQuotes.test(email) || email.endsWith('"')) {
        return "Oops! We need a valid email address.";
    }
    return "";
}
