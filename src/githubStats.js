import fs from 'fs';
import { fetchTopLanguages } from './languagesStats.js';

/**
 * Generates an ASCII progress bar.
 * @param {number} value - Current value.
 * @param {number} maxValue - Maximum possible value.
 * @param {number} length - Length of the progress bar.
 * @param {string} fullChar - Character for the filled portion.
 * @param {string} emptyChar - Character for the empty portion.
 * @return {string} The ASCII progress bar.
 */
const generateProgressBar = (value, maxValue, length = 20, fullChar = '█', emptyChar = '░') => {
    const percentage = Math.min(100, (value / maxValue) * 100);
    const filledLength = Math.round((percentage * length) / 100);
    const emptyLength = length - filledLength;
    return `[${fullChar.repeat(filledLength)}${emptyChar.repeat(emptyLength)}] ${percentage.toFixed(2)}%`;
};

const populateLanguageTable = languageStats => {
    const startTableContent = '\n|||\n|---|---|\n';
    return (
        languageStats.reduce((table, { language, progressBar }) => {
            const row = `| ${language} | ${progressBar} |`;
            return table + row + '\n';
        }, startTableContent) + '|||\n'
    );
};

const updateSection = (readmeContent, sectionStartTag, sectionEndTag, newContent) => {
    const startTagRegex = new RegExp(`<!--\\s*${sectionStartTag}\\s*-->`, 'i');
    const endTagRegex = new RegExp(`<!--\\s*${sectionEndTag}\\s*-->`, 'i');

    const startMatch = readmeContent.match(startTagRegex);
    const endMatch = readmeContent.match(endTagRegex);

    if (!startMatch || !endMatch) {
        console.warn(`Start match or end match were not found.\nstart: ${startMatch} | end: ${endMatch}`);
        return readmeContent;
    }

    const startIndex = startMatch.index + startMatch[0].length;
    const endIndex = endMatch.index;

    if (startIndex > endIndex) {
        console.error(`Indices do no make sense - start: ${startIndex}, end: ${endIndex}`);
        return readmeContent;
    }

    return readmeContent.substring(0, startIndex) + newContent + readmeContent.substring(endIndex);
};

const updateDateTimeSection = () => {
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

/**
 * Updates the README.md file with top programming languages used.
 * @param {string} filepath - The filepath to the readme file to update.
 */
export const updateReadme = async filepath => {
    let readmeContent = fs.readFileSync(filepath, 'utf8');

    // Update languages stats
    const languages = await fetchTopLanguages();
    const maxSize = Object.values(languages).reduce((sum, { size }) => sum + size, 0);
    const languageStats = Object.entries(languages).map(([language, { size }]) => ({
        language,
        progressBar: generateProgressBar(size, maxSize),
    }));

    readmeContent = updateSection(readmeContent, 'LANGS:START', 'LANGS:END', populateLanguageTable(languageStats));
    readmeContent = updateSection(readmeContent, 'DATE:START', 'DATE:END', updateDateTimeSection());

    // Future stats updates can follow a similar pattern:
    // readmeContent = updateSection(readmeContent, 'COMMITS:START', 'COMMITS:END', populateCommitsTable(commitsStats));
    if (readmeContent === undefined) return;
    fs.writeFileSync(filepath, readmeContent, 'utf8');
};
