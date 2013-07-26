'use strict';

/* Controllers */
//The index controller is mainly used for logging all clicks. 
//Logging to Google Analytics and SingPath
function IndexController($scope,$resource,$location,$window){
    
    $scope.location = $location;
    /*
    $scope.log_to_google_analytics = function($event){
        //Log event to Google Analytics
        //This will log from 127.0.0.1 but not local host. 
        //$window._gaq.push(['_trackPageview', $event.target.name]);
        //This is how you log to the SingPath backend.
     
    }; 
    */
    $scope.log_event = function($event){  

        var result = $location.absUrl().split("/");
        var page = result[result.length-1];
        if($event.target.name){
          page = page + "_" + $event.target.name;
        }    
        $scope.Log = $resource('/jsonapi/log_event');
        var item = new $scope.Log({"page": page,
                                   "event":$event.target.name});
        $scope.item = item.$save(); 
    }; 


}

function Ctrl($scope) {
  $scope.color = 'blue';
}

function PlayerController($scope,$resource,$location,$cookieStore){
	$scope.mobile_paths = $resource('/jsonapi/mobile_paths').query();
    $scope.player = $resource('/jsonapi/player').get();

    $scope.$watch('player', function() {
    	$scope.current_country = $scope.player.country;
    },true);

	$scope.firstLoad=function(paid){
		if($scope.player.nickname){
			$cookieStore.put("pid", paid);
			$location.path("practice");
		}
		else{
			alert("Please login with FaceBook or Google Account first!");
		}
	};
	
    $scope.login=function(){
  
    }; 
	
	$scope.checkQuestLogin = function(){
		if($scope.player.nickname){
			$location.path("quests");
		}
		else{
			alert("Please login with FaceBook or Google Account first!");
		}
	};
	
	$scope.checkPracticeLogin = function(){
		if($scope.player.nickname){
			$location.path("practice");
		}
		else{
			alert("Please login with FaceBook or Google Account first!");
		}
	};
	
	$scope.checkChallengesLogin = function(){
		if($scope.player.nickname){
			$location.path("challenges");
		}
		else{
			alert("Please login with FaceBook or Google Account first!");
		}
	};
	
	$scope.checkRankingLogin = function(){
		if($scope.player.nickname){
			$location.path("ranking");
		}
		else{
			alert("Please login with FaceBook or Google Account first!");
		}
	};
	
	$scope.checkProfileLogin = function(){
		if($scope.player.nickname){
			$location.path("profile");
		}
		else{
			alert("Please login with FaceBook or Google Account first!");
		}
	};
	
    $scope.update_player_profile = function($event){  
  
        var data = {"nickname":$scope.player.nickname,
                    "professional":$scope.player.professional,
                    "about":$scope.player.about,
                    "gender":$scope.player.gender};

        $scope.UpdateProfile = $resource('/jsonapi/update_player_profile');
        var item = new $scope.UpdateProfile(data);
        $scope.item = item.$save(); 
    };
    
    $scope.log_event = function($event){  

        var result = $location.absUrl().split("/");
        var page = result[result.length-1];
        if($event.target.innerText){
          page = page + "_" + $event.target.innerText;        
        }    
        $scope.Log = $resource('/jsonapi/log_event');
        var item = new $scope.Log({"page": page});
        $scope.item = item.$save(); 
    };        
        
    $scope.dismissModal = function(){
      $('#loginAlert').modal('hide')
    };
    
    $scope.show_panel = function(){
      $('#edit_profile').modal('show')
    };
    
    $scope.logout=function(){    
        $resource('/sign_out').get({}, function(response){
            $scope.logoutresponse = response;
            $scope.player = $resource('/jsonapi/player').get();
            //{"error": "No player logged in"}
            if ($scope.player.error){
              $scope.abc = 'true';
              $scope.def = 'false';
            }
            window.location.href = "index.html";
        });
    };     
}

function InterfaceController($scope,$resource){
        $scope.interfaces = $resource('/jsonapi/interfaces').get();
}

function PathController($scope,$resource,$cookieStore,$location){
  //Try to only fetch what you need in the init of the controller. 
  $scope.paths = $resource('/jsonapi/get_game_paths').get();
  $scope.mobile_paths = $resource('/jsonapi/mobile_paths').query();
  $scope.abc = $cookieStore.get("pid");
  $scope.player_progress = $resource('/jsonapi/get_all_path_progress').query();

  $scope.difficulty = "Drag-n-Drop";
  $scope.lvlName = 1;
  
  
  // this method add background color to the selected images 
  $scope.practiceSelection=function(checker){
    $('#myCarousel input:image').click(function() {
      $('#myCarousel input:image').removeClass('selected');   
      $(this).addClass('selected');
      
    });
    if(checker == 2){
      $('#myCarousel input:image').click();
    }
  }

  $scope.practiceSelectionSmall=function(checker){
    $('#myCarouselSmall input:image').click(function() {
      $('#myCarouselSmall input:image').removeClass('selected');   
      $(this).addClass('selected');
      
    });
    if(checker == 2){
      $('#myCarouselSmall input:image').click();
    }
  }

  $scope.pathSelection=function(checker){
    $('#pathSel input:image').click(function() {
      $('#pathSel input:image').removeClass('selected');   
      $(this).addClass('selected');
      
    });
    if(checker == 2){
      $('#paths input:image').click();
    }
  }

  $scope.pathSelectionSmall=function(checker){
    $('#small-pathSel input:image').click(function() {
      $('#small-pathSel input:image').removeClass('selected');   
      $(this).addClass('selected');
      
    });
    if(checker == 2){
      $('#pathsSmall input:image').click();
    }
  }
	//rank
  $scope.pathSelectRank=function(checker){
	$('#myCarouselRank input:image').click(function() {
      $('#myCarouselRank input:image').removeClass('selected'); 
	  $(this).addClass('selected');

	});
	if(checker == 2){
	  $('#myCarouselRank input:image').click();
	}

  }
  
  $scope.pathSelectRankSmall=function(checker){
    $('#myCarouselRankSmall input:image').click(function() {
      $('#myCarouselRankSmall input:image').removeClass('selected'); 
	  $(this).addClass('selected');

	});
	if(checker == 2){
	  $('#myCarouselRankSmall input:image').click();
	}
  }
  
  
	$scope.setDefaultButton=function(name,problemID){

		$scope.lvlName = name;
			
		$scope.lvlModel = $resource('/jsonapi/problems/:problemID');

		//Including details=1 returns the nested problemset progress.
		$scope.lvlModel.get({"problemID":problemID,"details":1}, function(response){
		$scope.problems = response;
		});	
	};
	
	//assign the level number to the buttons
	$scope.setButton=function(name,problemID){
	
		$scope.lvlName = name;
		
		$('#myTab a:last').tab('show');
			
		$scope.lvlModel = $resource('/jsonapi/problems/:problemID');

		//Including details=1 returns the nested problemset progress.
		$scope.lvlModel.get({"problemID":problemID,"details":1}, function(response){
		$scope.problems = response;
		});	
	};
	
	$scope.setButton1=function(name,problemID){
	
		$scope.lvlName = name;
		
		$('#myTab1 a:last').tab('show');
			
		$scope.lvlModel = $resource('/jsonapi/problems/:problemID');

		//Including details=1 returns the nested problemset progress.
		$scope.lvlModel.get({"problemID":problemID,"details":1}, function(response){
		$scope.problems = response;
		});	
	};
	
	
	//resume game from profile page
    $scope.resumePracticeGame=function(pathid,pathname,num){
		$scope.path_progress = null;
		$cookieStore.put("pid", pathid);
        $scope.PathModel = $resource('/jsonapi/get_path_progress/:pathID');

        //Including details=1 returns the nested problemset progress.
        $scope.PathModel.get({"pathID":pathid,"details":1}, function(response){
            $scope.path_progress = response;
			if(pathname.substring(0,9).trim()=="Beginner"){
				$scope.difficulty = "Drag-n-Drop";
			}
			else{
				$scope.difficulty = "Easy";
			}
			for (var i=0;i<$scope.path_progress.details.length;i++)
			{ 
				if($scope.path_progress.details[i].problemsInProblemset>$scope.path_progress.details[i].currentPlayerProgress){
					console.log("level "+$scope.path_progress.details[i].pathorder);
					$scope.create_prac($scope.path_progress.details[i].id,num,$scope.path_progress.details[i].pathorder);
					break;
				}
			}
        });

	}
	
	
	$scope.changePath = function (difficulty, pathName){
		if(difficulty=="Drag-n-Drop"){
			$scope.changeDifficulty(difficulty,pathName);
		}
		else{
			$scope.changeDifficulty(difficulty,"Beginner "+pathName);
		}
	};
	
	$scope.changePath1 = function (difficulty, pathName){
		if(difficulty=="Drag-n-Drop"){
			$scope.changeDifficulty1(difficulty,pathName);
		}
		else{
			$scope.changeDifficulty1(difficulty,"Beginner "+pathName);
		}
	};
	
	//change the difficulty level as well as the path level detail table
	$scope.changeDifficulty = function(difficulty,pathName){
		if(difficulty=="Drag-n-Drop"){
			for(var i=0; i<$scope.mobile_paths.length;i++){
				var a = " " + pathName;
				var b = " " + $scope.mobile_paths[i].name.trim().substring(9);
				if(a == b){
					$scope.update_path_progress($scope.mobile_paths[i].path_id);
					break;
				}
			}
		}
		else{
			for(var i=0; i<$scope.paths.paths.length;i++){
				var a = " " + pathName.trim().substring(9);;
				var b = " " + $scope.paths.paths[i].name.trim();
				//alert(a+" "+b);
				//alert(a==b);
				if(a == b){
					//alert(a+" "+b);
					$scope.update_path_progress($scope.paths.paths[i].id);
					break;
				}
			}
		}
		//update_path_progress(pat)
	};
	
		//change the difficulty level as well as the path level detail table
	$scope.changeDifficulty1 = function(difficulty,pathName){
		if(difficulty=="Drag-n-Drop"){
			for(var i=0; i<$scope.mobile_paths.length;i++){
				var a = " " + pathName;
				var b = " " + $scope.mobile_paths[i].name.trim().substring(9);
				if(a == b){
					$scope.update_path_progress1($scope.mobile_paths[i].path_id);
					break;
				}
			}
		}
		else{
			for(var i=0; i<$scope.paths.paths.length;i++){
				var a = " " + pathName.trim().substring(9);;
				var b = " " + $scope.paths.paths[i].name.trim();
				//alert(a+" "+b);
				//alert(a==b);
				if(a == b){
					//alert(a+" "+b);
					$scope.update_path_progress1($scope.paths.paths[i].id);
					break;
				}
			}
		}
		//update_path_progress(pat)
	};
	
	$scope.continuePath = function(num){
		for (var i=0;i<$scope.path_progress.details.length;i++)
		{ 
			if($scope.path_progress.details[i].problemsInProblemset>$scope.path_progress.details[i].currentPlayerProgress){
				console.log("level "+$scope.path_progress.details[i].pathorder);
				$scope.create_prac($scope.path_progress.details[i].id,num,$scope.path_progress.details[i].pathorder);
				break;
			}
		}
	};
	
	$scope.create_prac = function(level,numProblems,lvlnum){
		for (var i=0;i<$scope.path_progress.details.length;i++)
		{ 
			if($scope.path_progress.details[i].problemsInProblemset>$scope.path_progress.details[i].currentPlayerProgress){
				$scope.nextLvlNum = $scope.path_progress.details[i].pathorder;
				break;
			}
			else if(i==($scope.path_progress.details.length-1)){
				$scope.nextLvlNum = i+1;
				break;
			}
		}
		
		if(lvlnum<=$scope.nextLvlNum)
		{
			$cookieStore.put("name", level);
			$cookieStore.put("num", numProblems);
			$cookieStore.put("type", "practiceGame");
			$cookieStore.put("level", lvlnum);		
			$cookieStore.put("gameDifficulty", $scope.difficulty);			
			$cookieStore.put("nameOfPath", $scope.path_progress.path.name);
			$cookieStore.put("path_IDD", $scope.path_progress.path.id);					
			if($scope.difficulty == "Drag-n-Drop"){
				window.location.href = "practice_play_page.html";
			}
			else{
				window.location.href = "normal_play_page.html";
			}
		}
		else{
			console.log("Please clear previous level problems to unlock this level!");
		}
	};
	
   	$scope.PathModel = $resource('/jsonapi/get_path_progress/:pathID');

    //Including details=1 returns the nested problemset progress.
    $scope.PathModel.get({"pathID":$scope.abc,"details":1}, function(response){
        $scope.path_progress = response;
    });
			
    $scope.get_player_progress = function(){
        $scope.player_progress = $resource('/jsonapi/get_player_progress').get();
    };
    //$scope.get_player_progress();

    $scope.update_path_details = function(){
        $scope.player_paths = $resource('/jsonapi/get_my_paths').get();
        $scope.current_paths = $resource('/jsonapi/get_current_paths').get();
        $scope.other_paths = $resource('/jsonapi/get_other_paths').get();
        $scope.get_mobile_paths();
    };

    $scope.get_mobile_paths = function(){
        $scope.mobile_paths = $resource('/jsonapi/mobile_paths').query();
    };

    //Assuming this is what you wanted by calling list in ng-init
    $scope.list = function(){
    	$scope.paths = $resource('/jsonapi/get_game_paths').get();
    };
    
	//update path progress for 14 inch window size
    $scope.update_path_progress = function(pathID){
        $scope.PathModel = $resource('/jsonapi/get_path_progress/:pathID');

        //Including details=1 returns the nested problemset progress.
        $scope.PathModel.get({"pathID":pathID,"details":1}, function(response){
            $scope.path_progress = response;
        });
		$('#myTab a:first').tab('show');
        ///jsonapi/get_path_progress/10030, 2462233, 6920762
    }; 
	//update path progress for small window size
    $scope.update_path_progress1 = function(pathID){
        $scope.PathModel = $resource('/jsonapi/get_path_progress/:pathID');

        //Including details=1 returns the nested problemset progress.
        $scope.PathModel.get({"pathID":pathID,"details":1}, function(response){
            $scope.path_progress = response;
        });
		$('#myTab1 a:first').tab('show');
        ///jsonapi/get_path_progress/10030, 2462233, 6920762
    }; 

    //This may not be needed every time the controller loads. 
    //Try using init
    $scope.get_mobile_paths();
	
}

function ProblemsetController($scope,$resource){
    //$scope.pathID = null;
    $scope.problemsets = null;
    
    $scope.ProblemsetModel = $resource('/jsonapi/problemsets/:pathID');
    
    $scope.get_problemsets = function(pathID){
        $scope.problemsets = $scope.ProblemsetModel.get({"pathID":pathID});
    };
}

function ProblemController($scope,$resource){
    $scope.problemsetID = null;
    $scope.problems = null;

    $scope.ProblemsetProgress = $resource('/jsonapi/get_problemset_progress/:problemsetID');
    $scope.ProblemModel = $resource('/jsonapi/problems/:problemsetID');
    

    $scope.get_progress = function(){
        $scope.progress = $scope.ProblemsetProgress.get({"problemsetID":$scope.problemsetID});
    };

    $scope.get_problems = function(){
        //Including ?details=1 will return if the problem has been solved. 
        //$scope.problems = $scope.ProblemModel.get({"problemsetID":$scope.problemsetID});
        $scope.problems = $scope.ProblemModel.get({"problemsetID":$scope.problemsetID, "details":1});
    };

    $scope.get_contributed_problems = function(){
        $scope.ContributedProblemsModel = $resource('/jsonapi/contributed_problems');
          
          $scope.ContributedProblemsModel.query({}, function(response){
            $scope.contributed_problems = response;
            //alert("There are "+$scope.contributed_problems.length+" contributed problems being under review.")
          });
    }


}


function BadgeController($scope,$resource){
    $scope.playerBadges = $resource('/jsonapi/badges_for_current_player').get();
}

//to the list of challenges EDITED by viTech
function ChallengeController($scope,$resource,$location){
    $scope.listChallenges = $resource('/jsonapi/list_challenges').get();

    $scope.goToStory=function()
    {
      $location.path("challengeCreator");

    };
    $scope.goToChallengeSummary=function()
    {
      $location.path("challenges");

    };
    $scope.goToChallengeD=function()
    {
      $location.path("challengedetails");

    };
    $scope.goToRegistration=function()
    {
      $location.path("registration");

    };
	
	//1. All Challenges Tab - load accepted challenges
		
	$scope.list_challenges= function(){
		//alert("all c");
        $scope.ListAllChallenges = $resource('/jsonapi/list_challenges').get();
    };
	
	//2. All Challenges Tab - load accepted challenges
		//if "_playerRegistered": true, add to array
	$scope.registered_challenges= function(){
		
		$scope.challengeModel = $resource('/jsonapi/list_challenges');

		$scope.challengeModel.get({}, function(response){
			$scope.challengeReg = response;
				
			var RegisteredChallenges = $resource('/jsonapi/list_challenges').get();
		
			$scope.playerRegisteredChallenges=[];
			//get to each challenge
			for (var i=0;i<=$scope.challengeReg.challenges.length;i++){ 			
			
				//You have to ensure that this property exists first if it won't always be present.
				if($scope.challengeReg.challenges[i]._playerRegistered==false){
					$scope.playerRegisteredChallenges.push($scope.challengeReg.challenges[i]);						
				}
				//This is a bit annoying. Try logging to console rather than alerting when debugging. 
				//alert($scope.playerRegisteredChallenges.length+"success");
			}
		
		});
				
    };	
	
	//3. My Creation - Load Challenges I've Made
	$scope.list_challenges_I_created= function(){
		//alert("c i created");
        $scope.ListChallengesICreated = $resource('/jsonapi/list_my_challenges').get();
    };
	
	
	//4. My Creation - Challenges others Made	
	//3. Challengedetails.html - Load stats for each challenge
			//3a. All players
			//3b. Registered players
			//3c. Responded players			
	//4. Enable registering for challenge
	//5. Create Habit Challenge
	//6. Create Badge Challenge
	//7. Create Quest Challenge
	//8. Edit Challenges
	
	
	
}

function NormalGameController($scope,$resource,$cookieStore){
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
          $scope.qid = $cookieStore.get("name").id; //retrieve quest id from Storyboard page
        }
        if($cookieStore.get("num")){
          $scope.numProblems = $cookieStore.get("num"); //retrieve quest id from Storyboard page
        }
        if($cookieStore.get("type")){
          $scope.gameType = $cookieStore.get("type"); //retrieve quest id from Storyboard page
        }

        var videos = 0;
    
        //alert($scope.qid);
        $scope.create_practice_game = function(pathID,LevelID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game');
          
          $scope.CreateGameModel.get({}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };

    
        $scope.create_path_game = function(pathID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game/pathID/:pathID/numProblems/:numProblems');
          //alert(pathID+" "+numProblems);
          $scope.CreateGameModel.get({"pathID":pathID,"numProblems":numProblems}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };

        $scope.create_quest_game = function(questID){
          $scope.CreateGameModel = $resource('/jsonapi/create_quest_game/:questID');
          //alert("Creating quest game for quest "+questID);

          $scope.NewQuestGame = $resource('/jsonapi/create_quest_game/:questID');
          $scope.NewQuestGame.get({'questID':questID}, function(response){
              $scope.game = response;
              $scope.fetch($scope.game.gameID);
              //$scope.update_remaining_problems();
              $scope.update_quest();
              //alert("reply for create quest game in game model");
              //Update the parent game model by calling game fetch method. 
          });
          /*
          $scope.CreateGameModel.get({}, function(response){

            $scope.game = response;
            //Fetch the game from game ID. 
            $scope.fetch($scope.game.gameID);
            $scope.update_remaining_problems();
          });
          */
        };

        $scope.create_problemset_game = function(problemsetID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game/problemsetID/:problemsetID/numProblems/:numProblems');
          
          $scope.CreateGameModel.get({"problemsetID":problemsetID,"numProblems":numProblems}, function(response){
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

        //To retrieve story information
        $scope.$watch('quest.name', function() {

        	// to retrieve the story name 
        	var sName = $scope.quest.story;
			$scope.get_Story = $resource('/jsonapi/story/:sName');
			$scope.get_Story.get({"sName":sName}, function(response){
				$scope.singleStory = response;
				$scope.singleStoryDes = $scope.singleStory.description;
			});

			// to retrieve the path name
        	var pName = $scope.quest.path;
			$scope.get_pathName = $resource('/jsonapi/get_path_progress/:pName');
			$scope.get_pathName.get({"pName":pName}, function(response){
				$scope.singlePath = response;
				$scope.singlePathName = $scope.singlePath.path.name;
			});
        	 
        },true);
        
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
            //alert("TBD - Start another quest game automatically here for quest "+ $scope.qid);
            if($scope.quest.numSolved != $scope.quest.numProblems){
              $scope.create_quest_game($scope.qid);
            }else{
              $('#finish_all_info').modal('show');
            }
          }
          //Update the current problem index based on remaining problems and items skipped. 
          $scope.move_to_next_unsolved_problem();
        };

        $scope.move_to_next_unsolved_problem = function(){
          $scope.sampleAnswers = "yes";
          if ($scope.remaining_problems.length>0){
            $('#t1').addClass('active');
            $('#t2').removeClass('active');
            $('#ta1').addClass('active');
            $('#ta2').removeClass('active');
            //Todo:If you are already on the problem, you don't need to reload it. 
            $scope.current_problem = $scope.remaining_problems[$scope.skip_problem_count % $scope.remaining_problems.length];
            $scope.current_problem_index = $scope.game.problemIDs.indexOf($scope.current_problem);
            $scope.solution1 = $scope.game.problems.problems[$scope.current_problem_index].skeleton;
            $scope.solution_check_result = null;
          }else{
            $scope.current_problem=null;
            $scope.current_problem_index = null;
            $scope.solution1 = null;
            $scope.solution_check_result = null;
          }

        }
        $scope.skip_problem = function(){
          $('#t1').addClass('active');
          $('#t2').removeClass('active');
          $('#ta1').addClass('active');
          $('#ta2').removeClass('active');
          if ($scope.remaining_problems.length>1){
            $scope.skip_problem_count += 1;
            $scope.move_to_next_unsolved_problem();
          }
        }

        $scope.play_unlocked_video = function(videoID){
          //alert($scope.quest.videos[videoID]);
          document.getElementById("video_pop").href="http://www.youtube.com/embed/"+ $scope.quest.videos[videoID] +"?enablejsapi=1&wmode=opaque"
          $('#video_pop').trigger('click');
        }

        $scope.check_solution_for_game = function() {
          //$scope.solution
          //$scope.current_problem
          //$scope.game.gameID
          $('#t1').removeClass('active');
          $('#t2').addClass('active');
          $('#ta1').removeClass('active');
          $('#ta2').addClass('active');
          $scope.SaveResource = $resource('/jsonapi/verify_for_game');
          //alert($scope.game.gameID);
          $scope.theData = {user_code:$scope.solution1,
                            problem_id:$scope.current_problem,
                            game_id:$scope.game.gameID};
          
          var item = new $scope.SaveResource($scope.theData);
          item.$save(function(response) { 
                  $scope.solution_check_result = response;
                  if($scope.solution_check_result.last_solved){
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
          var currentNumVideos = 1;

          $resource('/jsonapi/quest/:questID').get({"questID":$scope.game.questID},
          function(response){
            $scope.quest = response;
            //alert("Retrieved quest. Could check for video unlocks here.");
          });

          $scope.$watch('quest.videos', function() {
            var numOfUnlocked = 0;
            for(var i=0;i<$scope.quest.videos.length;i++){
                if($scope.quest.videos[i] != "LOCKED"){
                   numOfUnlocked++;
                }
            }
            if(numOfUnlocked > videos){
                $scope.play_unlocked_video(numOfUnlocked - 1);
            }
            videos = numOfUnlocked;
          },true);
        };

        $scope.goStoryBoard = function(){
          window.location = "index.html#/storyboard";
        };
        
    $scope.create_quest_game($scope.qid);
}

function PracticeGameController($scope,$resource,$cookieStore){
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
 
		$scope.problemsModel = $resource('/jsonapi/get_problemset_progress/:problemsetID');

    	$scope.problemsModel.get({"problemsetID":$scope.LevelID}, function(response){
    		$scope.problems_progress = response;
    	});
		
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
		
		$scope.create_practice_game($scope.LevelID,$scope.numProblems);

		//to retrieve path info to display on path play page
		$scope.$watch('game.problems.problems[current_problem_index].name', function() {
	        var path_id = $scope.path_IDD;
			$scope.retrieved_path = $resource('/jsonapi/get_path_progress/:path_id');
	        //Including details=1 returns the nested problemset progress.
	        $scope.retrieved_path.get({"path_id":path_id}, function(response){
	        	$scope.single_path_info = response;
	        });
	 	},true);

}




function GameController($scope,$resource,$cookieStore,$location){
        //initialization: 
        $scope.autoCheck="yes"; //make autocheck available when page load
        $scope.notCompile = 'false'; //hide not compile warning before the game loaded
        if($cookieStore.get("name")){
          $scope.qid = $cookieStore.get("name").id; //retrieve quest id from Storyboard page
        }
        $scope.source = []; //initialize the solution drag and drop field
        
        /*
        To play a game via the SingPath API you must do the following. 
        1. Create a game using create_practice_game and get the gameID in the response. 
        2. Call check_solution_for_game() for a problem until the player correctly solves the problem. 
        3. Call fetch(gameID) to get the updated status of the game after correct solves. 
        4. Redirect the player to the proper page once the game is completed. 
        */
        //$("#example").popover({
            //placement: 'bottom',
        //});
        //$('#video').trigger('click');
        $scope.solvedProblems = 0;
        $scope.skip_problem_count = 0;
        $scope.current_problem_index = 0;
        $scope.permutation = ""; 
        $scope.permutation_lines = {origional: []};
        $scope.line_outcome = { };
        
        $scope.sourceEmpty = function() {
          //$scope.source = [];
          return $scope.source.length == 0;
        }

        $scope.modelEmpty = function() {
          if($scope.line_outcome.origional){
            return $scope.line_outcome.origional.length == 0;
          }
        }

        $scope.assign_id = function() {
          $scope.permutation_lines = {origional: []};
          var contained = [];
          //Loop through the permutation and add all of the lines of code
          for (var i = 0; i < $scope.game.problems.problems[$scope.current_problem_index].lines.length; i++) {
          	var j = parseInt($scope.game.problems.problems[$scope.current_problem_index].lines.length * Math.random()); 
          	while(contained.indexOf(j) != -1){
          		j = parseInt($scope.game.problems.problems[$scope.current_problem_index].lines.length * Math.random()); 
          	}
            contained.push(j);
          	var temp = $scope.game.problems.problems[$scope.current_problem_index].lines[parseInt(j)];
            temp = temp.split(' ').join('\u00a0');
            $scope.permutation_lines.origional.push({"content": temp,"id": (j+1)});
          }
          $scope.line_outcome = $scope.permutation_lines;
        }

        $scope.create_quest_game = function(questID){
          $scope.CreateGameModel = $resource('/jsonapi/create_quest_game/:questID');
          //alert("Creating quest game for quest "+questID);

          $scope.NewQuestGame = $resource('/jsonapi/create_quest_game/:questID');
          $scope.NewQuestGame.get({'questID':questID}, function(response){
              $scope.game = response;
              $scope.fetch($scope.game.gameID);
              $scope.update_quest();
              //alert("reply for create quest game in game model");
              //Update the parent game model by calling game fetch method. 
          });
          /*
          $scope.CreateGameModel.get({}, function(response){

            $scope.game = response;
            //Fetch the game from game ID. 
            $scope.fetch($scope.game.gameID);
            $scope.update_remaining_problems();
          });
          */
        };

        //To retrieve story information
        $scope.$watch('quest.name', function() {

        	// to retrieve the story name 
        	var sName = $scope.quest.story;
			$scope.get_Story = $resource('/jsonapi/story/:sName');
			$scope.get_Story.get({"sName":sName}, function(response){
				$scope.singleStory = response;
				$scope.singleStoryDes = $scope.singleStory.description;
			});

			// to retrieve the path name
        	var pName = $scope.quest.path;
			$scope.get_pathName = $resource('/jsonapi/get_path_progress/:pName');
			$scope.get_pathName.get({"pName":pName}, function(response){
				$scope.singlePath = response;
				$scope.singlePathName = $scope.singlePath.path.name;
			});
        	 
        },true);

        $scope.create_problemset_game = function(problemsetID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game/problemsetID/:problemsetID/numProblems/:numProblems');
          
          $scope.CreateGameModel.get({"problemsetID":problemsetID,"numProblems":numProblems}, function(response){
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
            $scope.create_quest_game($scope.qid);
          }
          //Update the current problem index based on remaining problems and items skipped. 
          $scope.move_to_next_unsolved_problem();
        };

        $scope.move_to_next_unsolved_problem = function(){
          if ($scope.remaining_problems.length>0){
            //Todo:If you are already on the problem, you don't need to reload it. 
            $scope.current_problem = $scope.remaining_problems[$scope.skip_problem_count % $scope.remaining_problems.length];
            $scope.current_problem_index = $scope.game.problemIDs.indexOf($scope.current_problem);
            $scope.solution = $scope.game.problems.problems[$scope.current_problem_index].skeleton;
            $scope.solution_check_result = null;
            $scope.assign_id();
          }else{
            $scope.current_problem=null;
            $scope.current_problem_index = null;
            $scope.solution = null;
            $scope.solution_check_result = null;
          }
        }

        $scope.skip_problem = function(){
          $scope.notCompile = 'false';
          if($scope.source.length != 0){
            $scope.source = [];
          }
          if ($scope.remaining_problems.length>1){
            $scope.skip_problem_count += 1;
            $scope.move_to_next_unsolved_problem();
          }
        }

        $scope.check_solution_for_game = function() {
          //$scope.solution
          //$scope.current_problem
          //$scope.game.gameID
          $scope.SaveResource = $resource('/jsonapi/verify_for_game');
          //alert($scope.game.gameID);
          $scope.theData = {user_code:$scope.solution,
                            problem_id:$scope.current_problem,
                            game_id:$scope.game.gameID};
          
          var item = new $scope.SaveResource($scope.theData);
          item.$save(function(response) {
              $scope.solution_check_result = response;
              if($scope.solution_check_result.last_solved){
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
            $scope.notCompile = 'false';
            $scope.solution_check_result = nonErrorResult;
            $scope.ner = nonErrorResult;
            //If the solution passes, then call verify for the solution to progress in the game. 
            if(nonErrorResult.solved){
              $('#pop_info_Pane').modal('show');
              $scope.source = [];
              $scope.check_solution_for_game();
            }
            else{
              $('#pop_info_Pane2').modal('show');
            }
          }
          else{
            $scope.notCompile = 'true';
          }
        };

        $scope.check_dnd_permutation = function() {
          //$scope.permutation
          //$scope.tests
          //alert("permutation="+$scope.permutation);
          //Update the solution with the permutations of lines.
          $scope.permutation = "";
          $scope.permutation_lines = "";

          for (var i = 0; i < $scope.source.length; i++) {
            //alert(parseInt($scope.permutation[i]));
            $scope.permutation += $scope.source[parseInt(i)].id.toString();
          }

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
          var autocheck = $scope.autoCheck;

          if(autocheck=="yes"){
            if(nonErrorResult){
              $scope.notCompile = 'false';
              $scope.solution_check_result = nonErrorResult;
              $scope.ner = nonErrorResult;
              
              //If the solution passes, then call verify for the solution to progress in the game. 
              if(nonErrorResult.solved){
                //$scope.check_solution_for_game();
                $('#pop_info_Pane').modal('show');
                $scope.source = [];
                $scope.check_solution_for_game();
                //if($scope.solvedProblems == $scope.game.numProblems){
                  //document.getElementById("endVideo").style.visibility="visible";
                  //$('#endVideo').trigger('click');
                //}
              }
              else{
                $('#pop_info_Pane2').modal('show');
              }
            }
            else{
              $scope.notCompile = 'true';
            }
          }
          
        };

        $scope.goStoryBoard = function(){
          window.location = "index.html#/storyboard";
        };
        
        $scope.update_quest = function() {
          var currentNumVideos = 1;
          $resource('/jsonapi/quest/:questID').get({"questID":$scope.game.questID},
          function(response){
            $scope.quest = response;
            //alert("Retrieved quest. Could check for video unlocks here.");
          });
        };

        $scope.play_unlocked_video = function(videoID){
          //alert($scope.quest.videos[videoID]);
          document.getElementById("video").href="http://www.youtube.com/embed/"+ $scope.quest.videos[videoID] +"?enablejsapi=1&wmode=opaque"
          $('#video').trigger('click');
        }

        $scope.create_quest_game($scope.qid);
        //$scope.fetch(1798);
}


function PracticeDnDController($scope,$resource,$cookieStore,$location){
        //initialization: 
        $scope.autoCheck="yes"; //make autocheck available when page load
        $scope.notCompile = 'false'; //hide not compile warning before the game loaded
		
        if($cookieStore.get("name")){
          $scope.LevelID = $cookieStore.get("name"); //retrieve quest id from Storyboard page
        }

        if($cookieStore.get("num")){
          $scope.numProblems = $cookieStore.get("num"); //retrieve quest id from Storyboard page
        }
        if($cookieStore.get("level")){
          $scope.levelNumber = $cookieStore.get("level"); //retrieve quest id from Storyboard page
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
    	
		$scope.problemsModel = $resource('/jsonapi/get_problemset_progress/:problemsetID');

    	$scope.problemsModel.get({"problemsetID":$scope.LevelID}, function(response){
    		$scope.problems_progress = response;
   		});
		
        //alert($scope.qid);
        $scope.create_practice_game = function(LevelID,numProblems){
          $scope.CreateGameModel = $resource('/jsonapi/create_game/problemsetID/:problemsetID/numProblems/:numProblems');
          
          $scope.CreateGameModel.get({"problemsetID":LevelID,"numProblems":numProblems}, function(response){
            $scope.game = response;
            $scope.update_remaining_problems();
          });
        };
		
        $scope.source = []; //initialize the solution drag and drop field
        
        /*
        To play a game via the SingPath API you must do the following. 
        1. Create a game using create_practice_game and get the gameID in the response. 
        2. Call check_solution_for_game() for a problem until the player correctly solves the problem. 
        3. Call fetch(gameID) to get the updated status of the game after correct solves. 
        4. Redirect the player to the proper page once the game is completed. 
        */
        //$("#example").popover({
            //placement: 'bottom',
        //});
        //$('#video').trigger('click');
        $scope.solvedProblems = 0;
        $scope.skip_problem_count = 0;
        $scope.current_problem_index = 0;
        $scope.permutation = ""; 
        $scope.permutation_lines = {origional: []};
        $scope.line_outcome = { };
        
        $scope.sourceEmpty = function() {
          //$scope.source = [];
          return $scope.source.length == 0;
        }

        $scope.modelEmpty = function() {
          return $scope.line_outcome.origional.length == 0;
        }

        $scope.assign_id = function() {
          $scope.permutation_lines = {origional: []};
          var contained = [];
          //Loop through the permutation and add all of the lines of code
          for (var i = 0; i < $scope.game.problems.problems[$scope.current_problem_index].lines.length; i++) {
          	var j = parseInt($scope.game.problems.problems[$scope.current_problem_index].lines.length * Math.random()); 
          	while(contained.indexOf(j) != -1){
          		j = parseInt($scope.game.problems.problems[$scope.current_problem_index].lines.length * Math.random()); 
          	}
            contained.push(j);
          	var temp = $scope.game.problems.problems[$scope.current_problem_index].lines[parseInt(j)];
            temp = temp.split(' ').join('\u00a0');
            $scope.permutation_lines.origional.push({"content": temp,"id": (j+1)});
          }
          $scope.line_outcome = $scope.permutation_lines;
        }

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
		  
				$scope.problemsModel = $resource('/jsonapi/get_problemset_progress/:problemsetID');

				$scope.problemsModel.get({"problemsetID":$scope.LevelID}, function(response){
				$scope.problems_progress = response;
				});
		  
				if($scope.remaining_problems.length==0){
					alert("Current level Progress: " + ($scope.problems_progress.currentPlayerProgress) + " of " + $scope.problems_progress.problemsInProblemset);
					if($scope.problems_progress.problemsInProblemset-$scope.problems_progress.currentPlayerProgress<=1){
						alert("Congratulation! You have completed this level!");
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
          if ($scope.remaining_problems.length>0){
            //Todo:If you are already on the problem, you don't need to reload it. 
            $scope.current_problem = $scope.remaining_problems[$scope.skip_problem_count % $scope.remaining_problems.length];
            $scope.current_problem_index = $scope.game.problemIDs.indexOf($scope.current_problem);
            $scope.solution = $scope.game.problems.problems[$scope.current_problem_index].skeleton;
            $scope.solution_check_result = null;
            $scope.assign_id();
          }else{
            $scope.current_problem=null;
            $scope.current_problem_index = null;
            $scope.solution = null;
            $scope.solution_check_result = null;
          }
        }

        $scope.skip_problem = function(){
          $scope.notCompile = 'false';
          if($scope.source.length != 0){
            $scope.source = [];
          }
          if ($scope.remaining_problems.length>1){
            $scope.skip_problem_count += 1;
            $scope.move_to_next_unsolved_problem();
          }
        }

        $scope.check_solution_for_game = function() {
          //$scope.solution
          //$scope.current_problem
          //$scope.game.gameID
          $scope.SaveResource = $resource('/jsonapi/verify_for_game');
          //alert($scope.game.gameID);
          $scope.theData = {user_code:$scope.solution,
                            problem_id:$scope.current_problem,
                            game_id:$scope.game.gameID};
          
          var item = new $scope.SaveResource($scope.theData);
          item.$save(function(response) {
              $scope.solution_check_result = response;
              if($scope.solution_check_result.last_solved){
                //If you hardcode to the game, this will automatically advance the game to the next problem. 
                $scope.fetch($scope.game.gameID);

				$scope.problemsModel = $resource('/jsonapi/get_problemset_progress/:problemsetID');

				$scope.problemsModel.get({"problemsetID":$scope.LevelID}, function(response){
				$scope.problems_progress = response;
				});
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
            $scope.notCompile = 'false';
            $scope.solution_check_result = nonErrorResult;
            $scope.ner = nonErrorResult;
            //If the solution passes, then call verify for the solution to progress in the game. 
            if(nonErrorResult.solved){
              $('#pop_info_Pane').modal('show');
			  
			  $scope.problemsModel = $resource('/jsonapi/get_problemset_progress/:problemsetID');

			  $scope.problemsModel.get({"problemsetID":$scope.LevelID}, function(response){
		      $scope.problems_progress = response;
			  }); 
			 
              $scope.source = [];
              $scope.check_solution_for_game();
            }
            else{
              $('#pop_info_Pane2').modal('show');
            }
          }
          else{
            $scope.notCompile = 'true';
          }
        };

        $scope.check_dnd_permutation = function() {
          //$scope.permutation
          //$scope.tests
          //alert("permutation="+$scope.permutation);
          //Update the solution with the permutations of lines.
          $scope.permutation = "";
          $scope.permutation_lines = "";

          for (var i = 0; i < $scope.source.length; i++) {
            //alert(parseInt($scope.permutation[i]));
            $scope.permutation += $scope.source[parseInt(i)].id.toString();
          }

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
          var autocheck = $scope.autoCheck;

          if(autocheck=="yes"){
            if(nonErrorResult){
              $scope.notCompile = 'false';
              $scope.solution_check_result = nonErrorResult;
              $scope.ner = nonErrorResult;
              
              //If the solution passes, then call verify for the solution to progress in the game. 
              if(nonErrorResult.solved){
                //$scope.check_solution_for_game();
                $('#pop_info_Pane').modal('show');
                $scope.source = [];
                $scope.check_solution_for_game();
                //if($scope.solvedProblems == $scope.game.numProblems){
                  //document.getElementById("endVideo").style.visibility="visible";
                  //$('#endVideo').trigger('click');
                //}
              }
              else{
                $('#pop_info_Pane2').modal('show');
              }
            }
            else{
              $scope.notCompile = 'true';
            }
          }
          
        };

        $scope.goStoryBoard = function(){
          window.location = "index.html#/storyboard";
        };
        
        $scope.update_quest = function() {
          var currentNumVideos = 1;
          $resource('/jsonapi/quest/:questID').get({"questID":$scope.game.questID},
          function(response){
            $scope.quest = response;
            //alert("Retrieved quest. Could check for video unlocks here.");
          });
        };

		$scope.create_practice_game($scope.LevelID,$scope.numProblems);

		//to retrieve path info to display on path play page
		$scope.$watch('game.problems.problems[current_problem_index].name', function() {
	        var path_id = $scope.path_IDD;
			$scope.retrieved_path = $resource('/jsonapi/get_path_progress/:path_id');
	        //Including details=1 returns the nested problemset progress.
	        $scope.retrieved_path.get({"path_id":path_id}, function(response){
	        	$scope.single_path_info = response;
	        });
	 	},true);
}

function JsonRecordController($scope,$resource){
    $scope.fetch = function(){
      ///jsonapi/get_dau_and_mau?daysAgo=1&days=28
      //$scope.JRModel = $resource('/jsonapi/rest/jsonrecord?limit=2');
      $scope.JRModel = $resource('/jsonapi/get_dau_and_mau');
      
      $scope.JRModel.get({"daysAgo":1, "days":14}, function(response){
        $scope.items = response;
      });
    };
}

//The quest controller returns a players quests or specific quest
function QuestController($scope,$resource,$location,$routeParams,$cookieStore){
  	$scope.paths = $resource('/jsonapi/get_game_paths').get();
  	$scope.mobile_paths = $resource('/jsonapi/mobile_paths').query();
    $scope.quests = new Array();
    $scope.changeRoute = 'normal_play_page.html';
    $scope.name = $cookieStore.get("name");
    if($cookieStore.get("name")){
      $scope.questID = $cookieStore.get("name").id;//retrieve quest id from Storyboard page
    }
    $scope.difficulty = "Drag-n-Drop";
    $scope.pathDes = "Python";

    //Create quest
    $scope.create_quest = function(storyID,pathName,difficulty){
/*       //alert("storyID "+storyID+" pathID "+ pathID+" difficult "+difficulty);
      $scope.SaveResource = $resource('/jsonapi/rest/quest', 
                    {}, 
                    {'save': { method: 'POST',    params: {} }});
      
      var newQuest = {"name":"New Quest",
                      "storyID": storyID,
                      "pathID":pathID,
                      "difficulty":difficulty};
      $scope.$watch('location.search()', function() {
        $scope.target = ($location.search()).target;
      }, true);
      var item = new $scope.SaveResource(newQuest);
      item.$save(function(response) {
        $scope.quest = response;
        //alert("Should redirect to next page with quest ID="+response.id);
        $scope.$parent.flash = response.id;
        $cookieStore.put("name", response.storyID);
        $location.search('questID',response.id).path('storyboard')
        $scope.list();
      }); */
	  
      $scope.$watch('location.search()', function() {
        $scope.target = ($location.search()).target;
      }, true);
      $scope.newQuest = {}
      $scope.newQuest.storyID = storyID;
		
  		if(difficulty=="Drag-n-Drop"){
  			for(var i=0; i<$scope.mobile_paths.length;i++){
  				var a = " " + pathName;
  				var b = " " + $scope.mobile_paths[i].name.trim().substring(9);
  				if(a == b){
  					$scope.newQuest.pathID = $scope.mobile_paths[i].path_id;
  					break;
  				}
  			}
  		}
  		else{
  			for(var i=0; i<$scope.paths.paths.length;i++){
  				var a = " " + pathName.trim();
  				var b = " " + $scope.paths.paths[i].name.trim();
  				if(a == b){
  					$scope.newQuest.pathID = $scope.paths.paths[i].id;
  					break;
  				}
  			}
  		}
      $scope.newQuest.difficulty = difficulty;

      $scope.NewQuest = $resource('/jsonapi/quest');
      var new_quest = new $scope.NewQuest($scope.newQuest);
      
      new_quest.$save(function(response){
        $scope.quest = response;
        $cookieStore.put("name", response);
  	    $cookieStore.put("type", "questGame");
        $scope.list();
        $location.path('storyboard');
      });
    };

    $scope.QuestModel = $resource('/jsonapi/quest/:id');
    
    //A method to fetch a generic model and id. 
    
    $scope.fetch = function(id){
      $scope.quest = $scope.QuestModel.get({'id':id});
    };

    $scope.list = function(){
      $scope.quests = $scope.QuestModel.query();
      //}
      //$scope.QuestModel.query({}, function(response){
      //    $scope.quests = response;
      //});
    };
    
    $scope.create_quest_game_from_QuestController = function(questID){
      console.log("creating a new game for quest from quest controller "+questID);
      $scope.NewQuestGame = $resource('/jsonapi/create_quest_game/:questID');
      $scope.NewQuestGame.get({'questID':questID}, function(response){
        $scope.game = response;
        $scope.list();
        console.log("reply for create quest game in quest model");
        //Update the parent game model by calling game fetch method. 
      });
    };

    $scope.create_new_quest = function(storyID,pathID,difficulty){
      $scope.newQuest = {}
      $scope.newQuest.storyID = storyID;
      $scope.newQuest.pathID = pathID;
      $scope.newQuest.difficulty = difficulty;

      $scope.NewQuest = $resource('/jsonapi/quest');
      var new_quest = new $scope.NewQuest($scope.newQuest);
      new_quest.$save(function(response){
        $scope.quest = response;
        $scope.list();
      });
    };

    $scope.loadLinks = function(videoID){
      //check if the herf is still "Locked"
      if($scope.name.videos[videoID] == "LOCKED"){
        $('#warningBoard').modal('show');
      }
    };

    $scope.loadUnfinshed = function(quest){
	  $cookieStore.put("type", "questGame");
      $cookieStore.put("name", quest);
      $location.path('storyboard');
    };

     $scope.updateQuest = function(){
       //Make sure there is a questID before fetching or 
       //you will fetch the list of quests
       if($scope.questID){
         $resource('/jsonapi/quest/:questID').get({"questID":$scope.questID},
            function(response){
              $scope.name = response;
              $cookieStore.put("name", $scope.name);
              //window.location = "index.html#/storyboard";
		 });
       }
    };

    $scope.playback = function(){
		$('#video').trigger('click');
    };

    $scope.addDefaultLevel=function(checker){
      if(checker){
        $('#levels button:button').click();  
      }
    }

    $scope.addDefaultLevelSmall=function(checker){
      if(checker){
        $('#levelsmall button:button').click();  
        $('#levelsmall button:button').click();  
      }
    }

    $scope.$watch('name', function() {
      if($scope.name && $scope.name.difficulty == "Drag-n-Drop"){
        $scope.changeRoute = "playPage.html";
      }
    }, true);

    $scope.list();
    $scope.updateQuest();

}

//Test story controller. Normally use GenericController
function StoryController($scope,$resource,$cookieStore,$location,$http){
	$scope.arrayVideo = [];
	$scope.Videos = [];
	$scope.newStoryID = "";
	$scope.videoURL = "";
	$scope.description = "";
	$scope.Title = "";
	$scope.stories = "";
	$scope.publishStatus = "";
	$scope.videos = "";
	$scope.myStories = "";
	$scope.myVideos = "";
	$scope.editOrCreate = "create";
	
	$scope.name = $cookieStore.get("name");
    $scope.StoryModel = $resource('/jsonapi/story');
    //We will need a different controller or resource to fetch player stories. 
    //Maybe PlayerStoryModel = $resource('/jsonapi/player_stories');
    //Not this since we still need the public stories. $scope.StoryModel = $resource('/jsonapi/player_stories');
	

    var abc = 0;
    //A method to fetch a generic model and id. 
    $scope.list = function(){
          $scope.StoryModel.query({}, function(response){
              $scope.stories = response;
              $scope.videos = $scope.stories[0].videos;
			  $scope.$parent.storyid = $scope.stories[abc].id;
              //alert("There are "+$scope.stories.length+" stories.");
          });
    };
	$scope.myStoryModel = $resource('/jsonapi/player_stories');
	//fetch list of 
	$scope.myStorylist = function(){
          $scope.myStoryModel.query({}, function(response){
              $scope.myStories = response;
              $scope.myVideos = $scope.myStories[0].videos;
			  $scope.$parent.storyid = $scope.myStories[abc].id;
              //alert("There are "+$scope.stories.length+" stories.");
          });
    };
	
	
    //$scope.fetch_stories();
    $scope.goToStory=function(){

    };

    // this method add background color to the selected images 
    $scope.addQuestColor=function(checker){
		$('#myCarousel input:image').click(function() {
		$('#myCarousel input:image').removeClass('selected');
		$(this).addClass('selected');     
			});
		if(checker){
			$('#myCarousel input:image').click();
		}
    }

    // this method add background color to the selected images 
    $scope.addQuestColorSmall=function(checker){
		$('#myCarouselSmall input:image').click(function() {
        $('#myCarouselSmall input:image').removeClass('selected');   
        $(this).addClass('selected');
        
		});
		
		if(checker){
			$('#myCarouselSmall input:image').click();
		}
    }

	//Create story

	//1. Load all stories created by user 

	//2. Edit an exiting story
		$scope.goToEditStory = function(storyID){
		$('#tabCr').addClass('active');
        $('#tabCu').removeClass('active');
        $('#tab2create').addClass('active');
        $('#tab1current').removeClass('active');
			
		$scope.storyModel = $resource('/jsonapi/story/:storyID');

		$scope.storyModel.get({"storyID":storyID}, function(response){
			$scope.currentStory = response;
			$scope.description = response.description;
			$scope.Title = response.name;
			$scope.Videos = response.videos;
			$scope.publishStatus = response.published;
			$cookieStore.put("editStory", response);
			$scope.editOrCreate = "edit";
		}); 
	}
	
	//3. Playback an existing story
	$scope.playback = function(index){
		$scope.myVideos = $scope.myStories[index].videos;
		$('#video').trigger('click');
    };
	//4. View statistics on existing story

	//5. Create or edit a Story
    $scope.create_story = function(title,des){
      $scope.newStory = {};
      $scope.newStory.name = title;
  	  $scope.newStory.description = des;
	  $scope.newStory.videos = $scope.Videos;
      $scope.newStory.published = false;

      
	  if($scope.editOrCreate == "edit"){
			$scope.currentStoryID = $cookieStore.get("editStory").id;
			$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$http.post('/jsonapi/story/'+$scope.currentStoryID, {
							name:$scope.newStory.name,
							description:$scope.newStory.description,
							videos:$scope.newStory.videos,
							published:$scope.newStory.published
			}).success(function (data, status, headers, config) {
				$scope.registration_response = data;
			}).error(function (data, status, headers, config) {
				$scope.registration_response = data;
			});
		}
		else{
				$scope.NewStory = $resource('/jsonapi/story');
				var new_story = new $scope.NewStory($scope.newStory);
				new_story.$save(function(response){
					$scope.story = response;
					$scope.newStoryID = response.id;
			});
		}
		window.location.reload();
    };
	
		//// once video url is added, 1. add new row in the table 2. Obtain video name 3. obtain video length 
	   	$scope.addVideo=function(videoURL){
			if(videoURL.length==42){
				//Videos for the purpose of story creation
				$scope.Videos.push(videoURL.substring(31));
				$scope.videoURL="";
			}
			else{
				alert("Please put in a valid YouTube URL!");
			}
		}
		
	    ////Enable reordering of rows under sequence column, & save the order	   
		$scope.moveUp = function(index){
			if (index!=0){
				var tempVideos = $scope.Videos[index-1];
				
				$scope.Videos[index-1] = $scope.Videos[index];
				
				$scope.Videos[index] = tempVideos;
			}
		};
		
		$scope.moveDown = function(index){
			if (index!=($scope.Videos.length-1)){
				var tempVideos = $scope.Videos[index+1];
				
				$scope.Videos[index+1] = $scope.Videos[index];

				$scope.Videos[index] = tempVideos;
			}
		};   
	   ////set story image as that of the first video thumbnail
	   
	//6. If user is admin, enable publish(yes|no)
	
		////if admin made saved a story/edited a story, enable the "Publish" button
		
		////if user clicks publish, set published value to true, disable publish button to "Pubished"
		$scope.publish_story = function(title,des){
		  $scope.newStory = {};
		  $scope.newStory.name = title;
		  $scope.newStory.description = des;
		  $scope.newStory.videos = $scope.Videos;
		  $scope.newStory.published = true;

      

			$scope.currentStoryID = $cookieStore.get("editStory").id;
			$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$http.post('/jsonapi/story/'+$scope.currentStoryID, {
							name:$scope.newStory.name,
							description:$scope.newStory.description,
							videos:$scope.newStory.videos,
							published:true
			}).success(function (data, status, headers, config) {
				$scope.registration_response = data;
			}).error(function (data, status, headers, config) {
				$scope.registration_response = data;
			});
		
			window.location.reload();
		};
	
	$scope.deleteVideo=function(id){
		$scope.Videos.splice(id, 1);
	};
	
	$scope.changeToCreate=function(){
		$scope.arrayVideo = [];
		$scope.Videos = [];
		$scope.newStoryID = "";
		$scope.videoURL = "";
		$scope.description = "";
		$scope.Title = "";
		$scope.stories = "";
		$scope.publishStatus = null;
		$scope.videos = "";
		$scope.editOrCreate = "create";
	};
}

//Test story controller. Normally use GenericController
function TimeAndAttemptsController($scope,$resource){
    $scope.item = $resource('/jsonapi/attempts_and_time_by_day').get();
}

function TournamentController($scope,$resource,$http){
    $scope.TournamentModel = $resource('/jsonapi/list_open_tournaments');
    $scope.TournamentHeatGameModel = $resource('/jsonapi/create_game/heatID/:heatID');
    
    $scope.TournamentHeatModel = $resource('/jsonapi/get_heat_ranking');
    $scope.tournamentID = null;
    //$scope.heatID = 12883052;
    $scope.heat = null;
    
    //A method to fetch a generic model and id. 
    //Pass in ID
    $scope.fetch_heat = function(heatID){
          $scope.TournamentHeatModel.get({"heatID":heatID}, function(response){
              $scope.heat = response;
          });
    };

    $scope.create_heat_game = function(){
          $scope.TournamentHeatGameModel.get({"heatID":$scope.heat.heatID}, function(response){
              $scope.game = response;
          });
    };

    $scope.fetch_tournaments = function(){
          $scope.TournamentModel.query({}, function(response){
              $scope.tournaments = response;
          });
    };

    $scope.register_for_tournament = function(){
        //Use a normal form post for this legacy API.
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $http.post("/jsonapi/verify_tournament_password", {
            tournamentID: $scope.tournamentID,
            password: $scope.tournamentPassword
        }).success(function (data, status, headers, config) {
            $scope.registration_response = data;
        }).error(function (data, status, headers, config) {
            $scope.registration_response = data;
        });
    };

    $scope.play_tournament = function(){
          alert("Preparing to launch tournament game.");
          //$scope.TournamentModel.query({}, function(response){
          //    $scope.tournaments = response;
          //});
    };  
}


function RankController($scope,$resource,$cookieStore,$location){
	$scope.selectedPlayer;
	//fetch list of rankers based in the path selected by user
	$scope.get_path_ranks = function(pathId){
		//ALL Languages
		if(pathId=='AllLanguages'){
			
			// based on player's country
			var data = {"countryCode":$scope.player.countryCode};
			$scope.playerCountry = $resource('/jsonapi/player');
			var nation = data.countryCode;
			
			$scope.pathRankModelAllSg = $resource('/jsonapi/worldwide_ranking?maxRank=25&countryCode=:country');
			
			$scope.pathRankModel1.get({"country":nation}, function(response){
				$scope.rankingUserCountry = response;
			});
			
			//worldwide ranking
			$scope.pathRankModelAllGlobal = $resource('/jsonapi/worldwide_ranking?maxRank=25');
			
			$scope.pathRankModelAllGlobal.get(function(response){
				$scope.rankingGlobal = response;
			});
				
		}
		//selected individual language
		else{
			// based on player's country
			var data = {"countryCode":$scope.player.countryCode};
			$scope.playerCountry = $resource('/jsonapi/player');
			var nation = data.countryCode;
			
			$scope.pathRankModel1 = $resource('/jsonapi/worldwide_ranking?maxRank=25&path_id=:pathId&countryCode=:country');
			
			$scope.pathRankModel1.get({"pathId":pathId,"country":nation}, function(response){
				$scope.rankingUserCountry = response;
			});
			
			//worldwide ranking
			$scope.pathRankModel2 = $resource('/jsonapi/worldwide_ranking?maxRank=25&path_id=:pathId');
			
			$scope.pathRankModel2.get({"pathId":pathId}, function(response){
				$scope.rankingGlobal = response;
			});
		}	
		$cookieStore.put("path_id", pathId);
		
    };
	
	//fetch countries rank based	
	$scope.get_country_ranks = function(){
        $scope.countryRank = $resource('/jsonapi/country_ranking?maxRank=300').get();
    };
	
	$scope.get_player_details = function(playerId){
		
		//alert("professional":$scope.playerNo.professional);
		$scope.selectedPlayerModel = $resource('/jsonapi/player/:playerId');
		$scope.selectedPlayerModel.get({"playerId":playerId}, function(response){
			$scope.selectedPlayer = response;
		});	
		//console.log($scope.selectedPlayer);
		
		$scope.arrayTags=$scope.selectedPlayer.tags;
		$scope.arrayBadges=$scope.selectedPlayer.badges;
				
		$('#playerDetails').modal('show');
	
	}
	
	//onclick of country flag display country's players' ranking for the selected path
	
	$scope.get_countrypath_ranks = function(countryCode,countryName){
		//alert(countryCode);
		var pathId = $cookieStore.get("path_id");
		//ALL Languages
		if(pathId=='AllLanguages'){			
	
			$scope.pathRankModelAllCountry = $resource('/jsonapi/worldwide_ranking?maxRank=25&countryCode=:countryCode');		
			$scope.pathRankModelAllCountry.get({"countryCode":countryCode}, function(response){
				$scope.rankingUserCountry = response;
			});		
						
		}
		//selected individual language
		else{

			$scope.pathRankModelPathCountry = $resource('/jsonapi/worldwide_ranking?maxRank=25&path_id=:pathId&countryCode=:countryCode');
			$scope.pathRankModelPathCountry.get({"pathId":pathId,"countryCode":countryCode}, function(response){
				$scope.rankingUserCountry = response;
			});
						
		}
		//render new data
		$scope.current_country = countryName;

		$('#tab1world').removeClass('active');
		$('#tab2WORLD').removeClass('active');
        $('#tab2SG').addClass('active');
        $('#tab1sg').addClass('active');		
    };
	
}