var BulletinServices = angular.module('BulletinServices', []);

BulletinServices.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

BulletinServices.factory('Llamas', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/llamas');
        }
    }
});

BulletinServices.factory('Data', function($http, $window) {
    return {
        getUsers : function(params) {
            return $http.get('http://162.243.18.198:4000/api/users', {params: params});
        },
		getProjects : function(params) {
            return $http.get('http://162.243.18.198:4000/api/projects', {params: params});
        },
		getSkills : function(params) {
            return $http.get('http://162.243.18.198:4000/api/skills', {params: params});
        },
		getCategories : function(params) {
            return $http.get('http://162.243.18.198:4000/api/categories', {params: params});
        },
        login : function() {
        	return $http.post('http://162.243.18.198:4000/api/login');
        },
        getProfile: function() {
        	return $http.get('http://162.243.18.198:4000/api/MyProfilePage');
        },
		createUser : function(user) {
			return $http.post('http://162.243.18.198:4000/api/users', user);
		},
		createProject : function(project) {
			return $http.post('http://162.243.18.198:4000/api/projects', project);
		},
		createSkill : function(skill) {
			return $http.post('http://162.243.18.198:4000/api/skills', skill);
		},
		createCategory : function(category) {
			return $http.post('http://162.243.18.198:4000/api/categories', category);
		},
		getUser : function(id) {
			return $http.get('http://162.243.18.198:4000/api/users/' + id);
		},
		getProject : function(id) {
			return $http.get('http://162.243.18.198:4000/api/projects/' + id);
		},
		getSkill : function(id) {
			return $http.get('http://162.243.18.198:4000/api/skills/' + id);
		},
		getCategory : function(id) {
			return $http.get('http://162.243.18.198:4000/api/categories/' + id);
		},
		editUser : function(id, user) {
			return $http.put('http://162.243.18.198:4000/api/users/' + id, user);
		},
		editProject : function(id, project) {
			return $http.put('http://162.243.18.198:4000/api/projects/' + id, project);
		},
		deleteUser : function(id) {
			return $http.delete('http://162.243.18.198:4000/api/users/' + id);
		},
		deleteProject : function(id) {
			return $http.delete('http://162.243.18.198:4000/api/projects/' + id);
		},
		deleteSkill : function(id) {
			return $http.delete('http://162.243.18.198:4000/api/skills/' + id);
		},
		deleteCategory : function(id) {
			return $http.delete('http://162.243.18.198:4000/api/categories/' + id);
		}
    }
});
