const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'meteorOSS';  // 替换为你的 GitHub 用户名
const REPO_NAME = 'hexo-source';  // 替换为你的仓库名
const ISSUES_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open`;

axios.defaults.headers.common['Authorization'] = `token ${GITHUB_TOKEN}`;

axios.get(ISSUES_API_URL)
  .then(response => {
    response.data.forEach(issue => {
      const content = `---
title: "${issue.title}"
date: ${issue.created_at}
tags: [${issue.labels.map(label => label.name).join(', ')}]
---

${issue.body}
`;
      const fileName = `${issue.number}-${issue.title.replace(/\s+/g, '-')}.md`;
      fs.writeFileSync(path.join(__dirname, 'source/_posts', fileName), content);
    });
  })
  .catch(error => console.error(error));
