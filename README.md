# Git Affirm

> A GitHub Action that refuses to deploy if your team hasn't merged a PR with a positive emoji in the title that week.

Git Affirm promotes a positive team culture by ensuring your team includes positive emojis in PR titles before allowing deployments. It uses intelligent emoji sentiment analysis to determine if an emoji conveys a positive emotion.

![Git Affirm Logo](https://img.shields.io/badge/Git-Affirm-%23FF69B4?logo=github&logoColor=white)
![GitHub Marketplace](https://img.shields.io/badge/GitHub-Marketplace-green.svg?logo=github)

https://github.com/user-attachments/assets/ce187432-7184-42e4-b4e6-362ada0a96ab

## Installation

Add Git Affirm to your GitHub workflow in just a few simple steps:

### Create a workflow file

Create a file `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy with Git Affirm

on:
  # Trigger on events that would start a deployment
  push:
    branches: [main]
  workflow_dispatch:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  check-and-deploy:
    runs-on: ubuntu-latest
    if: github.event_name != 'pull_request' || github.event.pull_request.merged == true
    steps:
      - name: Check for Positive Emoji PRs
        id: git-affirm
        uses: redhatsam09/git-affirm@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          days-to-check: 7
          second-chance: true
      
      # Only proceed with deployment if check passes
      - name: Deploy
        if: steps.git-affirm.outputs.can-deploy == 'true'
        run: |
          # Your deployment steps here
          echo "Deploying to production! 🚀"
      
      - name: Deployment Skipped
        if: steps.git-affirm.outputs.can-deploy != 'true'
        run: |
          echo "Deployment was blocked because no PRs with positive emojis were merged recently."
          exit 1
```

## Configuration Options

Git Affirm provides several configuration options to customize its behavior:

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for API access | Yes | `${{ github.token }}` |
| `days-to-check` | Number of days to look back for PRs | No | `7` |
| `second-chance` | Whether to check current PR as a second chance | No | `true` |

### Outputs

| Output | Description |
|--------|-------------|
| `can-deploy` | Whether deployment should be allowed (`true` or `false`) |
| `message` | Explanation of why deployment was allowed or blocked |

## How It Works

### Without Emoji
<img width="1439" height="746" alt="Fail" src="https://github.com/user-attachments/assets/283d0c1a-866a-433c-8bf0-4fe4a1e088c5" />

### Merged PR with Positive Emoji
<img width="1446" height="642" alt="Success" src="https://github.com/user-attachments/assets/f75bd4ef-f94e-4dc6-9c01-1a21c56c0674" />


Git Affirm follows this process:

1. When a deployment is triggered, it analyzes all PRs merged in the past week
2. It uses sentiment analysis to identify positive emojis in PR titles
3. If at least one PR with a positive emoji was merged, deployment proceeds
4. If no positive emoji PRs were found, but the current PR has a positive emoji, deployment proceeds (second-chance mode)
5. If neither condition is met, deployment is blocked with a helpful message

