(function() {
  'use strict';

  angular
    .module('goGuardFe')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr, $resource) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1436420717629;
    vm.showToastr = showToastr;
    vm.testVar = 'Hello World';

    activate();

    var TeamsResource = $resource('https://futbol-api.goguardian.com/teams');
    var MatchesResource = $resource('https://futbol-api.goguardian.com/matches');

    var totalScores = {};
    var allTeams = TeamsResource.query(function(){
      for (var i = 0; i < allTeams.length; i++) {
        var tempProp = allTeams[i]["id"].toString();
        totalScores[tempProp] = 0;
      }
      getAllScores(totalScores);
    });

    function getAllScores(totalScores) {
      var allMatches = MatchesResource.query(function(){
        for (var i = 0; i < allMatches.length; i++) {
          if (allMatches[i]["winnerTeamId"] === null) {
            totalScores;
          } else {
            var teamA = allMatches[i]["teamIds"][0].toString();
            var teamB = allMatches[i]["teamIds"][1].toString();
            if (allMatches[i]["winnerTeamId"].toString() === teamA) {
              totalScores[teamA] += 1;
              totalScores[teamB] -= 1;
            } else {
              totalScores[teamA] -= 1;
              totalScores[teamB] += 1;
            }
          }
        }
        sortTeamRankings(totalScores); 
      });
    }
    
    vm.teams = [];
    var teamsRanked = [];
    function sortTeamRankings(totalScoreObj) {
      var teamIdsSorted = Object.keys(totalScoreObj).sort(function(a,b){return totalScoreObj[a]-totalScoreObj[b]});
      console.log(teamIdsSorted);
      var teams = TeamsResource.query(function(){
        for (var i = 0; i < teamIdsSorted.length; i++) {
          var currId = parseInt(teamIdsSorted[i]);
          for (var j = 0; j < teams.length; j++) {
            if (currId === teams[j]["id"]) {
              teamsRanked.push(teams[j]["name"]);
            } else {
              teamsRanked
            }
          }
        }  
      });
      vm.teams = teamsRanked;
      return vm.teams;     
    }

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();
