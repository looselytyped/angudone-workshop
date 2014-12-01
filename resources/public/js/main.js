"use strict";

;(function(app) {

  app.config([
    "$routeProvider",
    function(routeProvider) {
      routeProvider
        .when("/todos", {
          templateUrl: "views/todos.html",
          controller: "TodosCtrl",
          controllerAs: "todosCtrl"
        })
        .when("/todos/:id", {
          templateUrl: "views/editTodos.html",
          controller: "EditTodosCtrl",
        })
        .otherwise({
          redirectTo: "/todos"
        })
    }]);

  app.factory("TodoService", [
    "$http", "$q",
    function($http, $q) {
      function getTodos() {
        return $http.get("/todos").then(handleSuccess, handleError);
      }

      function markDone(checked, todo) {
        if(checked) {
          todo.done = new Date().getTime();
        } else {
          delete todo.done;
        }
        return $http.put("/todos/"+todo.id, todo)
                    .then(handleSuccess, handleError);
      }

      function addNewTodo(newTodoText) {
        return $http.post("/todos", { text: newTodoText })
                    .then(handleSuccess, handleError);
      }

      function deleteTodo(id) {
        return $http.delete("/todos/"+id)
                    .then(handleSuccess, handleError);
      }

      function handleSuccess(response) {
        return response.data;
      }

      function handleError(response) {
        if (!angular.isObject(response.data) && !response.data) {
          return($q.reject("An unknown error occurred."));
        }
        return($q.reject(response.data));
      }

      return {
        getTodos: getTodos,
        markDone: markDone,
        addNewTodo: addNewTodo,
        deleteTodo: deleteTodo
      }
    }]);


  app.controller("TodosCtrl", [
    "$scope", "TodoService",
    function(scope, todoSvc) {
      var vm = this;
      function refresh() {
        todoSvc.getTodos().then(function(data) {
          vm.todos = data;
        }, displayError);
      }

      refresh();

      vm.markDone = function(checked, todo) {
        todoSvc.markDone(checked, todo).then(refresh, displayError);
      };

      vm.addNewTodo = function(newTodo) {
        todoSvc.addNewTodo(newTodo.text).then(refresh, displayError);
        newTodo.text = '';
      };

      vm.deleteTodo = function(todo) {
        todoSvc.deleteTodo(todo.id).then(refresh, displayError);
      }

      vm.resetForm = function(form) {
        form.$setPristine();
      };

      function displayError(msg) {
        vm.errorMsg = msg;
      }
    }]);

  app.controller("EditTodosCtrl", [
    "$scope", "TodoService",
    function(scope, todoSvc) {
    }]);

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
})(angular.module("TodosApp", ["ngMessages", "ngRoute"]));
