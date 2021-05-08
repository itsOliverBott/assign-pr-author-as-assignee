import * as core from '@actions/core';
import * as github from '@actions/github';
import { Context } from 'vm';

export interface IContextIssue {
    owner: string;
    repo: string;
    number: number;
}

(async () => {
    try {
        const context: Context = github?.context;
        const token: string = core.getInput('token', { required: true });

        if (!token) {
            return core.setFailed(`Required input "token" not provided`);
        }

        if (!hasValidOwnerInContext(context)) {
            return core.setFailed(`Valid owner is missing from context`);
        }

        if (!hasValidRepoInContext(context)) {
            return core.setFailed(`Valid repo is missing from context`);
        }

        if (!hasValidPullRequestNumberInContext(context)) {
            return core.setFailed(`Valid Pull Request number is missing from context`);
        }

        if (hasAssigneeOrAssignees(context)) {
            return core.setFailed(`Assignee/s already exist/s: [${getAssigneeOrAssignees(context)}]`);
        }

        core.setSecret(token);

        const octokit = github.getOctokit(token);
        const assignment = await octokit.issues.addAssignees({
            owner: context?.repo?.owner,
            repo: context?.repo?.repo,
            issue_number: Number(context?.payload?.pull_request?.number),
            assignees: [context?.actor]
        });

        core.info(`${context?.actor} assigned to Pull Request #${context?.payload?.pull_request?.number} on ${context?.repo?.repo}`);

    } catch (error) {
        core.setFailed(error?.message);

        throw error;
    }
})();

function hasValidOwnerInContext(context: Context): boolean {
    return !!context?.repo?.owner;
}

function hasValidRepoInContext(context: Context): boolean {
    return !!context?.repo?.repo;
}

function hasValidPullRequestNumberInContext(context: Context): boolean {
    return !!Number(context?.payload?.pull_request?.number);
}

function hasAssigneeOrAssignees(context: Context): boolean {
    return getAssigneeOrAssignees(context)?.length > 0;
}

function getAssigneeOrAssignees(context: Context): string[] | null {
    let assignees: string[] = (context?.payload?.pull_request?.assignee) ? [context?.payload?.pull_request?.assignee] : [];

    context?.payload?.pull_request?.assignees?.forEach((assignee: string) => {
        assignees.push(assignee);
    });

    if (assignees?.length > 0) {
        return assignees;
    }

    return null;
}