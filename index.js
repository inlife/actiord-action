const fetch  = require('isomorphic-unfetch')
const core   = require('@actions/core')
const github = require('@actions/github')

async function run() {
    try {
        const ctx = github.context
        const { owner, repo } = ctx.repo
        const { sha, workflow, actor, payload, runId } = ctx
        // const repoURL = `https://github.com/${owner}/${repo}`
        // const workflowURL = `${repoURL}/commit/${sha}/checks`

        const commitid = payload.head_commit.id.substring(0, 7)
        const commiturl = payload.head_commit.url
        const commitmsg = payload.head_commit.message

        const url = core.getInput('url')
        const state = core.getInput('state')
        const icon = core.getInput('icon')
        const data = {owner, repo, icon, sha, workflow, actor, state, commitid, commiturl, commitmsg, runId}

        const res = await fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            throw new Error("Fetch: " + await res.text())
        }

        core.setOutput('finished', new Date().toTimeString());
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
