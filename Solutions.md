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

7. **Define out `todos` array** @exercise

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

8. **Use `ng-repeat` to loop over a collection** @exercise

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

7. **Use `ng-change` on checkbox to mark todos as done**

    We will first introduce a checkbox with a `ng-model` (so that we can know it's state) for each todo within the `ng-repeat`.

    We then use `ng-change` to invoke a function on the controller to mark the todo as done (that is set a `done` property on the todo to the curent timestamp).

    We also use `ng-checked` to tell Angular what the _initial_ value of the checkbox needs to be. Bear in mind that the `ng-model` that the checkbox *drives* is different from the "initial value" of the checkbox. Try to think of what the value of the checkbox needs to be if one of the todos was already done (in that its `done` property was already set). 

    So when the user checks the box the sequence as Angular manages it is - set the value of the `ng-model` `checked` to `true` or `false`, _then_ invoke `todosCtrl.markDone`, and _then_ interrogate `t.done` to figure out the value of the `checked` attribute on the checkbox.

        <li ng-repeat="t in todosCtrl.todos track by t.id">
            <h3>
              <input type="checkbox" ng-model="checked"
                                     ng-change="todosCtrl.markDone(checked, t)"ng-checked="t.done">
              {{ t.text }}
              </h3>
        </li>

    Of course the user might check a todo, and then uncheck it. In that case we simply delete the `done` property on the todo.

        vm.markDone = function(checked, todo) {
            if(checked) {
                todo.done = new Date().getTime();
            } else {
                delete todo.done;
            }
        };

8. **Use a form to add new todos to the list with validation** @exercise

    We use a regular HTML `form` to allow the user to add a new todo to the `todos` array. 

    One thing that proves very useful is to name the form so that we can get to it later (like so `form name="addTodo"`). Since we will be doing the validation for our form we can prevent the default behaviour of modern browsers that attempt to block submission of a an invalid form via `novalidate`. We also mandate that the text be filled in via the HTML5 `required` attribute.

    On the `button` we use `ng-click` that will invoke a function on the controller passing in the `ng-model` of the `input`. We _also_ disable the button if the form is "invalid" (via `ng-disabled` along with `addTodo.$invalid`).

        <form name="newTodoForm" novalidate>
          <input type="text"
                 ng-model="todosCtrl.newTodo.text"
                 name="todoText"
                 required
                 placeholder="I want to ..." />
          <button ng-click="todosCtrl.addNewTodo(todosCtrl.newTodo)"
                  ng-disabled="newTodoForm.$invalid">
            Add
          </button>
        </form>

    On the controller end we have to add a new function on the controller that will receive the backing model of the `input` field, extract the `text` property to create a new todo that will get `push`ed on the `todos` array.

          vm.addNewTodo = function(newTodo) {
            todos.push({ id: ++index, text: newTodo.text });
            newTodo.text = '';
          };

    Note that we reset the `text` property on the supplied `newTodo` object to `''` - this will erase the text on the `input` on a succesful submission. 

9. **Use `ng-messages` to display error messages to the user** @exercise

    Angular 1.3 introduced a new module called `ngMessages` that makes it easy to display form errors to the user. 

    In order to use this we have to first include the angular-messages.js file in our HTML, and then make `ngMessages` a dependency to **our* application. 

        <!-- in the HTML -->
        <script src="js/angular-messages.js"></script>

    And in our JavaScript file 

        angular.module("TodosApp", ["ngMessages"])

    Now we can use `ngMessages` functionality within out application. 

    Remember we can reference the form in our HTML by its name. The form object has on itself several properties that we can interrogate. We already used `$invalid`. Others are listed [here](https://docs.angularjs.org/api/ng/type/form.FormController). 

    The form object also maintains an object that you can get to via `formName.$error`. You can _also_ get to any errors attached a specific form element via `formName.controlName.$error`

    This object has as its keys any errors on the form (for e.g. "required" if the form has an input field that is required but is not filled in), and the value is the "failing" control (or `true` if this is the control itself). This is what the `$error` object looks like for `newTodoForm.todoText.$error` 

        {
            "required": true
        }

    As you can see the key is `required` and its value is `true` which tells us that this field is required. 

    Let us see how `ng-messages` is used and then figure out how this works. 

        <div ng-messages="newTodoForm.todoText.$error" ng-show="newTodoForm.$dirty && newTodoForm.$invalid">
          <span ng-message="required">is required</span>
        </div>

    The `ng-messages` tag asks which `$error` object to look at -- in this case we want the `newTodoForm.todoText.$error` . `ng-messages` simply "switch cases" over the `$error` object and finds the matching `ng-message` and picks the `span` tag that matches that error! It is that `span` tag that is then displayed to the user. 

    Note that we also use `newTodoForm.$dirty` and `newTodoForm.$invalid` to ensure that we are not being too aggressive in displaying errors to the user. 

9. **Filters in AngularJS** @discussion

    Filters in Angular are analogous to filters in Unix. Consider `ls -al | grep *.txt | less` - here the filters `grep` and `less` are "piped" - data flows from left to right and each filter either "reduces" or "transforms" the data in some way. That is, although this is commonly referred to as "pipes and filters" the filters are not _always_ filtering (or reducing) -- in this case `less` transforms the data into a paged view in the terminal. 

    Filters in Angular work similarly. Data flows to a filter, and the filter (depending on its definition) may drop certain items that do not match a certain criteria, or it may "transform" it, for e.g. it might change the text to be all uppercase. 

    Let us consider the easier of the two that is "transformation". Let us say we have some text in a property called `todoText` and we are evaluating it in the view using `{{ todoTex }}`. If we wanted to uppercase the text we could use one of Angulars built-in filter, appropriately named `uppercase`. And we use it like so `{{ todoTex | uppercase }}`. That's it! Notice that Angular uses the pipe (`|`) character. If you were displaying dollar amounts and wanted to format it you could another one of Angulars built in filters like so `{{amount | currency:"USD$"}}` -- The `currency` filter takes a `String` currency symbol as an argument. 

    The other kind of filter is the "reducing" kind, and this is usually useful when you have a collection of objects and you wish to filter the collection in some way. The ideal place to use this filter would be `ng-repeat`, where you want to "restrict" the items that get "repeated" over. Consider the following  

        <ul>
            <li ng-repeat="n in ['venkat', 'michelle', 'matt'] | filter:'venkat'">
                {{ n }}
            </li>
        </ul>

    Notice the `| filter:'venkat'` ? Just like the `currency` filter expects a currency symbol as an argument, this filter (confusingly named `filter`) expects an argument. The way you read the `ng-repeat` now is like so - take `['venkat', 'michelle', 'matt']` and `filter` items that match 'venkat' - in this case there is only one match so you will see only one list item. What if we did `filter:'m'`? Well there are 2 names that will match, so you will see 2 list items show up.

    We can make this more generic like so 

        <input type="text" ng-model="nameSearch">
        <ul>
            <li ng-repeat="n in ['venkat', 'michelle', 'matt'] | filter:nameSearch">
              {{ n }}
            </li>
        </ul>

    Now we have an input box whose `ng-model` is the argument we are passing to `filter` -- so now the user can type in any value, and the filter will get restricted by _that_ name. 

10. **Use `filter` so that the user can search their todos** @exercise

    We start by creating an input box with an `ng-model` to hold on to what the user is searching for. We then restrict `ng-repeat` using that value 

        <input type="text" ng-model="todosCtrl.searchText" />

    We then "filter" our repeater to restrict the array by that criteria - 

        <li ng-repeat="t in (todosCtrl.todos | filter:todosCtrl.searchText) as results track by t.id">
            <!-- ... -->
        </li>

    Notice that putting the parentheses makes things a lot clearer - First `filter` `todosCtrl.todos` based on this criteria, and then for every `t` in the `results` create a new `li`.

    Stuffing the "resultant" array in `results` using the `as` syntax proves valuable if you would like to know "how many passed the test?". We can use that to display to the user the number of "matched" items, like so 

        <div ng-show="todosCtrl.searchText">
            <span class="badge">Matches {{ results.length }} of {{ todosCtrl.todos.length }}</span>
        </div>

11. **Define your own filter** @exercise

    Angular offers a way to define custom filters, and the API is very similar to the one we use to define controllers in Angular. 

        app.filter("dated", [
            function() {
                return function(text) {
                    if(text.endsWith("#starred")) {
                        var index = text.indexOf("#");
                        return [text.substring(0, index), " important!!"].join('')
                    }
                    return text;
                }
            }]);

    Here we are defining a filter called "dated". Note that we use the same `[]` as the second argument like we do in our controller definitions. If there are any dependencies that this filter needs then we can inject them into our filter factory function. 

    Our filter is itself a function which takes one argument -- the text to transform and returns the transformed text. 

    We can use it in out view like so 

        <li ng-repeat="t in (todosCtrl.todos | filter:todosCtrl.searchText) as results track by t.id">
            <h3>
                <input type="checkbox" ng-model="checked"
                                     ng-change="todosCtrl.markDone(checked, t)"
                                     ng-checked="t.done">
                {{ t.text | dated }}
              </h3>
        </li>

12. **Factories (and services)** @discussion

    In a well designed (and implemented) Angular application, our domain logic should **never** reside _inside_ a controller. The role of the controller is to set up "scoped" properties that are made available to the view. If you look at the current implementation of our controller you see that it not only holds the "model" (a list of todos) but it also knows how to manipulate todos, and the list of todos. 

    So if domain logic should not live in the controller, then where should it go? The answer is factories (or services). 

    Factories in Angular are **singleton** objects that play the role of domain model facilitator. We should design them so that they encapsulate within them all the logic needed to "CRUD" our domain (if that is a traditional web application), or for that matter do anything with the domain. 

    Like `$scope`, and `$http` these factories can be injected anywhere, including our controllers -- so that when the view needs to interact with the domain it does so via the controller. 
    
    Creating a factory has an API very similar to that of controllers and filters.

        app.factory("SomeService", [
          // list of dependencies here
          function() {
            // return the factory object
            return {
              getTodos: function() { //return list of todos }
              // potentially other methods here
            };
          }
          ]);

    We return an object that has one method in this case -- `getTodos` which somehow knows how to get the todos -- be that a static array of todos, or an AJAX call to the server. 

    We can use the same in the controller like so -- 

          app.controller("TodosCtrl", [
            "$scope", "SomeService",
            function(scope, someSvc) {
              // invoke someSvc.getTodos() when you need 'em
            }])

    Allow me to repeat that factories in Angular *are SINGLETONS*! That is, once Angular invokes the factory function in `app.factory` and gets a reference to the object that was returned, it will *NEVER* invoke that function again. 

    Services are identical to factories except you create them with the `angular.module.service` method and the only thing that separates them from factories is _how_ the "instantiation" function is invoked (for a service it is invoked with a `new` -- in that it is treated as a constructor function instead of a regular function invocation).


13. **Create a custom `TodoService` and extract away "model logic" from `TodosCtrl`** @exercise
    
    
    We first define our `TodoService` and then extract out all the business logic from our controller here (*Note* that I am only showing an excerpt here)

         app.factory("TodoService", [
          function() {
            var index = 0,
                todos = [
                  { id: ++index, text: "Learn Angular" },
                  { id: ++index, text: "Speak About it" },
                  { id: ++index, text: "Profit!!" }
                ];

            function addNewTodo(newTodoText) {
              todos.push({ id: ++index, text: newTodoText });
            }

            return {
              getTodos: function() { return todos; },
              addNewTodo: addNewTodo
            }
          }]);

    Then we inject the `TodoService` into the controller just like any other dependency, and use it! 

          app.controller("TodosCtrl", [
            "$scope", "TodoService",
            function(scope, todoSvc) {
              var vm = this;
              vm.todos = todoSvc.getTodos();

              vm.addNewTodo = function(newTodo) {
                todoSvc.addNewTodo(newTodo.text);
                newTodo.text = '';
            };
            
            }]);
