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

3. **Use `Use ng-init` and `{{ }}`** @exercise

    You can use `ng-init` to initialize the value of a variable like so (and use the `{{ }}` to evaluate a variable in the current scope)

        <span ng-init="num = 30"></span>
        <h4>The num is {{ num }}</h4>
        <span ng-init="arr = 'angular is awesome'.split()"></span>
        <h4>The array is {{ arr }}</h4>

    Note that we can write JavaScript specific code within an `ng-init`. There are some exceptions to this rule, for example you **cannot** do conditionals (like `if`).

    The evaluation directive can be used for String interpolation like we see in the example.

4. **Understand the $rootScope** @discussion

    Angular creates a global scope object called `$rootScope` when you bootstrap your application via `ng-app`. This is the grand-daddy of all scopes within an Angular application. If you were to `ng-init` a variable like `num` that we say in the earlier example it is put on the `$rootScope`. You can see what the `$rootScope` looks like by a simple hack (**NOTE:** Do not do this in your production code)

        <script>
            var myapp = angular.module("myApp", []);
            myapp.run(function($rootScope) {
               window.root = $rootScope;
            });
        </script>

    To run this hack we will need to change our `hg-app` usage briefly to look like `ng-app="myApp"`. Now if you were to go to the `Console` in Firebug or Chrome's Console in the Inspector and evaluate `root` you will see that it has `num` and `arr` on it. The following snippet is from FireBug's Console

        >>> root
        Scope { $id="002", $$watchers=[2], $root=Scope, more...}
        >>> root.num
        30
        >>> root.arr
        ["angular is awesome"]

    Remember that this only works if you initialized variables **outside** of any controller. Since we don't have any controllers yet any variable that gets introduced via `ng-init`, or `ng-model` gets tacked on to this global object.

    In other words, doing `<span ng-init="num = 30"></span>` amounts to doing `$rootScope.num = 30` -- That is `num` is now a property on the global `$rootScope` object, thus also making it universally accessible from anywhere within the Angular application

    Needless to say, global variables are a bad idea :)

    **Be sure to remove this `script` tag, and restore `ng-app="myApp"` to just `ng-app` after this experiment**

