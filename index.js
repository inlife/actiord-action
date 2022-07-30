const fetch  = require('isomorphic-unfetch')
const core   = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try {
        const ctx = github.context
        const { sha, workflow, actor, runId } = ctx

        if (ctx.eventName !== 'push') {
            console.warn('push handler can be executed only on "push" action triggers')
            core.setOutput('data', 'push handler can be executed only on "push" action triggers')
            return
        }

        const repo = ctx.repository.name
        const owner = ctx.repository.organization

        const commits = ctx.payload.commits.slice(ctx.payload.commits.length - 1) || []
        const commit_sha = process.env.GITHUB_SHA

        if (commits.length > 0) {
            const commitid = commit_sha.substring(0, 7)
            const commiturl = commits[0].url
            const commitmsg = commits[0].title

            const url = core.getInput('url')
            const icon = core.getInput('icon')
            const state = core.getInput('state')
            const discord_token = core.getInput('discord_token')
            const discord_channel = core.getInput('discord_channel')

            const data = {owner, repo, icon, sha, workflow, actor, state, commitid, commiturl, commitmsg, runId, discord_token, discord_channel}

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
