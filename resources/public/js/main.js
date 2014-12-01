"use strict";

;(function(app) {

  app.factory("TodoService", [
    function() {
      var index = 0,
      todos = [
        { id: ++index, text: "Learn Angular" },
        { id: ++index, text: "Speak About it" },
        { id: ++index, text: "Profit!!" }
      ];

      function markDone(checked, todo) {
        if(checked) {
          todo.done = new Date().getTime();
        } else {
          delete todo.done;
        }
      }

      function addNewTodo(newTodoText) {
        todos.push({ id: ++index, text: newTodoText });
      }

      return {
        getTodos: function() { return todos; },
        markDone: markDone,
        addNewTodo: addNewTodo
      }
    }]);


  app.controller("TodosCtrl", [
    "$scope", "TodoService",
    function(scope, todoSvc) {
      var vm = this;

      vm.todos = todoSvc.getTodos();

      vm.markDone = function(checked, todo) {
        todoSvc.markDone(checked, todo);
      };

      vm.addNewTodo = function(newTodo) {
        todoSvc.addNewTodo(newTodo.text);
        newTodo.text = '';
      };

      vm.resetForm = function(form) {
        form.$setPristine();
      };
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
})(angular.module("TodosApp", ["ngMessages"]));
