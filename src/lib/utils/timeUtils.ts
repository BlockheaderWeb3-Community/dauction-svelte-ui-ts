// Date -> UNIX
const datetoUnix = (date: Date) => {
	return Math.ceil(date.getTime() / 1000);
};

// UNIX -> Date
const unixToDate = (unixDate: number) => {
	const dateTime = new Date(unixDate * 1000);
	return dateTime.toISOString();
};

export { datetoUnix, unixToDate };
