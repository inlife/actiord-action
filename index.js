const fetch  = require('isomorphic-unfetch')
const core   = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try {
        const ctx = github.context
        const { owner, repo } = ctx.repo
        const { sha, workflow, actor, runId } = ctx
        // const repoURL = `https://github.com/${owner}/${repo}`
        // const workflowURL = `${repoURL}/commit/${sha}/checks`

        const commits = ctx.payload.commits.slice(ctx.payload.commits.length - 1) || []
        const commit_sha = process.env.GITHUB_SHA

        if (commits.length > 0) {
            const commitid = commit_sha.substring(0, 7)
            const commiturl = commits[0].url
            const commitmsg = commits[0].title

            const url = core.getInput('url')
            const icon = core.getInput('icon')
            const state = core.getInput('state')
            const discord_webhook = core.getInput('discord_webhook')

            const data = {owner, repo, icon, sha, workflow, actor, state, commitid, commiturl, commitmsg, runId, discord_webhook}

            const res = await fetch(url, {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                throw new Error("Fetch: " + await res.text())
            }
        }

        core.setOutput('finished', new Date().toTimeString());
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
