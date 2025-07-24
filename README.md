# Git Affirm 😊

> A GitHub Action that refuses to deploy if your team hasn't merged a PR with a positive emoji in the title that week.

Git Affirm promotes a positive team culture by ensuring your team includes positive emojis in PR titles before allowing deployments. It uses intelligent emoji sentiment analysis to determine if an emoji conveys a positive emotion.

![Git Affirm Logo](https://img.shields.io/badge/Git-Affirm-%23FF69B4?logo=github&logoColor=white)
![GitHub Marketplace](https://img.shields.io/badge/GitHub-Marketplace-green.svg?logo=github)
![License](https://img.shields.io/github/license/redhatsam09/git-affirm)

## 🚀 Features

- 🧠 **Smart Sentiment Analysis**: Automatically detects positive emojis in PR titles
- 🎯 **Deployment Protection**: Blocks deployments if no positive emoji PRs have been merged within the set time period
- 🥇 **Second Chance System**: If no positive emoji PRs were merged recently, allows the current PR to enable deployment if it has positive emoji
- ⚙️ **Configurable**: Adjust the look-back period and other settings to suit your team's workflow
- 🛡️ **Safety Mechanism**: Never gets your team stuck in a position where deployments are permanently blocked

## 📋 Installation

Add Git Affirm to your GitHub workflow in just a few simple steps:

### Step 1: Create a workflow file

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

### Step 2: Configure branch protection (optional but recommended)

For maximum effectiveness, set up branch protection rules:

1. Go to your repository settings
2. Navigate to "Branches" > "Branch protection rules"
3. Create or edit the rule for your main branch
4. Enable "Require status checks to pass before merging" 
5. Add "check-and-deploy" as a required check

## ⚙️ Configuration Options

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

## 🎯 How It Works

Git Affirm follows this process:

1. When a deployment is triggered, it analyzes all PRs merged in the past week (or your specified timeframe)
2. It uses advanced emoji sentiment analysis to identify positive emojis in PR titles
3. If at least one PR with a positive emoji was merged, deployment proceeds
4. If no positive emoji PRs were found, but the current PR has a positive emoji, deployment proceeds (second-chance mode)
5. If neither condition is met, deployment is blocked with a helpful message

## 📝 Examples

### Successful Deployment Scenario

If your team has merged a PR like:
- "Add new login feature 🎉" (merged 3 days ago)

Then when you try to deploy, Git Affirm will allow it with a message like:
```
✅ Deployment allowed: Found 1 PR(s) with positive emojis merged in the last 7 days:
#42: Add new login feature 🎉
```

### Second Chance Scenario

If your team hasn't merged any PRs with positive emojis recently, but the current PR being merged has one:
- "Fix critical bug ✨" (current PR)

Git Affirm will allow deployment with:
```
✅ Deployment allowed: Current PR #45 has positive emojis in the title (second chance used).
```

### Blocked Deployment Scenario

If your team hasn't merged any PRs with positive emojis recently:

```
❌ Deployment blocked: No PRs with positive emojis have been merged in the last 7 days.
```

## 🤔 Why Use Git Affirm?

1. **Promotes Team Positivity**: Encourages a culture of positive communication and celebration
2. **Lightweight Culture Enforcement**: Gently nudges your team toward better practices without heavy-handed rules
3. **Conversation Starter**: Creates dialogue around team mood and communication
4. **Quick to Implement**: Takes just minutes to set up and start using
5. **Never Blocks Progress**: With second-chance mode, you're never completely stuck

## 📄 License

MIT

## 🧑‍💻 Author

Created by [@redhatsam09](https://github.com/redhatsam09)

---

Found this useful? ⭐ Star the repository on [GitHub](https://github.com/redhatsam09/git-affirm)!
