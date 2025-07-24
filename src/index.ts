import * as core from '@actions/core';
import * as github from '@actions/github';
import { EmojiAnalyzer } from './emoji-analyzer';

async function run(): Promise<void> {
  try {
    // Get inputs from the workflow
    const token = core.getInput('github-token', { required: true });
    const daysToCheck = parseInt(core.getInput('days-to-check', { required: true }), 10);
    const enableSecondChance = core.getInput('second-chance') === 'true';
    
    // Initialize GitHub client
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    
    // Initialize emoji analyzer
    const emojiAnalyzer = new EmojiAnalyzer();
    
    // Calculate the date from which to check PRs
    const checkFromDate = new Date();
    checkFromDate.setDate(checkFromDate.getDate() - daysToCheck);
    const checkFromDateString = checkFromDate.toISOString();

    core.info(`Checking PRs merged after ${checkFromDateString}`);
    
    // Get merged PRs from the last week
    const { data: mergedPRs } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
      per_page: 100
    });
    
    const recentMergedPRs = mergedPRs.filter(pr => {
      return pr.merged_at && 
             new Date(pr.merged_at) > checkFromDate;
    });
    
    core.info(`Found ${recentMergedPRs.length} PRs merged in the last ${daysToCheck} days`);
    
    // Check if any of those PRs have a positive emoji in the title
    let foundPositiveEmojiPR = false;
    const positiveEmojiPRs: string[] = [];
    
    for (const pr of recentMergedPRs) {
      const analysis = emojiAnalyzer.analyzeText(pr.title);
      
      if (analysis.hasPositiveEmoji) {
        foundPositiveEmojiPR = true;
        positiveEmojiPRs.push(`#${pr.number}: ${pr.title}`);
        core.info(`Found positive emoji in PR #${pr.number}: ${pr.title}`);
        core.info(`Positive emojis found: ${analysis.positiveEmojis.join(', ')}`);
      }
    }
    
    // Second chance: check if the current PR has a positive emoji
    let currentPRHasPositiveEmoji = false;
    
    // For deployment on merge, get the merged PR info
    let currentPR: any = null;
    
    if (github.context.payload.pull_request && enableSecondChance) {
      currentPR = github.context.payload.pull_request;
      const analysis = emojiAnalyzer.analyzeText(currentPR.title);
      
      if (analysis.hasPositiveEmoji) {
        currentPRHasPositiveEmoji = true;
        core.info(`Current PR #${currentPR.number} has positive emojis: ${analysis.positiveEmojis.join(', ')}`);
      }
    }
    
    // Determine if deployment should be allowed
    const canDeploy = foundPositiveEmojiPR || currentPRHasPositiveEmoji;
    let message = '';
    
    if (canDeploy) {
      if (foundPositiveEmojiPR) {
        message = `✅ Deployment allowed: Found ${positiveEmojiPRs.length} PR(s) with positive emojis merged in the last ${daysToCheck} days:\n${positiveEmojiPRs.join('\n')}`;
      } else {
        message = `✅ Deployment allowed: Current PR #${currentPR.number} has positive emojis in the title (second chance used).`;
      }
    } else {
      message = `❌ Deployment blocked: No PRs with positive emojis have been merged in the last ${daysToCheck} days.`;
    }
    
    // Set outputs
    core.setOutput('can-deploy', canDeploy);
    core.setOutput('message', message);
    
    // If we can't deploy, fail the action
    if (!canDeploy) {
      core.setFailed(message);
    } else {
      core.info(message);
    }
    
  } catch (error: any) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
