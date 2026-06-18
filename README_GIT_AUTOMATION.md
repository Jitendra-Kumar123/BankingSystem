# Local GitHub Push Automation (2–6 commits at 6:00 PM)

This folder contains a Windows automation that creates **2 to 6 Git commits** and **pushes** them to your GitHub `origin` at **6:00 PM daily**.

## What it does
- If your working tree is **clean**, it creates/updates:
  - `scripts/git-automation-timestamp.txt`
  so that commits can still be produced.
- Creates a random number of commits (2–6) and runs `git push` after each commit.

## Prerequisites
1. Git installed
2. Your repo has a configured remote `origin` (HTTPS/SSH)
3. GitHub authentication is already set up on this Windows machine:
   - Prefer SSH keys, or
   - Ensure credential manager is configured so `git push` works non-interactively.

## Test manually
Open **PowerShell** and run from the repo folder:

```powershell
cd "d:/Placement/Developer/IndustryLevelDeveloper/MernStack Projects/BankingSystem"
.\n# Run the script:
.
.
```

Use this exact command:

```powershell
cd "d:/Placement/Developer/IndustryLevelDeveloper/MernStack Projects/BankingSystem"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\auto-git-push.ps1
```

Confirm commits appeared on GitHub.

## Schedule with Windows Task Scheduler
Run the following command in an **elevated** Command Prompt (Run as Administrator) to create a daily 6:00 PM task:

```bat
schtasks /Create /F /SC DAILY /ST 18:00 /TN "BankingSystem-GitAutoPush" /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File 'D:\\Placement\\Developer\\IndustryLevelDeveloper\\MernStack Projects\\BankingSystem\\scripts\\auto-git-push.ps1'" /RL LIMITED
```

## Notes / troubleshooting
- If the scheduled task fails, it is usually due to GitHub authentication not working in non-interactive sessions.
- To debug, run the script manually first (section **Test manually**).
- The script intentionally creates commits even when there are no changes, by updating the timestamp file.

