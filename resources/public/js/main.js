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
    }]);

})(angular.module("TodosApp", []));
