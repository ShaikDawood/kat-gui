function TournamentGameController($scope,$resource,$cookieStore){
    //$scope.currentProblem
    //$scope.game = $resource('test_data/python_game.json').get();
    //$scope.mobile_game = $resource('test_data/mobile_python_game.json').get();
    
    /*
    To play a game via the SingPath API you must do the following. 
    1. Create a game using create_practice_game and get the gameID in the response. 
    2. Call check_solution_for_game() for a problem until the player correctly solves the problem. 
    3. Call fetch(gameID) to get the updated status of the game after correct solves. 
    4. Redirect the player to the proper page once the game is completed.
    */
    $scope.skip_problem_count = 0;
    $scope.current_problem_index = 0;
    $scope.permutation = "12345"; 
    
    if($cookieStore.get("name")){
      $scope.LevelID = $cookieStore.get("name"); //retrieve level id from practice page
    }
    if($cookieStore.get("num")){
      $scope.numProblems = $cookieStore.get("num"); //retrieve the number of problems per game from practice page
    }
    if($cookieStore.get("type")){
      $scope.gameType = $cookieStore.get("type"); //retrieve game type
    }
    if($cookieStore.get("level")){
      $scope.levelNumber = $cookieStore.get("level"); //retrieve the level number
    }
    if($cookieStore.get("gameDifficulty")){
      $scope.gameDifficulty = $cookieStore.get("gameDifficulty"); //retrieve the game difficulty
    }
    if($cookieStore.get("nameOfPath")){
      $scope.nameOfPath = $cookieStore.get("nameOfPath"); //retrieve name of the path
    }
    if($cookieStore.get("path_IDD")){
      $scope.path_IDD = $cookieStore.get("path_IDD"); //retrieve name of the path
    }		

    $scope.create_practice_game = function(){
    	$scope.problemsModel = $resource('/jsonapi/get_problemset_progress/:problemsetID');

		$scope.problemsModel.get({"problemsetID":$scope.LevelID}, function(response){
			$scope.problems_progress = response;
		});
    }
	
    //alert($scope.qid);
    $scope.create_practice_game = function(LevelID,numProblems){
      $scope.CreateGameModel = $resource('/jsonapi/create_game/problemsetID/:problemsetID/numProblems/:numProblems');
      
      $scope.CreateGameModel.get({"problemsetID":LevelID,"numProblems":numProblems}, function(response){
        $scope.game = response;
        $scope.update_remaining_problems();
		});
    };


    $scope.create_resolve_problemset_game = function(problemsetID){
      $scope.CreateGameModel = $resource('/jsonapi/create_game/problemsetID/:problemsetID/resolve');
      
      $scope.CreateGameModel.get({"problemsetID":problemsetID}, function(response){
        $scope.game = response;
        $scope.update_remaining_problems();
		});
    };         
    /*
    Create Tournament Game.
    
    */
    
    $scope.fetch = function(gameID){
		$scope.GameModel = $resource('/jsonapi/game/:gameID');
      
		$scope.GameModel.get({"gameID":gameID}, function(response){
        $scope.game = response;
        $scope.update_remaining_problems();
		});
    };

    $scope.update_remaining_problems = function(){
      $scope.remaining_problems = [];
      //loop through problems and find unsolved. Add to remaining_problems.
      for (var i = 0; i < $scope.game.problemIDs.length; i++) {
        if($scope.game.solvedProblemIDs.indexOf($scope.game.problemIDs[i])<0){
          $scope.remaining_problems.push($scope.game.problemIDs[i]);
        }
      }

      if($scope.remaining_problems.length == 0){
			
			//Add a condition to redirect to the tournament result if this is a tournament game. 
			if($scope.problems_progress.problemsInProblemset<=$scope.problems_progress.currentPlayerProgress){
				alert("congrats!");
				window.location.href="index.html#/practice";
			}
			else{
				$scope.create_practice_game($scope.LevelID,$scope.numProblems);
			}
      }
      //Update the current problem index based on remaining problems and items skipped. 
      $scope.move_to_next_unsolved_problem();
    };

    $scope.move_to_next_unsolved_problem = function(){
      $scope.sampleAnswers = "yes";
      if ($scope.remaining_problems.length>0){
        $('#t11').addClass('active');
        $('#t21').removeClass('active');
        $('#ta11').addClass('active');
        $('#ta21').removeClass('active');
        //Todo:If you are already on the problem, you don't need to reload it. 
        $scope.current_problem = $scope.remaining_problems[$scope.skip_problem_count % $scope.remaining_problems.length];
        $scope.current_problem_index = $scope.game.problemIDs.indexOf($scope.current_problem);
        $scope.solution1 = $scope.game.problems.problems[$scope.current_problem_index].skeleton;
        $scope.solution_check_result = null;
        var editor = ace.edit("editorPractice");
        editor.getSession().setMode("ace/mode/" + $scope.game.problems.problems[$scope.current_problem_index].interface.codeHighlightKey);
      }else{
        $scope.current_problem=null;
        $scope.current_problem_index = null;
        $scope.solution1 = null;
        $scope.solution_check_result = null;
      }

    }
    $scope.skip_problem = function(){
      $('#t11').addClass('active');
      $('#t21').removeClass('active');
      $('#ta11').addClass('active');
      $('#ta21').removeClass('active');
      if ($scope.remaining_problems.length>1){
        $scope.skip_problem_count += 1;
        $scope.move_to_next_unsolved_problem();
      }
    }


    $scope.check_solution_for_game = function() {
      //$scope.solution
      //$scope.current_problem
      //$scope.game.gameID
      $('#t11').removeClass('active');
      $('#t21').addClass('active');
      $('#ta11').removeClass('active');
      $('#ta21').addClass('active');
      $scope.SaveResource = $resource('/jsonapi/verify_for_game');
      //alert($scope.game.gameID);
      $scope.theData = {user_code:$scope.solution1,
                        problem_id:$scope.current_problem,
                        game_id:$scope.game.gameID};
      
      var item = new $scope.SaveResource($scope.theData);
      item.$save(function(response) { 
              $scope.solution_check_result = response;
              if($scope.solution_check_result.last_solved){
				$scope.problemsModel = $resource('/jsonapi/get_problemset_progress/:problemsetID');

				$scope.problemsModel.get({"problemsetID":$scope.LevelID}, function(response){
					$scope.problems_progress = response;
				});
                //If you hardcode to the game, this will automatically advance the game to the next problem. 
                $scope.fetch($scope.game.gameID);
                $scope.update_quest();
              }
      });
    };

    $scope.verify_solution = function() {
      //$scope.solution
      //$scope.tests
      $scope.solution_check_result = $resource('/jsonapi/check_code_with_interface').get();
    };
    //Mobile Problem Methods
    //If the user selects a correct permutation. 
    //You can mark the permutation correct and post to the server. 
    //This will result in the game proceeding. 

    $scope.check_permutation = function() {
      //$scope.permutation
      //$scope.tests
      //alert("permutation="+$scope.permutation);
      //Update the solution with the permutations of lines.
      $scope.permutation_lines = "";
      //Loop through the permutation and add all of the lines of code
      for (var i = 0; i < $scope.permutation.length; i++) {
        //alert(parseInt($scope.permutation[i]));
        $scope.permutation_lines += $scope.game.problems.problems[$scope.current_problem_index].lines[parseInt($scope.permutation[i])-1]+"\n";
      }
      //Then put the resulting combination of lines in the solution model. 
      $scope.solution = $scope.permutation_lines;
      $scope.solution_check_result =  {"error":"This solution will not compile."};
      $scope.ner =  {"error":"This solution will not compile."};
      
      var nonErrorResult = $scope.game.problems.problems[$scope.current_problem_index].nonErrorResults[$scope.permutation];
      if(nonErrorResult){
    
        $scope.solution_check_result = nonErrorResult;
        $scope.ner = nonErrorResult;
        //If the solution passes, then call verify for the solution to progress in the game. 
        if(nonErrorResult.solved){
          $scope.check_solution_for_game();
          //alert("All solved. Checking solution for game."+nonErrorResult.solved);
        }
      }
    };
    
    $scope.update_quest = function() {

      $resource('/jsonapi/quest/:questID').get({"questID":$scope.game.questID},
      function(response){
        $scope.quest = response;
        //alert("Retrieved quest. Could check for video unlocks here.");
      });
    };
	
	//Check for a roundID to see if this is a tournament game. 
	if($cookieStore.get("roundID")){
      $scope.roundID = $cookieStore.get("roundID"); 
      $scope.tournamentGameID = $cookieStore.get("tournamentGameID"); 
      $scope.fetch($scope.tournamentGameID);
      //$scope.update_remaining_problems();
      console.log("Found a roundID in the cache "+$scope.roundID);//retrieve name of the path
      console.log("Found a gameID in the cache "+$scope.tournamentGameID);//retrieve name of the path
      
    }

	//to retrieve path info to display on path play page
	$scope.$watch('game.problems.problems[current_problem_index].name', function() {
        var path_id = $scope.path_IDD;
		$scope.retrieved_path = $resource('/jsonapi/get_path_progress/:path_id?details=1');
        //Including details=1 returns the nested problemset progress.
        $scope.retrieved_path.get({"path_id":path_id}, function(response){
        	$scope.single_path_info = response;

        	$scope.p_S_order = $scope.single_path_info.currentProblemsetID;


        	for( var i=0; i<$scope.single_path_info.details.length;i++){
        		if($scope.single_path_info.details[i].id == $scope.p_S_order){
        			$scope.current_level_progress = $scope.single_path_info.details[i].currentPlayerProgress;
        			$scope.total_level_progress = $scope.single_path_info.details[i].problemsInProblemset;
        		}

        	}
        });
 	},true);
}

