# hide-files-from-bitbucket-pr

Hide irrelevant files from Bitbucket pull requests.

* [Install](https://chrome.google.com/webstore/detail/hide-files-from-bitbucket/jkndmdikjlefnimdlpmoembjkppanpaf)

*The current version is more a working prototype than a real tool but it's going to get some love in the days to come.*

## How to

1. Once the extension is installed, access to a pull request's page (should look like `https://bitbucket.org/<user>/<repo>/pull-requests/...`)
2. Click on the extension's icon
3. Active rules for the current project are listed here, you can also add new ones
4. When you're done editing the rules, reload the page

Note: currently, it's going to look for file paths that starts with the given rules. For example, if you add a `dist/` rule, every path that starts with `dist/` will be hidden.
