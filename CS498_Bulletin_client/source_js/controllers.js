var BulletinControllers = angular.module('BulletinControllers', []);

BulletinControllers.controller('LoginController', ['$scope', '$rootScope', '$location', 'Data', function($scope, $rootScope, $location, Data) {
	$scope.user = "";
	
	$scope.login = function() {
		Data.getUsers().success(function(data) {
			var users = data.data;
			for (var i = 0; i < users.length; i++) {
				if ($('input[name="email"]').val() == users[i].email &&
					$('input[name="password"]').val() == users[i].password) {
					$scope.user = users[i];
					$location.path('/' + $scope.user._id + '/HomePage');
					document.getElementById("RC_loginLink").innerHTML = "Log out";
					document.getElementById("RC_loginLink").onclick = function() {
						$rootScope.$apply(function() {
							$location.path('/HomePage');
						});
						document.getElementById("RC_loginLink").innerHTML = "Log in";
						document.getElementById("RC_loginLink").onclick = function() {
							openModal('#RC_loginModal');
						}
						location.reload();
					}
					closeModal('#RC_loginModal');
					break;
				}
			}
		});
	};
}]);

BulletinControllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);

BulletinControllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


BulletinControllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);

BulletinControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);

BulletinControllers.controller('AccountSettingsController', ['$scope', '$routeParams', '$http', 'Data', function($scope, $routeParams, $http, Data) {
	
	Data.getProfile().success(function(data) {
		$scope.user = data.data;
    $scope.id = $scope.user._id;

    $scope.saveAccountSettings = function() {
      Data.getUser($scope.id).success(function(data) {
        var password = $scope.user.password;
        if ($('input[name="password1"]').val() == $('input[name="password2"]').val() &&
          $('input[name="password1"]').val() != "") {
          password = $('input[name="password1"]').val();
        }
        var imageURL = $('input[name="imageURL"]').val();
        if ($('input[name="imageURL"]').val() == "") {
          imageURL = "./data/images/profile.jpg";
        }
        var newUser = {
          name: $('input[name="name"]').val(),
          email: $('input[name="email"]').val(),
          password: $('input[name="password1"]').val(),
          imageURL: imageURL
        };
        $http.put('http://162.243.18.198:4000/api/AccountSettings', newUser).success(function(data) {
          window.location.href = "#/MyProfilePage";
        });
      });
    };

	});
	
	
}]);

BulletinControllers.controller('SignUpController', ['$scope', 'Data', function($scope, Data) {

	$scope.createAccount = function(){
		if ($('input[name="password"]').val() != $('input[name="password2"]').val()) {
      return;
		}
		var imageURL = $('input[name="imageURL"]').val();
		if (imageURL == "") {
			imageURL = "./data/images/profile.jpg";
		}

    $scope.newuser.imageURL = imageURL;
		/*var user = {
			name: $('input[name="name"]').val(),
			email: $('input[name="email"]').val(),
			password: $('input[name="password"]').val(),
			imageURL: imageURL
		};*/

    console.log($scope.newuser);
		Data.createUser($scope.newuser).success(function(data){
      window.location.href = "#/MyProfilePage";
    });
	};
}]);

BulletinControllers.controller('HomeController', ['$scope', '$http', 'Data', '$window' , function($scope, $http,  Data, $window) {
  $(document).foundation();

  $scope.username = '';
  $scope.password = '';
  $scope.isLoggedIn = false;

  Data.getProfile().success(function(data) {
    console.log(data.data);
    if (data.data != null) {
      $scope.isLoggedIn = true;
      $scope.thisUser = data.data;
    }
  })

  $scope.showSettingsMenu = function(){
       $("#settingsMenu").toggle();
  };

  $scope.logOut = function() {
    $http.get('http://162.243.18.198:4000/api/logout').success(function(data) {
      location.reload();
    });
  };

  $scope.goToCreatePage = function() {
    window.location = "#/CreateProject";
  }


}]);




BulletinControllers.controller('MyProfileController', ['$scope' , '$rootScope', '$window' , 'Data', '$http', '$route', '$routeParams', function($scope, $rootScope, $window, Data, $http, $route, $routeParams) {

  $(document).foundation();
  $rootScope.basicQuery = '';
  $scope.loggedIn = true;

  $scope.low = 0; //pagination low value
  $scope.high = 3; //pagination high value
  $scope.lowJP = 0;
  $scope.highJP = 3;
  $scope.startOfList = true;
  $scope.startOfJPList = true;
  $scope.shown = 3;

  $scope.showSettingsMenu = function(){
       $("#settingsMenu").toggle();
  };

  $scope.logOut = function() {
    $http.get('http://162.243.18.198:4000/api/logout').success(function(data) {
      $window.location.href = '#/HomePage';
    });
  };

  $scope.username = '';
  $scope.skills = [];
  $scope.myProjects = [];
  $scope.joinedProjects = [];
  $scope.pendingProjects = [];
  $scope.skillNames = [];
  $scope.newSkill = '';
  Data.getProfile().success(function(data){
    $scope.userX = data.data;
    $scope.userid = data.data._id;
    $scope.username = data.data.name;
    $scope.skills = data.data.skills;
    $scope.myProjects = data.data.myProjects;
    console.log($scope.userX);
    $scope.joinedProjects = data.data.joinedProjects;
    $scope.pendingProjects = data.data.pendingProjects;
    $scope.image = data.data.imageURL;

    for (var i=0; i < $scope.skills.length; i++){
      Data.getSkill($scope.skills[i]).success(function(data){
        $scope.skillName = data.data.name;
        $scope.skillNames.push($scope.skillName);
      }).error(function(data){console.log('Error: ' + data)});
    }

    $scope.joinedProjectsInfo = [];
    //$scope.projectCreatorNames = [];
    for(var i=0; i<$scope.joinedProjects.length; i++){
      Data.getProject($scope.joinedProjects[i]).success(function(data){
        console.log('Got joined projects: ' + data.data);
        $scope.joinedProjectX = data.data;
        $scope.joinedProjectsInfo.push($scope.joinedProjectX);

      }).error(function(data){console.log('Error: '+data)});
    }

    $http({
      url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&count=true',
      method: 'GET'
    }).success(function(data){
        $scope.count = data.data;
        console.log("Count: " + $scope.count);
        if($scope.high >= $scope.count) {
          $scope.endOfList = true;
        } else {
          $scope.endOfList = false;
        }
      }).error(function(data){console.log('Error: '+data)});

      $http({
        url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&skip='+$scope.low+'&limit=3',
        method: 'GET'
      }).success(function(data){
        $scope.projects = data.data;

      }).error(function(data){console.log('Error: '+data)});

      $http({
          url: 'http://162.243.18.198:4000/api/projects?where={"approvedMembers":"'+$scope.userid+'"}',
          method: 'GET'

        }).success(function(data){
        $scope.joinedProjectsAM = data.data;
        console.log($scope.joinedProjectsAll);

        $scope.pendingAM = [];
          for(var i=0; i<$scope.joinedProjectsAM.length; i++){
            $scope.pendingAM[i] = 'Accepted';
          }


        $http({
          url: 'http://162.243.18.198:4000/api/projects?where={"pendingMembers":"'+$scope.userid+'"}',
          method: 'GET'
        }).success(function(data){
          $scope.joinedProjectsPM = data.data;

          $scope.joinedProjectsAll = $scope.joinedProjectsAM.concat($scope.joinedProjectsPM);
          console.log($scope.joinedProjectsAll);

          $scope.countJP = $scope.joinedProjectsAll.length;

          if($scope.highJP >= $scope.countJP) {
            $scope.endOfJPList = true;
          } else {
            $scope.endOfJPList = false;
          }

          $scope.pendingPM = [];
          for(var i=0; i<$scope.joinedProjectsPM.length; i++){
            $scope.pendingPM[i] = 'Pending';
          }

          $scope.pending = $scope.pendingAM.concat($scope.pendingPM);
          console.log($scope.pending);

          $scope.repeatData = $scope.joinedProjectsAll.map(function(value, index){
            return {
              data: value,
              value: $scope.pending[index]
            }
          });

          console.log('Repeat Data: '+$scope.repeatData);

        }).error(function(data){console.log('Error: '+data)});

      }).error(function(data){console.log('Error: '+data)});

    $scope.allSkillsNames = [];
    Data.getSkills().success(function(data){
      $scope.allSkills = data.data;
      console.log('got all skills');

      for (var i=0; i < $scope.allSkills.length; i++){
         Data.getSkill($scope.allSkills[i]._id).success(function(data){
            $scope.oneSkillName = data.data.name;
            $scope.allSkillsNames.push($scope.oneSkillName);
          }).error(function(data){console.log('Error: ' + data)});
        }

    }).error(function(data){console.log('Error: '+data)});

    $scope.setSkillInput = function(name){
      $scope.newSkill = name;
    }

  $scope.loadDetails = function(id, value) {
    Data.getProject(id).success(function(data){
      $scope.projectY = data.data;
	  $scope.value = value;
	  Data.getUser(data.data.creator).success(function(data) {
		  $scope.creatorEmail = data.data.local.email;
	  });
    }).error(function(data){console.log('Error: '+data)});
  }

  $scope.nextPage = function(){
      $scope.low = $scope.high;
      $scope.high += 3;
      $scope.startOfList = false;
      console.log("Count: " + $scope.count + " Low, High: " + $scope.low + ", " + $scope.high);

      $http({
        url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&skip='+$scope.low+'&limit=3',
        method: 'GET'
      }).success(function(data){
        $scope.projects = data.data;
        //$route.reload();

        if($scope.high >= $scope.count) {
          $scope.high = $scope.count;
          $scope.endOfList = true;
        } else {
          $scope.endOfList = false;
        }

      }).error(function(data){console.log('Error: ' + data.data)});
    };


  $scope.nextPageJP = function(){
      $scope.lowJP = $scope.highJP;
      $scope.highJP += 3;
      $scope.startOfJPList = false;
      console.log("Count: " + $scope.countJP + " Low, High: " + $scope.lowJP + ", " + $scope.highJP);

        if($scope.highJP >= $scope.countJP) {
          $scope.highJP = $scope.countJP;
          $scope.endOfJPList = true;
        } else {
          $scope.endOfJPList = false;
        }

    };

    $scope.prevPage = function(){
      $scope.high = $scope.low;
      $scope.low = $scope.low-3;
      $scope.endOfList = false;
      console.log($scope.low + ", " + $scope.high);

      $http({
        url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&skip='+$scope.low+'&limit=3',
        method: 'GET'
      }).success(function(data){
        $scope.projects = data.data;

        if($scope.low <= 0) {
          $scope.startOfList = true;
        } else {
          $scope.startOfList = false;
        }

      }).error(function(data){console.log('Error: ' + data.data)});
    };

      $scope.prevPageJP = function(){
      $scope.highJP = $scope.lowJP;
      $scope.lowJP = $scope.lowJP-3;
      $scope.endOfJPList = false;
      console.log($scope.lowJP + ", " + $scope.highJP);

        if($scope.lowJP <= 0) {
          $scope.startOfJPList = true;
        } else {
          $scope.startOfJPList = false;
        }

    };

    $scope.sendSearch = function(value) {
      $rootScope.basicQuery = value; 
      window.location.href = '#/Search'; 
    };

    $scope.leaveProject = function(id) {

      var projectIDtoDelete = id; 

      for(var i=0; i<$scope.userX.joinedProjects.length; i++){
        if($scope.userX.joinedProjects[i] == projectIDtoDelete){
          $scope.userX.joinedProjects.splice(i,1);
          break;
        }
      }

      for(var i=0; i < $scope.userX.pendingProjects.length; i++){
        if($scope.userX.pendingProjects[i] == projectIDtoDelete){
          $scope.userX.pendingProjects.splice(i,1);
          break;
        }
      }

      Data.getProject(projectIDtoDelete).success(function(data){
        $scope.projectToUpdate = data.data;
        $scope.approvedMembersToUpdate = data.data.approvedMembers;
        $scope.pendingMembersToUpdate = data.data.pendingMembers;


          for(var i=0; i<$scope.approvedMembersToUpdate.length; i++){
            if($scope.approvedMembersToUpdate[i] == $scope.userid){
              $scope.approvedMembersToUpdate.splice(i,1);
              break;
            }
          }

          for(var i=0; i < $scope.pendingMembersToUpdate.length; i++){
            if($scope.pendingMembersToUpdate[i] == $scope.userid){
              $scope.pendingMembersToUpdate.splice(i,1);
              break;
            }
          }

          var updatedProject = {
              name: $scope.projectToUpdate.name,
              description: $scope.projectToUpdate.description,
              deadline: $scope.projectToUpdate.deadline,
              visible: $scope.projectToUpdate.visible,
              skills: $scope.projectToUpdate.skills,
              categories: $scope.projectToUpdate.categories,
              tags: $scope.projectToUpdate.tags,
              creator: $scope.projectToUpdate.creator,
              pendingMembers: $scope.pendingMembersToUpdate,
              approvedMembers: $scope.approvedMembersToUpdate,
              dateCreated: $scope.projectToUpdate.dateCreated,
              imageURL: $scope.projectToUpdate.imageURL
          }

          $http({
            url: 'http://162.243.18.198:4000/api/projects/'+projectIDtoDelete,
            data: updatedProject,
            method: 'PUT'
          }).success(function(data){
            console.log('Project updated');
            Data.editUser($scope.userX._id, $scope.userX).success(function(data){
              location.reload();
            });
          }).error(function(data){console.log('Error: '+data)});



      }).error(function(data){console.log('Error: '+data)});

    };

    $scope.deleteSkill = function(name) {
      $scope.key = 'name';
      $scope.skillName = name;
      console.log($scope.skillName);
      $http({
        url: 'http://162.243.18.198:4000/api/skills?where={"name":"'+$scope.skillName+'"}',
        method: 'GET'
      }).success(function(data){
        console.log('Made it '+data.data[0]);
        $scope.skillX = data.data[0];
        $scope.skillID = data.data[0]._id;
        console.log($scope.skillID);

          for(var i=0; i<$scope.skills.length; i++){
            if($scope.skills[i] == $scope.skillID){
              $scope.skills.splice(i, 1);
            }
          }

          for(var i=0; i<$scope.skillNames.length; i++){
            if($scope.skillNames[i] == $scope.skillName){
              $scope.skillNames.splice(i, 1);
            }
          }

          var updatedUser = {
            name: $scope.username,
            email: $scope.userX.email,
            password: $scope.userX.password,
            skills: $scope.skills,
            myProjects: $scope.myProjects,
            joinedProjects: $scope.joinedProjects,
            dateCreated: $scope.userX.dateCreated
          };

           $http({
            url: 'http://162.243.18.198:4000/api/users/'+$scope.userid,
            data: updatedUser,
            method: 'PUT'
          }).success(function(data){
            console.log('User updated');
          }).error(function(data){console.log('Error: '+data)});

      }).error(function(data){console.log('Error: '+data)});
    };

    $scope.inList = false;

    $scope.updateSkills = function(skill) {

      $scope.inList = false;
      var flag = false;
      var skillIsNew = true; 
      console.log($scope.flag);
      $scope.enteredSkill = skill;

      for(var i=0; i<$scope.skills.length; i++){
        if($scope.skills[i]==null | $scope.skills[i]==undefined){
          $scope.skills.splice(i, 1);
          console.log($scope.skills);
          i = i-1;
        }
      }

      for (var i=0; i<$scope.skillNames.length; i++){

        if($scope.skillNames[i] == null | $scope.skillNames[i] == undefined){
          $scope.skillNames.splice(i, 1);
        }
        if($scope.enteredSkill == $scope.skillNames[i]){ 
              console.log('already in your list!');
              $scope.inList = true;
              skillIsNew = false;
              flag = true;
        }
      }

      for (var i=0; i<$scope.allSkillsNames.length; i++){

        if($scope.allSkillsNames[i] == null | $scope.allSkillsNames[i] == undefined){
          $scope.allSkillsNames.splice(i, 1);
        }
        if(($scope.enteredSkill == $scope.allSkillsNames[i]) && flag == false ){ 
                flag = true; 
                skillIsNew = false;                                    
                $http({
                  url: 'http://162.243.18.198:4000/api/skills?where={"name":"'+$scope.enteredSkill+'"}',
                  method: 'GET'
                }).success(function(data){
                      console.log('Made it '+data.data[0].name);
                      $scope.skillXupdate = data.data[0];
                      $scope.skillIDupdate = data.data[0]._id;
                      console.log($scope.skillIDupdate);

                      $scope.skills.push($scope.skillIDupdate);  
                      $scope.skillNames.push($scope.enteredSkill);

                      var updatedUser = {
                      name: $scope.username,
                      email: $scope.userX.email,
                      password: $scope.userX.password,
                      skills: $scope.skills,
                      myProjects: $scope.myProjects,
                      joinedProjects: $scope.joinedProjects,
                      dateCreated: $scope.userX.dateCreated
                    };

                    console.log('Updated User: '+ updatedUser);

                    $http({
                      url: 'http://162.243.18.198:4000/api/users/'+$scope.userid,
                      data: updatedUser,
                      method: 'PUT',
                    })
                    .success(function(data){
                      console.log('New Skill updated to User');
                      console.log(data);
                    }).error(function(data){console.log('Error: '+data)});
                    
                  }).error(function(data){console.log('Error: '+data)});
        } 
      }


      if (flag == false && skillIsNew == true){
      console.log("I'm in the new skill area");
      $scope.newSkillName = $scope.enteredSkill;
      console.log($scope.newSkillName);

        var newSkill = {
          name: $scope.newSkillName
        }

        console.log(newSkill);

        Data.createSkill(newSkill).success(function(data){
          console.log('Skill created');
          $scope.skillX = data.data;
          $scope.skillXName = data.data.name;
          $scope.skillID = data.data._id;

          $scope.skills.push($scope.skillID);
          $scope.skillNames.push($scope.skillXName);

          var updatedUser = {
            name: $scope.username,
            email: $scope.userX.email,
            password: $scope.userX.password,
            skills: $scope.skills,
            myProjects: $scope.myProjects,
            joinedProjects: $scope.joinedProjects,
            dateCreated: $scope.userX.dateCreated
          };

          console.log(updatedUser);

          $http({
            url: 'http://162.243.18.198:4000/api/users/'+$scope.userid,
            data: updatedUser,
            method: 'PUT',
          })
          .success(function(data){
            console.log('New Skill updated to User');
          }).error(function(data){console.log('Error: '+data)});

        }).error(function(data){console.log("Error: "+data)});

      };
       
    };

  }).error(function(data){console.log('Error: '+data)});

  

}]);





BulletinControllers.controller('ProfileController', ['$scope' , '$rootScope', '$window' , 'Data', '$http', '$route', '$routeParams', function($scope, $rootScope, $window, Data, $http, $route, $routeParams) {

  $(document).foundation();
  $rootScope.searchValue = '';

  $scope.low = 0; 
  $scope.high = 3; 
  $scope.lowJP = 0;
  $scope.highJP = 3;
  $scope.startOfList = true;
  $scope.startOfJPList = true;
  $scope.shown = 3;

  $scope.isLoggedIn = false;
  Data.getProfile().success(function(data) {
    console.log(data.data);
    if (data.data != null) {
      $scope.isLoggedIn = true;
      $scope.thisUser = data.data;
    }
  });

  $scope.showSettingsMenu = function(){
       $("#settingsMenu").toggle();
  };

  $scope.showSettingsMenuMED = function(){
    $("#settingsMenuMED").toggle();
  };

  $scope.logOut = function() {
    $http.get('http://162.243.18.198:4000/api/logout').success(function(data) {
      location.reload();
    });
  }

  $scope.username = '';
  $scope.skills = [];
  $scope.myProjects = [];
  $scope.joinedProjects = [];
  $scope.pendingProjects = [];
  $scope.userid = $routeParams.userid;
  $scope.skillNames = [];
  $scope.newSkill = '';

  Data.getUser($scope.userid).success(function(data){
    $scope.userX = data.data;
    $scope.username = data.data.name;
    $scope.skills = data.data.skills;
    $scope.myProjects = data.data.myProjects;
    $scope.joinedProjects = data.data.joinedProjects;
    $scope.pendingProjects = data.data.pendingProjects;
    $scope.image = data.data.imageURL;

    for (var i=0; i < $scope.skills.length; i++){
      Data.getSkill($scope.skills[i]).success(function(data){
        $scope.skillName = data.data.name;
        $scope.skillNames.push($scope.skillName);
      }).error(function(data){console.log('Error: ' + data)});
    }

    $scope.joinedProjectsInfo = [];
    for(var i=0; i<$scope.joinedProjects.length; i++){
      Data.getProject($scope.joinedProjects[i]).success(function(data){
        console.log('Got joined projects: ' + data.data);
        $scope.joinedProjectX = data.data;
        $scope.joinedProjectsInfo.push($scope.joinedProjectX);

      }).error(function(data){console.log('Error: '+data)});
    }

  }).error(function(data){console.log('Error: '+data)});

  $http({
    url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&count=true',
    method: 'GET'
  }).success(function(data){
      $scope.count = data.data;
      console.log("Count: " + $scope.count);
      if($scope.high >= $scope.count) {
        $scope.endOfList = true;
      } else {
        $scope.endOfList = false;
      }
    }).error(function(data){console.log('Error: '+data)});

    $http({
      url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&skip='+$scope.low+'&limit=3',
      method: 'GET'
    }).success(function(data){
      $scope.projects = data.data;

    }).error(function(data){console.log('Error: '+data)});

    $http({
        url: 'http://162.243.18.198:4000/api/projects?where={"approvedMembers":"'+$scope.userid+'"}',
        method: 'GET'
    }).success(function(data){
      $scope.joinedProjectsAM = data.data;
      console.log($scope.joinedProjectsAll);

      $scope.pendingAM = [];
        for(var i=0; i<$scope.joinedProjectsAM.length; i++){
          $scope.pendingAM[i] = 'Accepted';
        }


      $http({
        url: 'http://162.243.18.198:4000/api/projects?where={"pendingMembers":"'+$scope.userid+'"}',
        method: 'GET'
      }).success(function(data){
        $scope.joinedProjectsPM = data.data;

        $scope.joinedProjectsAll = $scope.joinedProjectsAM.concat($scope.joinedProjectsPM);
        console.log($scope.joinedProjectsAll);

        $scope.countJP = $scope.joinedProjectsAll.length;

        if($scope.highJP >= $scope.countJP) {
          $scope.endOfJPList = true;
        } else {
          $scope.endOfJPList = false;
        }

        $scope.pendingPM = [];
        for(var i=0; i<$scope.joinedProjectsPM.length; i++){
          $scope.pendingPM[i] = 'Pending';
        }

        $scope.pending = $scope.pendingAM.concat($scope.pendingPM);
        console.log($scope.pending);

        $scope.repeatData = $scope.joinedProjectsAll.map(function(value, index){
          return {
            data: value,
            value: $scope.pending[index]
          }
        });

        console.log('Repeat Data: '+$scope.repeatData);

      }).error(function(data){console.log('Error: '+data)});

    }).error(function(data){console.log('Error: '+data)});

  $scope.allSkillsNames = [];
  Data.getSkills().success(function(data){
    $scope.allSkills = data.data;
    console.log('got all skills');

    for (var i=0; i < $scope.allSkills.length; i++){
       Data.getSkill($scope.allSkills[i]._id).success(function(data){
          $scope.oneSkillName = data.data.name;
          $scope.allSkillsNames.push($scope.oneSkillName);
        }).error(function(data){console.log('Error: ' + data)});
      }

  }).error(function(data){console.log('Error: '+data)});

  $scope.setSkillInput = function(name){
    $scope.newSkill = name;
  }

$scope.loadDetails = function(id) {
  Data.getProject(id).success(function(data){
    $scope.projectY = data.data;
  }).error(function(data){console.log('Error: '+data)});
}

$scope.nextPage = function(){
    $scope.low = $scope.high;
    $scope.high += 3;
    $scope.startOfList = false;
    console.log("Count: " + $scope.count + " Low, High: " + $scope.low + ", " + $scope.high);

    $http({
      url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&skip='+$scope.low+'&limit=3',
      method: 'GET'
    }).success(function(data){
      $scope.projects = data.data;

      if($scope.high >= $scope.count) {
        $scope.high = $scope.count;
        $scope.endOfList = true;
      } else {
        $scope.endOfList = false;
      }

    }).error(function(data){console.log('Error: ' + data.data)});
  };


$scope.nextPageJP = function(){
    $scope.lowJP = $scope.highJP;
    $scope.highJP += 3;
    $scope.startOfJPList = false;
    console.log("Count: " + $scope.countJP + " Low, High: " + $scope.lowJP + ", " + $scope.highJP);

      if($scope.highJP >= $scope.countJP) {
        $scope.highJP = $scope.countJP;
        $scope.endOfJPList = true;
      } else {
        $scope.endOfJPList = false;
      }

  };

  $scope.prevPage = function(){
    $scope.high = $scope.low;
    $scope.low = $scope.low-3;
    $scope.endOfList = false;
    console.log($scope.low + ", " + $scope.high);

    $http({
      url: 'http://162.243.18.198:4000/api/projects?where={"creator":"'+$scope.userid+'"}&skip='+$scope.low+'&limit=3',
      method: 'GET'
    }).success(function(data){
      $scope.projects = data.data;

      if($scope.low <= 0) {
        $scope.startOfList = true;
      } else {
        $scope.startOfList = false;
      }

    }).error(function(data){console.log('Error: ' + data.data)});
  };

    $scope.prevPageJP = function(){
    $scope.highJP = $scope.lowJP;
    $scope.lowJP = $scope.lowJP-3;
    $scope.endOfJPList = false;
    console.log($scope.lowJP + ", " + $scope.highJP);


      if($scope.lowJP <= 0) {
        $scope.startOfJPList = true;
      } else {
        $scope.startOfJPList = false;
      }

  };

  $scope.sendSearch = function(value) {
    $rootScope.searchValue = value; 
    window.location.href = '#/Search'; 
  };

  $scope.removeJoinModal = function() {
    $('.modalJoinProfile').fadeOut(500);
  }

  $scope.joinProject = function(id) {
    Data.getProfile().success(function(data){
      $scope.currentUser = data.data;
      if (data.data != null) {
        var projectIDtoJoin = id; 
        var alreadyJoined = false;

        for(var i=0; i < $scope.pendingProjects.length; i++){
          if($scope.pendingProjects[i] == projectIDtoJoin){
            alreadyJoined = true;
            break;
          }
        }

        if(alreadyJoined == true){
          //alert that you've already joined
        }

        if(alreadyJoined == false){
          $scope.pendingProjects.push(projectIDtoJoin);
        


          Data.getProject(projectIDtoJoin).success(function(data){
            if (data.data.creator != $scope.currentUser._id) {
              $scope.projectToUpdate2 = data.data;
              $scope.pendingMembersToUpdate2 = data.data.pendingMembers;
              Data.getProfile().success(function(data) {
                $scope.currentUser = data.data;
                $scope.currentUser.pendingProjects.push($scope.projectToUpdate2._id);
                Data.editUser($scope.currentUser._id, $scope.currentUser);


                $scope.pendingMembersToUpdate2.push($scope.currentUser._id);

                var updatedProject = {
                    name: $scope.projectToUpdate2.name,
                    description: $scope.projectToUpdate2.description,
                    deadline: $scope.projectToUpdate2.deadline,
                    visible: $scope.projectToUpdate2.visible,
                    skills: $scope.projectToUpdate2.skills,
                    categories: $scope.projectToUpdate2.categories,
                    tags: $scope.projectToUpdate2.tags,
                    creator: $scope.projectToUpdate2.creator,
                    pendingMembers: $scope.pendingMembersToUpdate2,
                    approvedMembers: $scope.projectToUpdate2.approvedMembers,
                    dateCreated: $scope.projectToUpdate2.dateCreated,
                    imageURL: $scope.projectToUpdate2.imageURL
                }

                $http({
                  url: 'http://162.243.18.198:4000/api/projects/'+projectIDtoJoin,
                  data: updatedProject,
                  method: 'PUT'
                }).success(function(data){
                  console.log('Project joined and updated!');

                  location.reload();
                }).error(function(data){console.log('Error: '+data)});
              });
            }
            else {
              $scope.joinInfo = "You cannot join your own project!";
              $('.modalJoinProfile').fadeIn(500);
            }
            

          }).error(function(data){console.log('Error: '+data)});
        }
      }
      else {
        console.log("NOT LOGGED IN!");
        $scope.joinInfo = "You must be logged in to join a project!";
        $('.modalJoinProfile').fadeIn(500);
      }
      
    });  
  };
}]);



BulletinControllers.controller('SearchController', [
  '$scope',
  '$routeParams',
  '$rootScope',
  '$http',
  '$window',
  'Data',
  function($scope, $routeParams, $rootScope, $http, $window, Data) {
    $window.sessionStorage.baseUrl = "http://localhost:4000";
    $scope.advFilter=[];
    $scope.isLoggedIn = false;

    $scope.whereQuery="{visible:true}";
    Data.getProfile().success(function (data) {
      if (data.data != null) {
        $scope.thisUser=data.data;
        $scope.thisUserId = $scope.thisUser._id;
        $scope.isLoggedIn = true;
        if($rootScope.basicQuery != null && $rootScope.basicQuery != ''){
          $scope.basicQuery = $rootScope.basicQuery;
        }

        $scope.thisUserSkills=data.data.skills;
        for (var i=0;i<$scope.thisUserSkills.length;i++){
          // $scope.thisUserSkills[i]="'"+$scope.thisUserSkills[i]+"'";

        }

        $scope.whereQuery="{visible:true}";
        $scope.matchSkillOption=false;
      }

      $scope.logOut = function() {
        $http.get('http://162.243.18.198:4000/api/logout').success(function(data) {
          location.reload();
        });
      }


      function getProjects() {
        $scope.usernames=[];
        var counter = 0;
        $scope.showM = [];
        $scope.joinM = [];

        Data.getProjects({

          where: $scope.whereQuery,
          select: {
            _id: 1,
            name: 1,
            creator: 1,
            creatorName: 1,
            dateCreated: 1,
            description: 1,
            deadline: 1,
            categories: 1,
            skills: 1,
            pendingMembers:1,
            approvedMembers:1
          },

        }).success(function (data) {

          $scope.projects = data.data;
          console.log($scope.projects.length);
          counter = $scope.projects.length;




          //model controllers
          for (var i = 0; i < $scope.projects.length; i++) {
            $scope.showM[$scope.projects[i]._id]=-1;
            //$scope.showM.push(-1);
            //$scope.joinM.push(-1);

          }

          $scope.showModal = function (index) {






            $scope.showM[index] = 1;
          };
          $scope.removeModal = function (index) {
            $scope.showM[index] = -1;
          };
          $scope.joinThis = function (index) {
            $scope.showM[index] = -1;
            $scope.joinM[index] = 1;

            Data.getProfile().success(function(data) {
              // Logged in
              $scope.currentUser = data.data;
              if (data.data != null) {


                //if ($scope.projects[index].pendingMembers.indexOf($scope.thisUserId)<0) {
                //  $scope.projects[index].pendingMembers.push($scope.thisUserId);
                //  Data.editProject($scope.projects[index]._id, $scope.projects[index]);
                //
                //  $scope.thisUser.pendingProjects.push($scope.projects[index]._id);
                //  Data.editUser($scope.thisUserId, $scope.thisUser);
                //  $scope.joinInfo="We have added you to the waiting list!";
                //}else{
                //  $scope.joinInfo="You are already in the pending list!";
                //}

                Data.getProject(index).success(function(data){

                  $scope.temp=data.data;
                  if ( $scope.temp.pendingMembers.indexOf($scope.thisUserId)<0 && $scope.temp.creator != $scope.currentUser._id) {
                    $scope.temp.pendingMembers.push($scope.thisUserId);
                    Data.editProject($scope.temp._id, $scope.temp);

                    $scope.thisUser.pendingProjects.push($scope.temp._id);
                    Data.editUser($scope.thisUserId, $scope.thisUser);
                    $scope.joinInfo="We have added you to the waiting list!";
                  }else if ($scope.temp.pendingMembers.indexOf($scope.thisUserId)>=0) {
                    $scope.joinInfo="You are already in the pending list!";
                  }else if ($scope.temp.creator == $scope.currentUser._id) {
                    $scope.joinInfo = "You cannot join your own project!";
                  }


                });



              }

              // Not logged in
              else {
                $scope.joinInfo="You need to sign in to join this project!";
              }
            });

          };
          $scope.removeJoinModal = function (index) {
            $scope.joinM[index] = -1;
          };

        })
      }
      getProjects();

      //filterControllers
      $scope.remove = function(ary, elem) {
        var i = ary.indexOf(elem);
        if (i >= 0) ary.splice(i, 1);
        return ary;
      }

      $scope.addFilter=function(id){
        console.log($("#" + id).css("background-color"));
        if ($("#" + id).css("background-color")!=="rgb(204, 204, 204)"){
          $("#" + id).css("background-color", "rgb(204, 204, 204)");

          $scope.advFilter.push("'"+id+"'");
          if ($scope.advFilter.length>0){
            $scope.whereQuery="{categories: { $all:[ "+$scope.advFilter+"]},visible:true}";
          }else{
            $scope.whereQuery="{visible:true}";
          }

          getProjects();
        }
        else {
          $("#" + id).css("background-color", "rgb(51, 51, 51)");
          $scope.advFilter=$scope.remove($scope.advFilter,"'"+id+"'");

          if ($scope.advFilter.length>0){
            $scope.whereQuery="{categories: { $all:[ "+$scope.advFilter+"]},visible:true}";
          }else{
            $scope.whereQuery="{visible:true}";
          }
          getProjects();
        }
      }


      $scope.$watch('matchSkillOption', function(oldVal, newVal) {
        if (newVal !== oldVal) {
          if ($scope.matchSkillOption) {
            if ($scope.advFilter.length > 0) {
              $scope.whereQuery = "{categories: { $all:[ " + $scope.advFilter + "]},";
            } else {
              $scope.whereQuery = "{";
            }
            $scope.whereQuery += "skills: { $elemMatch: { $in: [";
            //$scope.whereQuery += $scope.thisUserSkills;
            for (var i = 0; i < $scope.thisUserSkills.length; i++){
              $scope.whereQuery += "'"+$scope.thisUserSkills[i]+"'"+",";
            }
            $scope.whereQuery += "]} },visible:true}"
            console.log($scope.whereQuery);
            getProjects();

          }else{
            if ($scope.advFilter.length > 0) {
              $scope.whereQuery = "{categories: { $all:[ " + $scope.advFilter + "]},visible:true}";
            } else {
              $scope.whereQuery = "{visible:true}";
            }
            getProjects();

          }
        }

      });

    })

    $scope.showSettingsMenu = function(){
      $("#settingsMenu").toggle();
    };

    $scope.showSettingsMenuMED = function(){
      $("#settingsMenuMED").toggle();
    };

  }
]);






BulletinControllers.controller('EditProjectController', ['$scope', '$http', '$window', 'Data', '$routeParams', function($scope, $http, $window, Data, $routeParams) {
  $scope.projectId = $routeParams.projectid;

  // Setting up the search bar for skills
  $('#SUskillsInput').focusin(function() {
    $('.SUskillsresults').show();
  });
  $('.SUskillsresults').click(function() {
      $('.SUskillsresults').hide();
  });
  $('body').click(function(evt) {
    if (evt.target.id != 'SUskillsInput') {
      $('.SUskillsresults').hide();
    }
  });

  // Setting up modal functionality
  $('#SUcloseDeleteModalError').click(function(){
    $('#SUdeleteModalError').hide();
  });

  $('#SUcloseSubmitModalError').click(function(){
    $('#SUsubmitModalError').hide();
  });

  $scope.openSubmitModal = function() {
    $('#SUsubmitmodal').show();
  }

  $scope.hideSubmitModal = function() {
    $('#SUsubmitmodal').hide();
  }

  $scope.showDeleteModal = function() {
    $('#SUdeletemodal').show();
  }

  $scope.hideDeleteModal = function() {
    $('#SUdeletemodal').hide();
  }

  Data.getCategories().success(function(data) {
    $scope.categories = data.data;
    console.log($scope.categories);
  });

  Data.getSkills().success(function(data) {
    $scope.skills = data.data;
  });

  Data.getProject($scope.projectId).success(function(data) {
    $scope.thisProject = data.data;
    console.log($scope.thisProject);
    $scope.thisProject.deadline = new Date($scope.thisProject.deadline);
    
    $scope.webClicked = false;
    $scope.securityClicked = false;
    $scope.mobileClicked = false;
    $scope.researchClicked = false;
    $scope.graphicsClicked = false;
    $scope.networkClicked = false;
    $scope.gameDevClicked = false;
    $scope.bigDataClicked = false;
    $scope.databaseClicked = false;

    // Setting up categories from this project
    for (var i = 0; i < $scope.thisProject.categories.length; i++) {
      if ($scope.thisProject.categories[i].toUpperCase() == "WEB") {
        //highlight web category
        $('#SUWebcategory').css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.webClicked = true;
      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "SECURITY") {
        //highlight security category
        $('#SUSecuritycategory').css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.securityClicked = true;

      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "MOBILE") {
        //highlight mobile category
        $('#SUMobilecategory').css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.mobileClicked = true;
      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "RESEARCH") {
        //highlight research category
        $('#SUResearchcategory').css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.researchClicked = true;
      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "NETWORK") {
        //highlight research category
        $('#SUNetworkcategory').css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.networkClicked = true;
      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "GAMEDEV") {
        //highlight research category
        $("[id='SUGame Devcategory']").css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.gameDevClicked = true;
      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "DATABASE") {
        //highlight research category
        $('#SUDatabasecategory').css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.databaseClicked = true;
      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "GRAPHICS") {
        //highlight research category
        $('#SUGraphicscategory').css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.graphicsClicked = true;
      }
      else if ($scope.thisProject.categories[i].toUpperCase() == "BIGDATA") {
        //highlight research category
        $("[id='SUBig Datacategory']").css({
          "background-color": "gray",
          "color": "white"
        });
        $scope.bigDataClicked = true;
      }
    }

    // Accepting a user to a project
    $scope.acceptUser = function(user) {
      var index = user.pendingProjects.indexOf($scope.projectId);
      if (index != -1) {
        user.pendingProjects.splice(index, 1);
        user.joinedProjects.push($scope.projectId);
      }

      Data.editUser(user._id, user).success(function(data) {
        console.log(data);
        var index = $scope.pendingMembers.indexOf(user);
        if (index != -1) { 
          $scope.pendingMembers.splice(index, 1);
          var index1 = $scope.thisProject.pendingMembers.indexOf(user._id);
          $scope.thisProject.pendingMembers.splice(index1, 1); 
        }
        $scope.approvedMembers.push(user);
        $scope.thisProject.approvedMembers.push(user._id);
        Data.editProject($scope.projectId, $scope.thisProject).success(function(data) {
          console.log(data);
        })
      });
    }

    // Removing a user from a project
    $scope.declineUser = function(user) {
      var index1 = user.pendingProjects.indexOf($scope.projectId);
      var index2 = user.joinedProjects.indexOf($scope.projectId);

      if (index1 != -1) {
        user.pendingProjects.splice(index1, 1);
      }
      else if (index2 != -1) {
        user.joinedProjects.splice(index2, 1);
      }

      Data.editUser(user._id, user).success(function(data) {
        console.log(data);
        var index3 = $scope.pendingMembers.indexOf(user);
        var index4 = $scope.approvedMembers.indexOf(user);
        if (index3 != -1) {
          $scope.pendingMembers.splice(index3, 1);
          var index5 = $scope.thisProject.pendingMembers.indexOf(user._id);
          $scope.thisProject.pendingMembers.splice(index5, 1);
          Data.editProject($scope.projectId, $scope.thisProject).success(function(data) {
            console.log(data);
          });
        }
        else if (index4 != -1) {
          $scope.approvedMembers.splice(index4, 1);
          var index6 = $scope.thisProject.approvedMembers.indexOf(user._id);
          $scope.thisProject.approvedMembers.splice(index6, 1);
          Data.editProject($scope.projectId, $scope.thisProject).success(function(data){
            console.log(data);
          });
        }      
      });
    }

    // Adding a skill (in the database) to the project
    $scope.addSkill = function(skill) {
      var index = $scope.skills.indexOf(skill);
      $scope.skills.splice(index, 1);
      $scope.thisProject.skills.push(skill._id);
      $scope.lookingFor.push(skill);
    }

    // Removing a skill (in the database) from the project
    $scope.removeSkill = function(skill) {
      var index = $scope.thisProject.skills.indexOf(skill._id);
      var index1 = $scope.lookingFor.indexOf(skill);
      $scope.lookingFor.splice(index1, 1);
      $scope.thisProject.skills.splice(index, 1);
      var index2 = $scope.skills.map(function(x) {return x._id;  }).indexOf(skill._id);
      if (index2 == -1) {
         $scope.skills.push(skill);
      }
    }

    // Adding a NEW skill (not in the database) to the project, and the database
    $scope.addNewSkill = function(skill) {
      skill.name = skill.name.toUpperCase().trim();
      var index = $scope.skills.map(function(x) {return x.name; }).indexOf(skill.name);
      if (index == -1) {
        Data.createSkill(skill).success(function(data) {
          console.log(data);
          $scope.lookingFor.push(data.data);
		  $scope.currentProject.skills.push(data.data);
        });
      }
    }

    // Setting up skills from the project (lookingFor is array of skills for the project)
    $scope.lookingFor = [];
    for (var i = 0; i < $scope.thisProject.skills.length; i++) {
      Data.getSkill($scope.thisProject.skills[i]).success(function(data) {
        console.log(data);
        $scope.lookingFor.push(data.data);
      });
    }
    
    $scope.tags = $scope.thisProject.tags.join();

    // Setting up approved members and pending members from the project
    $scope.approvedMembers = [];
    $scope.pendingMembers = [];
    for (var i = 0; i < $scope.thisProject.approvedMembers.length; i++) {
      Data.getUser($scope.thisProject.approvedMembers[i]).success(function(data) {
        $scope.approvedMembers.push(data.data);
      });
    }
    for (var j = 0; j < $scope.thisProject.pendingMembers.length; j++) {
      Data.getUser($scope.thisProject.pendingMembers[j]).success(function(data) {
        $scope.pendingMembers.push(data.data);
      });
    }

    // Adding/Removing category 
    $scope.addCategory = function(category) {
      if (category == "Web") {
        if (!$scope.webClicked) {
          $('#SUWebcategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.webClicked = true;
          $scope.thisProject.categories.push("Web");
        }
        else {
          $('#SUWebcategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.webClicked = false;
          var index = $scope.thisProject.categories.indexOf("Web");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Security") {
        if (!$scope.securityClicked) {
          $('#SUSecuritycategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.securityClicked = true;
          $scope.thisProject.categories.push("Security");
        }
        else {
          $('#SUSecuritycategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.securityClicked = false;
          var index = $scope.thisProject.categories.indexOf("Security");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Mobile") {
        if (!$scope.mobileClicked) {
          $('#SUMobilecategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.mobileClicked = true;
          $scope.thisProject.categories.push("Mobile");
        }
        else {
          $('#SUMobilecategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.mobileClicked = false;
          var index = $scope.thisProject.categories.indexOf("Mobile");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Research") {
        if (!$scope.researchClicked) {
          $('#SUResearchcategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.researchClicked = true;
          $scope.thisProject.categories.push("Research");
        }
        else {
          $('#SUResearchcategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.researchClicked = false;
          var index = $scope.thisProject.categories.indexOf("Research");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Network") {
        if (!$scope.networkClicked) {
          $('#SUNetworkcategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.networkClicked = true;
          $scope.thisProject.categories.push("Network");
        }
        else {
          $('#SUNetworkcategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.networkClicked = false;
          var index = $scope.thisProject.categories.indexOf("Network");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Graphics") {
        if (!$scope.graphicsClicked) {
          $('#SUGraphicscategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.graphicsClicked = true;
          $scope.thisProject.categories.push("Graphics");
        }
        else {
          $('#SUGraphicscategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.graphicsClicked = false;
          var index = $scope.thisProject.categories.indexOf("Graphics");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Game Dev") {
        if (!$scope.gameDevClicked) {
          $("[id='SUGame Devcategory']").css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.gameDevClicked = true;
          $scope.thisProject.categories.push("GameDev");
        }
        else {
          $("[id='SUGame Devcategory']").css({
            "background-color": "white",
            "color": "black"
          });
          $scope.gameDevClicked = false;
          var index = $scope.thisProject.categories.indexOf("GameDev");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Big Data") {
        if (!$scope.bigDataClicked) {
          $("[id='SUBig Datacategory']").css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.bigDataClicked = true;
          $scope.thisProject.categories.push("BigData");
        }
        else {
          $("[id='SUBig Datacategory']").css({
            "background-color": "white",
            "color": "black"
          });
          $scope.bigDataClicked = false;
          var index = $scope.thisProject.categories.indexOf("BigData");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      if (category == "Database") {
        if (!$scope.databaseClicked) {
          $('#SUDatabasecategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.databaseClicked = true;
          $scope.thisProject.categories.push("Database");
        }
        else {
          $('#SUDatabasecategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.databaseClicked = false;
          var index = $scope.thisProject.categories.indexOf("Database");
          $scope.thisProject.categories.splice(index, 1);
        }
      }
      //console.log($scope.currentProject.categories);
    }

    // Submitting edited project
    $scope.submitProject = function() {
      if ($scope.tags != "") {
        var tags = $scope.tags.split(",");
      }
      $scope.thisProject.tags = tags;
      Data.editProject($scope.projectId, $scope.thisProject).success(function(data) {
        console.log(data);
        $scope.hideSubmitModal();
        $window.location.href = '#/MyProfilePage';
      }).error(function(data) {
        console.log(data);
        $scope.hideSubmitModal();
        $('#SUsubmitModalError').show();
      });
    }

    // Deleting project, AND deleting project from pendingMembers and assignedMembers
    $scope.deleteProject = function() {
      Data.getUser($scope.thisProject.creator).success(function(data) {
        $scope.currentUser = data.data;
        var index = $scope.currentUser.myProjects.indexOf($scope.projectId);
        $scope.currentUser.myProjects.splice(index, 1);
        console.log($scope.currentUser);
        Data.editUser($scope.currentUser._id, $scope.currentUser).success(function(data) {
          console.log(data);
          for (var i = 0; i < $scope.thisProject.approvedMembers.length; i++) {
            Data.getUser($scope.thisProject.approvedMembers[i]).success(function(data) {
              var index = data.data.joinedProjects.indexOf($scope.thisProject._id);
              data.data.joinedProjects.splice(index, 1);
              Data.editUser($scope.thisProject.approvedMembers[i]._id, $scope.thisProject.approvedMembers[i]);
            });
          }
          for (var i = 0; i < $scope.thisProject.pendingMembers.length; i++) {
            Data.getUser($scope.thisProject.pendingMembers[i]).success(function(data) {
              var index = data.data.pendingProjects.indexOf($scope.thisProject._id);
              data.data.pendingProjects.splice(index, 1);
              Data.editUser($scope.thisProject.pendingMembers[i]._id, $scope.thisProject.pendingMembers[i]);
            });
          }
          Data.deleteProject($scope.projectId).success(function(data) {
            console.log(data);
            $scope.hideDeleteModal();
            $window.location.href = '#/MyProfilePage';
          }).error(function(data) {
            $scope.hideDeleteModal();
            $('#SUdeleteModalError').show();
          });
        });
      });
    }

  });
}]);

BulletinControllers.controller('CreateProjectController', ['$scope', '$http', '$window', '$routeParams', 'Data', function($scope, $http, $window, $routeParams, Data) {

  // Setting up search bar for skills
  $('#SUskillsInput').focusin(function() {
    $('.SUskillsresults').show();
  });
  $('.SUskillsresults').click(function() {
      $('.SUskillsresults').hide();
  });
  $('body').click(function(evt) {
    if (evt.target.id != 'SUskillsInput') {
      $('.SUskillsresults').hide();
    }
  });

  // Setting up modal functionality
  $('#SUcloseSubmitModalError').click(function(){
    $('#SUsubmitModalError').hide();
  });

  $scope.openSubmitModal = function() {
    $('#SUsubmitmodal').show();
  }

  $scope.hideSubmitModal = function() {
    $('#SUsubmitmodal').hide();
  }  

  Data.getSkills().success(function(data) {
    $scope.skills = data.data;
  });

  Data.getCategories().success(function(data) {
    $scope.categories = data.data;
    console.log($scope.categories);
  });

  $scope.currentProject = {};
  $scope.currentProject.skills = [];
  $scope.currentProject.visible = true;

  // Adding skill (not in database)
  $scope.lookingFor = [];
  $scope.addSkill = function(skill) {
    var index = $scope.skills.indexOf(skill);
    $scope.skills.splice(index, 1);
    $scope.currentProject.skills.push(skill._id);
    $scope.lookingFor.push(skill);
  }

  // Removing skill (not in database)
  $scope.removeSkill = function(skill) {
    var index = $scope.currentProject.skills.indexOf(skill._id);
    var index1 = $scope.lookingFor.indexOf(skill);
    $scope.lookingFor.splice(index1, 1);
    $scope.currentProject.skills.splice(index, 1);
    var index2 = $scope.skills.indexOf(skill);
    if (index2 == -1) {
      $scope.skills.push(skill);
    }
  }

  // Adding a NEW skill (not in the database) to the project, and the database
  $scope.addNewSkill = function(skill) {
    skill.name = skill.name.toUpperCase().trim();
    var index = $scope.skills.map(function(x) {return x.name; }).indexOf(skill.name);
    if (index == -1) {
      Data.createSkill(skill).success(function(data) {
        console.log(data);
        $scope.lookingFor.push(data.data);
		$scope.currentProject.skills.push(data.data);
      });
    }
  }

  $scope.webClicked = false;
  $scope.securityClicked = false;
  $scope.mobileClicked = false;
  $scope.researchClicked = false;
  $scope.graphicsClicked = false;
  $scope.networkClicked = false;
  $scope.gameDevClicked = false;
  $scope.bigDataClicked = false;
  $scope.databaseClicked = false;
  $scope.currentProject.categories = [];
  // Adding/removing category
  $scope.addCategory = function(category) {
      if (category == "Web") {
        if (!$scope.webClicked) {
          $('#SUWebcategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.webClicked = true;
          $scope.currentProject.categories.push("Web");
        }
        else {
          $('#SUWebcategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.webClicked = false;
          var index = $scope.currentProject.categories.indexOf("Web");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Security") {
        if (!$scope.securityClicked) {
          $('#SUSecuritycategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.securityClicked = true;
          $scope.currentProject.categories.push("Security");
        }
        else {
          $('#SUSecuritycategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.securityClicked = false;
          var index = $scope.currentProject.categories.indexOf("Security");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Mobile") {
        if (!$scope.mobileClicked) {
          $('#SUMobilecategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.mobileClicked = true;
          $scope.currentProject.categories.push("Mobile");
        }
        else {
          $('#SUMobilecategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.mobileClicked = false;
          var index = $scope.currentProject.categories.indexOf("Mobile");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Research") {
        if (!$scope.researchClicked) {
          $('#SUResearchcategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.researchClicked = true;
          $scope.currentProject.categories.push("Research");
        }
        else {
          $('#SUResearchcategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.researchClicked = false;
          var index = $scope.currentProject.categories.indexOf("Research");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Network") {
        if (!$scope.networkClicked) {
          $('#SUNetworkcategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.networkClicked = true;
          $scope.currentProject.categories.push("Network");
        }
        else {
          $('#SUNetworkcategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.networkClicked = false;
          var index = $scope.currentProject.categories.indexOf("Network");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Graphics") {
        if (!$scope.graphicsClicked) {
          $('#SUGraphicscategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.graphicsClicked = true;
          $scope.currentProject.categories.push("Graphics");
        }
        else {
          $('#SUGraphicscategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.graphicsClicked = false;
          var index = $scope.currentProject.categories.indexOf("Graphics");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Game Dev") {
        if (!$scope.gameDevClicked) {
          $("[id='SUGame Devcategory']").css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.gameDevClicked = true;
          $scope.currentProject.categories.push("GameDev");
        }
        else {
          $("[id='SUGame Devcategory']").css({
            "background-color": "white",
            "color": "black"
          });
          $scope.gameDevClicked = false;
          var index = $scope.currentProject.categories.indexOf("GameDev");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Big Data") {
        if (!$scope.bigDataClicked) {
          $("[id='SUBig Datacategory']").css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.bigDataClicked = true;
          $scope.currentProject.categories.push("BigData");
        }
        else {
          $("[id='SUBig Datacategory']").css({
            "background-color": "white",
            "color": "black"
          });
          $scope.bigDataClicked = false;
          var index = $scope.currentProject.categories.indexOf("BigData");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      if (category == "Database") {
        if (!$scope.databaseClicked) {
          $('#SUDatabasecategory').css({
            "background-color": "gray",
            "color": "white"
          });
          $scope.databaseClicked = true;
          $scope.currentProject.categories.push("Database");
        }
        else {
          $('#SUDatabasecategory').css({
            "background-color": "white",
            "color": "black"
          });
          $scope.databaseClicked = false;
          var index = $scope.currentProject.categories.indexOf("Database");
          $scope.currentProject.categories.splice(index, 1);
        }
      }
      //console.log($scope.currentProject.categories);
    }

  // Submitting project, adding project id to myProjects array
  $scope.submitProject = function() {
    if ($scope.tags != undefined) {
      var tags = $scope.tags.split(",");
    }
    Data.getProfile().success(function(data) {
      $scope.currentUser = data.data;
      $scope.userid = data.data._id;
      $scope.currentProject.creator = $scope.userid;
      $scope.currentProject.tags = tags;
      $scope.currentProject.creatorName = $scope.currentUser.name;
      console.log($scope.currentProject.creator);
      Data.createProject($scope.currentProject).success(function(data) {
        $scope.projectId = data.data._id;
        //Add project to user's myProjects field
        //console.log($scope.currentUser);
        $scope.currentUser.myProjects.push($scope.projectId);
        Data.editUser($scope.userid, $scope.currentUser).success(function(data) {
          console.log(data);
          $scope.hideSubmitModal();
          $window.location.href = '#/MyProfilePage';
        });
      }).error(function(data) {
        console.log(data);
        $scope.hideSubmitModal();
        $('#SUsubmitModalError').show();
      });
      
    });
  }




  

}]);
