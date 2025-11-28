export const checkEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// create date formatter function
export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
}
export const limitString = (input: string, maxLength: number = 50): string => {
    if(input.length <= maxLength){
        return input;
    }
    return input.substring(0, maxLength) + "...";
}