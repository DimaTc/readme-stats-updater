# Readme Stats Updater GitHub Action

The **Readme Stats Updater** GitHub Action distinguishes itself by automatically updating your `README.md` file with a dynamic ASCII table of your most-used programming languages.   
Unlike other similar projects that rely on images or external services, this action generates an ASCII representation that is both dark mode and light mode friendly, ensuring your statistics are beautifully integrated into your profile regardless of the viewer's theme preference. This design choice not only enhances accessibility and compatibility across viewing modes but also ensures your coding activity and language proficiency are represented accurately and aesthetically on your GitHub profile.

## How It Works

Once integrated into a GitHub workflow, this action scans your public repositories, calculates the usage percentage of programming languages, and injects a table of these languages into your `README.md` file, wrapped between designated comment markers. Additionally, it can automatically update a section in your README to indicate when the stats were last updated.

## Setup Instructions

### Step 1: Prepare Your README.md

To display your programming languages stats and the last update date, insert the following hidden markers anywhere in your `README.md` file where you want these sections to appear:

For programming languages table:
```markdown
<!-- LANGS:START -->
<!-- LANGS:END -->
```

For the last update date:
```markdown
<!-- DATE:START -->
<!-- DATE:END -->
```

### Step 2: Add the Action to Your Workflow

Create a new workflow file (e.g., `.github/workflows/update-readme.yml`) in your repository or add the following steps to an existing workflow:

```yaml
name: Update readme with Language Stats

on:
  schedule:
    - cron: '0 0 * * *'  # Runs at midnight every day
  push:
    branches:
      - main  # Adjust to match your default branch

jobs:
  update-readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Update README Language Statistics
        uses: DimaTc/readme-stats-updater@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit changes
        run: |
          git config --global user.name 'GitHub Actions Bot'
          git config --global user.email 'actions@github.com'
          git add README.md
          git commit -m "Update README with language statistics and last update date" || echo "No changes to commit"
          git push
```

### Inputs

`filename`: Optional. The path to the `README.md` file you want to update. Defaults to `README.md` at the repository root.  

### Example Output

After the action runs, your `README.md` will include sections like these:

Programming languages stats:
|||
|---|---|
| JavaScript | [████████████░░░░░░░░] 62.07% |
| Python | [████░░░░░░░░░░░░░░░░] 20.69% |
| CSS | [██░░░░░░░░░░░░░░░░░░] 10.34% |
| HTML | [█░░░░░░░░░░░░░░░░░░░] 6.90% |
|||

Last updated date:
```
Last Updated: March 31, 2024 at 09:34:20 PM GMT+3
```

### Support and Contributions

For support, questions, or contributions, please open an [issue](https://github.com/DimaTc/readme-stats-updater/issues) in the GitHub repository.
