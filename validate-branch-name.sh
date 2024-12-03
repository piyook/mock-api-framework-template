## Validate branch name format
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if ! [[ $BRANCH_NAME =~ ^(main|dev){1}$|^(feat|fix|hotfix|release|chore)/.+$ ]]; then
  echo "Error: INVALID BRANCH NAME: use format 'feature|fix|hotfix|release|core/your-branch-name'"
  exit 1
fi
echo "Validated branch: $BRANCH_NAME - all OK :)"


## you can set other regex patterns here such as :
## ^(feature|fix|hotfix|release)/.+ - branch has to start with feature/, fix/, release/ or hotfix/
## (feature|release|hotfix)/(JIRA-\d+) - it should look like feature/JIRA-1234
## (feature|release|hotfix)/(JIRA-\d+/)?[a-z-]+ - it should look like feature/branch-name or include JIRA's code like feature/JIRA-1234/branch-name