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
      }
    }]);

})(angular.module("TodosApp", []));
