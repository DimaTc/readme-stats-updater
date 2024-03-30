import core from '@actions/core';
import github from '@actions/github';
import { updateReadme } from './src/githubStats.js';

try {
    const fileName = core.getInput('filename') || 'README.md';
    const token = core.getInput('GITHUB_TOKEN');
    process.env.GITHUB_TOKEN = token;
    await updateReadme(fileName);
    console.log(`Successfully updated ${fileName} with top programming languages.`);
} catch (error) {
    console.error(error.message);
    core.setFailed(error.message);
}