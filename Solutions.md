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

5. **Use `ng-model`** @exercise

    - Provides a backing model for input/checkbox/select on the current scope
    - Automatic two way binding between view and model

    To use `ng-model` simply bind it to an input type of `text`, `checkbox` etc like so

        <input type="text" ng-model="textModel"/>
        <h4>This is the text box value {{ textModel }}</h4>
        <input type="checkbox" ng-model="checkboxModel"/>
        <h4>This is the checkbox value {{ checkboxModel }}</h4>
        <select
          ng-model="selectModel"
          ng-options="t for t in ['Fix Me', 'To Do', 'Bug']"
        ></select>
        <h4>You selected {{ selectModel }}</h4>


    Bear in mind that all these `ng-models` are being attached to the `$rootScope`, that is they are globally accessible!

6. **Define and use controllers** @discussion

    Controllers

    - Introduce scopes via `$scope`. These inherit prototypally from `$rootScope`
    - Use Dependency injection to get their dependencies


    a. A controller function in AngularJS is simply a JavaScript function and can be defined as so -

        function TodosCtrl($scope) {
            // set up $scope properties here that are accessible
            // in the view
            $scope.description = "This is our first TodosCtrl";
        }

    You can use this controller in the view with `ng-controller`

        <div class="lead" ng-controller="TodosCtrl">
            <!--
                Anything on $scope is visible here just
                like anything you put on $rootScope is visible
            -->
            <span>{{ description }}</span>
        </div>
        <!--
            You CANNOT see anything on a controllers scope
            if you are outside the scope of the controller.
            Notice we are outside of the closing div tag
            so this will be empty (unless $rootScope has a description)
         -->
         <span>{{ description }}</span>

    Any function (and controllers are simply functions) in AngularJS can leverage dependency injection to get their dependencies. In this case `$scope` tells Angular that this function has a dependency on a `Scope` object, and that Angular should create a `Scope` object and inject it into the function. The name of the parameter tells Angular what _kind_ of object to "create" and inject into the function. 

    Let us say our function needed to make AJAX calls to the server. To do so it would require the `$http` object, and if we were to change the signature of our controller to be `function TodosCtrl($scope, $http) { }` then the function would have 2 objects within its scope - the newly created `$scope` object, and a `$http` object.

    There are **two** things wrong with this declaration. One, the function, like any function declared like so it is in global scope. Furthermore, I mentioned that the names of the parameters to the function tell Angular what it should create and inject. This works great for development purposes, but even a small sized web project these days sees minification and uglification of the the JavaScript code! Think of what a minifier were to do with parameter names :)

    To avoid these two issues, Angular offers another way to declare "namespaced" controllers.  

    b. The first thing we need to is declare a `module` for our Agnular application. Think of a module as a "namespace" - and all functions, variables, constants, controllers etc live within that namespace. We will use the `module` method that Angular gives us to create one

        // declare a module, and grab a reference to it
        // Do not forget to pass in the second empty array to the 
        // module method! 
        var app = angular.module("TodosApp", []);

        // declare the controller
        app.controller("TodosCtrl", ["$scope", 
            function(scope) {
                $scope.description = "This is our first TodosCtrl";
            }
        ]);

    Here, the first argument to the `controller` method is the name of the controller, followed by an array. The **last** item in the array is the definition of the controller. The first to `n-1` items in the array are `String`s that represent the dependencies that the function has. Because these are `String`s these will **not** be minified. Furthermore, now the `TodosCtrl` is tucked away in the `TodosApp` module namespace so it is no longer globally accessible. 

    There is one more step here -- since we are now using the `TodosApp` namespace we need to tell `ng-app` (declared in the view) the name of this namespace, and we do so by changing it to be `<body ng-app="TodosApp">`.

    c. Angular since version 1.5 introduced a "newer" way to use controllers. This is called a "controller as" syntax and is the **preferred** way to use controllers. 

    There are 2 changes here - one is how the controller is defined, and the second is how it is used. 

        // redefining the controller
        var app = angular.module("TodosApp", []);

        // re-define the controller
        app.controller("TodosCtrl", ["$scope", 
            function(scope) {
                var vm = this;
                // notice we are using "this" now
                vm.description = "This is our first TodosCtrl";
            }
        ]);

    And the view looks like so

        // changing the view
        <div class="lead" ng-controller="TodosCtrl as todosCtrl">
            <!--
                Now, the TodosCtrl is available to us in the view
                as "todosCtrl" - we can look up anything tacked on to 
                the controller itself
            -->
            <span>{{ todosCtrl.description }}</span>
        </div>

    Within the controller we no longer tack anything on the `$scope` object, and in this trite example we have no need to inject `$scope` anymore. We attach all properties and functions directly on the controller object via `this`.

    In the view we then use the new `as` syntax to alias the controller, in our case we will call it `todosCtrl`. We can then use `todosCtrl.` (note the dot) to access anything that we tacked on to the controller object. 

    Please note that this **is** the preferred syntax for doing things in Angular now, although most tutorials and books out there will still use the `$scope`. 

    That is not to say that `$scope` has no value anymore -- `$scope` allows for many other functions such as `$broadcast`, `$apply` and `$digest`, and if you need those you can still inject `$scope` like we currently do. 

6. **Define out `todos` array** @exercise

        var app = angular.module("todosApp", []);

        app.controller("TodosCtrl", [
            "$scope",
            function(scope) {
              var vm = this,
                  index = 0,
                  todos = [
                    { id: ++index, text: "Learn Angular" },
                    { id: ++index, text: "Speak About it" },
                    { id: ++index, text: "Profit!!" }
                  ];

              vm.todos = todos;
            }]);

    We initialize an array of todos, and tack it on as a property called `todos` on the controller.

    We evaluate the same in the view using the evaluation (`{{ }}`) directive

        <div ng-controller="TodosCtrl as todosCtrl">
            <h3>{{ todosCtrl.todos }}</h3>
        </div>

6. **Use `ng-repeat` to loop over a collection** @exercise

    Now that we have a collection of todos, we can display them in the view. A semantic representation of a list of items would be an unordered list which is what we will use. 

    We will then leverage one of Angulars most powerful in-built directive -- `ng-repeat`. `ng-repeat` allows us to loop over a collection. We can use it like so 

        <div ng-controller="TodosCtrl as todosCtrl">
            <ul class="list-unstyled">
              <li ng-repeat="t in todosCtrl.todos">
                <h3>{{ t.text }}</h3>
              </li>
            </ul>
        </div>
    
    You can read `<li ng-repeat="t in todosCtrl.todos">` as "for every variable t in the todos collection on the todosCtrl insert a li element, whose HTML content is the 'text' property on current variable t"

    As you can see `ng-repeat` does a lot! 

    One thing to bear in mind is that the order in which the todos get listed is the same order in which your todos are listed on the `todos` array. Under the covers Angular creates a unique identifier for each `li` that ties it back to the `index` of that item in the array. 

    We can ask Angular to track the items in the list using a key that we define. We can supply a `track by` clause to `ng-repeat` that will help Angular know what key to use, like so 

        <div ng-controller="TodosCtrl as todosCtrl">
            <ul class="list-unstyled">
              <li ng-repeat="t in todosCtrl.todos track by t.id">
                <h3>{{ t.text }}</h3>
              </li>
            </ul>
      </div>

    Notice the `track by t.id` that tells Angular to use the `id` property on the current todo.

    Be warned though that this key **has to be UNIQUE!**

