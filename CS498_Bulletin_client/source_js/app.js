var app = angular.module('Bulletin', ['ngRoute', 'BulletinControllers', 'BulletinServices']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/HomePage', {
    templateUrl: 'partials/HomePage.html',
    controller: 'HomeController'
  }).
  when('/Search', {
    templateUrl: 'partials/SearchPage.html',
    controller: 'SearchController'
  }).
  when('/AccountSettings', {
    templateUrl: 'partials/AccountSettings.html',
    controller: 'AccountSettingsController'
  }).
  when('/MyProfilePage', {
    templateUrl: 'partials/MyProfilePage.html',
    controller: 'MyProfileController'
  }).
  when('/ProfilePage/:userid', {
    templateUrl: 'partials/ProfilePage.html',
    controller: 'ProfileController'
  }).
  when('/SignUp', {
    templateUrl: 'partials/SignUp.html',
    controller: 'SignUpController'
  }).
  when('/EditProject/:projectid', {
    templateUrl: 'partials/EditProject.html',
    controller: 'EditProjectController'
  }).
  when('/CreateProject', {
    templateUrl: 'partials/CreateProject.html',
    controller: 'CreateProjectController'
  }).
  otherwise({
    redirectTo: '/HomePage'
  });
}]);

app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        // return [];
    }
});