

export const updateDateTimeSection = () => {
    const now = new Date();
    // Format: September 10, 2024, 12:00:00 AM GMT+2
    const formattedDateTime = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    }).format(now);

    return `Last Updated: ${formattedDateTime}\n`;
};
