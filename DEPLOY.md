# Deploy To GitHub Pages

Local publish repo:

```bash
cd "/Users/guozhenghui/Desktop/WXY/NHV apartments/github_pages_site"
```

Current local commit:

```text
b9d8a6b Launch apartment fit checker beta
```

## Create The GitHub Repo

Create a public repo under the `XY-Vince` account:

```text
https://github.com/new
```

Recommended repo name:

```text
nhv-apartment-fit-checker
```

Do not initialize it with README, `.gitignore`, or license, because the local repo already has the first commit.

## Push

After the repo exists and local GitHub auth is configured:

```bash
cd "/Users/guozhenghui/Desktop/WXY/NHV apartments/github_pages_site"
git push -u origin main
```

Remote currently configured as:

```text
git@github.com:XY-Vince/nhv-apartment-fit-checker.git
```

If using HTTPS instead of SSH:

```bash
git remote set-url origin https://github.com/XY-Vince/nhv-apartment-fit-checker.git
git push -u origin main
```

## Enable GitHub Pages

In the GitHub repo:

```text
Settings -> Pages -> Build and deployment
Source: Deploy from a branch
Branch: main
Folder: /root
Save
```

Expected public URL:

```text
https://xy-vince.github.io/nhv-apartment-fit-checker/
```

## If SSH Is Not Configured

The current machine returned:

```text
git@github.com: Permission denied (publickey).
```

Use one of these paths:

1. Add an SSH key to GitHub, then retry `git push -u origin main`.
2. Switch remote to HTTPS and authenticate with a GitHub Personal Access Token.
3. Install GitHub CLI and run `gh auth login`, then push.

