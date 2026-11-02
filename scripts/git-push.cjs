const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = path.resolve(__dirname, '..');

async function push() {
  const token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  
  if (!token) {
    console.error('❌ Error: No GitHub Personal Access Token (PAT) provided.');
    console.log('\nTo push to https://github.com/AadithAS2026/civictrack.git:');
    console.log('Run: node scripts/git-push.cjs <YOUR_GITHUB_TOKEN>');
    console.log('or: $env:GITHUB_TOKEN="ghp_..."; node scripts/git-push.cjs\n');
    process.exit(1);
  }

  console.log('🚀 Pushing CivicTrack to https://github.com/AadithAS2026/civictrack.git on branch main...');
  
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => {
      return { username: token };
    }
  });

  console.log('\n🎉 Successfully pushed to GitHub!');
  console.log('Push summary:', JSON.stringify(pushResult, null, 2));
}

push().catch(err => {
  console.error('\n❌ Push failed:');
  console.error(err.message || err);
  if (err.data && err.data.response) {
    console.error('Server response:', err.data.response);
  }
  process.exit(1);
});
