# Exporting and Pushing the Project to a New Repository

The project already contains a helper script to export its current state into a fresh Git repository so you can push it to a new remote.

## 1. Run the exporter

```bash
./scripts/export_to_new_repo.sh /path/to/your/new/repo
```

* If you omit the target path, the repository is copied to `../ai-video-call` relative to this project so it is ready to be pushed under that name.
* The script skips existing `node_modules`, `.git`, `tmp`, and log directories, so the export stays clean.

## 2. Review the exported repository

Change into the new directory and inspect the commit the script created:

```bash
cd /path/to/your/new/repo
git status
git log --oneline
```

If you need to add or remove files before pushing, make your changes and amend the commit.

## 3. Add your remote and push

Replace `<your-new-repo-url>` with the URL of the empty `ai-video-call` repository you created on your Git hosting service (for example, `git@github.com:your-org/ai-video-call.git`):

```bash
git remote add origin <your-new-repo-url>
git branch -M main
git push -u origin main
```

After the push completes, your new repository contains the full project history starting from the export commit.
