# Angular Workshop

## Instructions
This is the final version of the Angular workshop that was held in Rich Web Experience 2014. All the solutions are in the `solutions` branch.

To get these changes

- Make sure that you have no uncommitted changes in your version. If so you can either
    - Undo all the changes via a `git reset --hard`
    - If you prefer to keep your changes just make a commit via `git add .` followed by `git commit -m "My changed"`
- Do a `git fetch` followed by a `git checkout solutions`

If you know your way around Git then you can `git-checkout` individual commits to see the changes in each. If you are not then go to the [commits](https://github.com/looselytyped/angudone-workshop/tree/solution) page and click on the "Browse Code" link next to each change to see what changed

## Exercises

1. **Angular-ize your application** @exercise

    To bootstrap Angular within your application you need to

    - Include the `angular.js` file in your `script` imports
    - Use the `ng-app` directive within your `body` tag like so `<body ng-app>`.
    - Note that this **does not** have to be on the `body` tag but could be inside a nested tag (for e.g. a nested `div` tag under the `body` tag)
        - Doing so reduces the "surface area" of your Angular-ized application. This means that the rest of your document is being managed by something else (for e.g the header and footer might be served by the server)

2. **What is a directive?** @discussion

    A directive in Angular is essentially something that teaches your browser new tricks. For e.g `ng-app` tells your browser that this application is now an Angular application. Other examples of directives are `ng-init` (which initializes a variable in the current scope) and the "evaluation" directive (which we use as `{{ }}`).

    Angular is a directives based framework and you, as an Angular developer will be not only make heavy use of provided directives, but will eventually be writing your own directives.

