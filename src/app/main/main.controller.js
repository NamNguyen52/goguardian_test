(function() {
  'use strict';

  angular
    .module('goGuardFe')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr, $resource, $scope) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1436420717629;
    vm.showToastr = showToastr;

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

    vm.allMatches = [];
    function getAllScores(totalScores) {
      var allMatches = MatchesResource.query(function(){
        vm.allMatches = allMatches;
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
    vm.teamIdsSorted = [];
    var teamsRanked = [];
    function sortTeamRankings(totalScoreObj) {
      var teamIdsSorted = Object.keys(totalScoreObj).sort(function(a,b){return totalScoreObj[a]-totalScoreObj[b]});
      vm.teamIdsSorted = teamIdsSorted.reverse();
      console.log(teamIdsSorted);
      var teams = TeamsResource.query(function(){
        for (var i = 0; i < teamIdsSorted.length; i++) {
          var currId = parseInt(teamIdsSorted[i]);
          for (var j = 0; j < teams.length; j++) {
            if (currId === teams[j]["id"]) {
              teamsRanked.push(teams[j]);
            } else {
              teamsRanked
            }
          }
        }  
      });
      vm.teams = teamsRanked.reverse();
      return vm.teams;     
    }

    var GetTeam = $resource('https://futbol-api.goguardian.com/teams/:teamId', {teamId: '@id'});
    var GetTeamMembers = $resource('https://futbol-api.goguardian.com/players?teamId=:teamId', {teamId: '@id'});

    vm.getTeamInfo = getTeamInfo;

    function getTeamInfo(id) {
      var teamObj = GetTeam.get({teamId: id}, function(data){
        vm.teamObj = data;
      });
      GetTeamMems(id);
    }

    function GetTeamMems(teamId) {
      var teamMemberObjs = GetTeamMembers.query({teamId: teamId}, function(data){
        vm.teamMembersArr = data;
      });
      geTeamRanking(teamId);
    }

    function geTeamRanking(teamId) {
      vm.teamRanking = vm.teamIdsSorted.indexOf(teamId.toString()) + 1;
      vm.totalTeams = vm.teamIdsSorted.length;
      teamWinLose(teamId);
    }

    function teamWinLose(teamId) {
      vm.teamMatches = [];
      for (var i = 0; i < vm.allMatches.length; i++) {
        if (vm.allMatches[i]["teamIds"][0] === teamId || vm.allMatches[i]["teamIds"][1] === teamId) {
          if (vm.allMatches[i]["winnerTeamId"] !== null) {
            vm.teamMatches.push(vm.allMatches[i])
          } else {
            vm.teamMatches;
          }
        } else {
          vm.teamMatches;
        }
      }
      var GetTeamWins = $resource('https://futbol-api.goguardian.com/matches?winnerTeamId=:teamId', {teamId: '@id'});
      var teamWins = GetTeamWins.query({teamId: teamId}, function(data){
        vm.teamWins = data.length;
        vm.teamLoses = vm.teamMatches.length - vm.teamWins;
      });
      allTeamMatchesPlayed(teamId);
    }

    function allTeamMatchesPlayed(teamId) {
      vm.allTeamMatches = [];
      for (var i = 0; i < vm.allMatches.length; i++) {
        if (vm.allMatches[i]["teamIds"][0] === teamId || vm.allMatches[i]["teamIds"][1] === teamId) {
          var tempObj = {};
          var tempName = "";
          if (vm.allMatches[i]["teamIds"][0] === teamId) {
              var teamObj = GetTeam.get({teamId: vm.allMatches[i]["teamIds"][1]})
              console.log(teamObj)
              tempObj["opposingTeam"] = teamObj.name;
              tempObj["opposingTeamScore"] = vm.allMatches[i]["teamGoals"][vm.allMatches[i]["teamIds"][1].toString()];
              tempObj["thisTeamsScore"] = vm.allMatches[i]["teamGoals"][teamId.toString()];
              vm.allTeamMatches.push(tempObj);              
          } else {
              var teamObj = GetTeam.get({teamId: vm.allMatches[i]["teamIds"][0]})
              console.log(teamObj)
              tempObj["opposingTeam"] = teamObj.name;
              tempObj["opposingTeamScore"] = vm.allMatches[i]["teamGoals"][vm.allMatches[i]["teamIds"][0].toString()];
              tempObj["thisTeamsScore"] = vm.allMatches[i]["teamGoals"][teamId.toString()];
              vm.allTeamMatches.push(tempObj);              
          }
        } else {
          vm.allTeamMatches;
        }
      }
      vm.allTeamMatches;
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
