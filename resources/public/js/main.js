"use strict";

;(function(app) {
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

      vm.markDone = function(checked, todo) {
        if(checked) {
          todo.done = new Date().getTime();
        } else {
          delete todo.done;
        }
      };

      vm.addNewTodo = function(newTodo) {
        todos.push({ id: ++index, text: newTodo.text });
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
    }
  ]);
})(angular.module("TodosApp", ["ngMessages"]));
