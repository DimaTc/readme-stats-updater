// Import necessary modules
import dotenv from 'dotenv';
import fs from 'fs';
import { fetchTopLanguages } from './languagesStats.js'

const startTableContent = '|||\n|---|---|\n'
const startComment = '<!-- {Start Statistics} -->'
const endComment = '<!-- {Stop Statistics} -->'

// Load environment variables from .env file
dotenv.config();

/**
 * Generates an ASCII progress bar.
 * @param {number} value - Current value.
 * @param {number} maxValue - Maximum possible value.
 * @param {number} length - Length of the progress bar.
 * @param {string} fullChar - Character for the filled portion.
 * @param {string} emptyChar - Character for the empty portion.
 * @returns {string} The ASCII progress bar.
 */
const generateProgressBar = (value, maxValue, length = 20, fullChar = '█', emptyChar = '░') => {
    const percentage = Math.min(100, (value / maxValue) * 100);
    const filledLength = Math.round((percentage * length) / 100);
    const emptyLength = length - filledLength;
    return `[${fullChar.repeat(filledLength)}${emptyChar.repeat(emptyLength)}] ${percentage.toFixed(2)}%`;
};


const populateLanguageTable = languageStats => {
    return languageStats.reduce((table, lang) => {
        const row = `| ${lang.language} | ${lang.progressBar} |`
        return table + row + '\n'
    }, startTableContent) + '|||\n'
}

/**
 * Updates the README.md file with top programming languages used.
 * @param {string} filepath - The filepath to the readme file to update
 */
export const updateReadme = async (filepath) => {
    const readmeContent = fs.readFileSync(filepath, 'utf8')
    const languages = await fetchTopLanguages();
    const maxSize = Object.values(languages).reduce((sum, { size }) => sum + size, 0);
    const languageStats = Object.entries(languages).map(([language, { size }]) => ({
        language,
        progressBar: generateProgressBar(size, maxSize),
    }));
    const startIndex = readmeContent.indexOf(startComment) + startComment.length;
    const endIndex = readmeContent.indexOf(endComment);
    if (startIndex < startComment.length || endIndex < 0 || startIndex >= endIndex) {
        throw new Error('Placeholder comments not found or are in the wrong order.');
    }

    const updatedReadmeContent =
        readmeContent.substring(0, startIndex) +
        populateLanguageTable(languageStats) +
        readmeContent.substring(endIndex)
    fs.writeFileSync(filepath, updatedReadmeContent, 'utf8');
};