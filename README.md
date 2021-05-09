# 🔥 Assign PR Author as Assignee

Use this GitHub Action to automatically assign the Pull Request author as the Assignee



#### 📋 GitHub Action Inputs

```
There are no inputs for this action
```



#### 📋 Example YAML file configuration

```yaml
name: "Assign PR Author as Assignee"

on:  
  pull_request:
    types: [opened, ready_for_review, reopened]
     
jobs:
  assign-pr-author-as-assignee:
    runs-on: ubuntu-latest
    steps:
    - name: "Assign Author as Assignee"
      uses: itsOliverBott/assign-pr-author-as-assignee@latest
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
```