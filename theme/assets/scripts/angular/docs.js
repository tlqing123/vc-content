var storefrontApp = angular.module('storefrontApp', ['hljs', 'angularMoment']);

storefrontApp.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        rewriteLinks: false
    });
}]);

storefrontApp.controller('docsController', ['$scope', '$http', '$location', '$compile', '$window', 'moment', function ($scope, $http, $location, $compile, $window, moment) {
    $scope.loading = false;
	$scope.moment = moment;
    $scope.navigateUrl = function (url, event) {
        event.preventDefault();
        event.stopPropagation();
        angular.element($window).scrollTop(0);
        $scope.loading = true;
        $location.path(url);
        $http.get(url, { cache: true }).then(function (response) {
            var parser = new DOMParser();
            var newDoc = parser.parseFromString(response.data, 'text/html');
            var codeBlocks = newDoc.getElementsByTagName('code');
            _.each(codeBlocks, function (codeBlock) {
                hljs.highlightBlock(codeBlock);
            });
            var content = $compile(newDoc.getElementById('page-content').childNodes)($scope);
            angular.element(window.document.getElementById('page-content')).html(content);
            var menu = $compile(newDoc.getElementById('menu'))($scope);
            angular.element(window.document.getElementById('menu')).html(menu);
            var bodyElement = window.document.getElementsByTagName('body')[0];
            angular.element(bodyElement).removeClass('__opened');
            var menuMobile = $compile(newDoc.getElementById('menu-mobile').childNodes)($scope);
            angular.element(window.document.getElementById('menu-mobile')).html(menuMobile);
            var breadcrumbs = $compile(newDoc.getElementById('breadcrumbs').childNodes)($scope);
            angular.element(window.document.getElementById('breadcrumbs')).html(breadcrumbs);
            var topics = $compile(newDoc.getElementById('topics'))($scope);
            angular.element(window.document.getElementById('topics')).html(topics);
            window.document.getElementsByTagName('title')[0].innerText = newDoc.getElementsByTagName('title')[0].innerText;
            $scope.loading = false;
            $scope.disqus = DISQUS;
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = $window.absoluteUrl;
                    this.page.url = $window.absoluteUrl;
                }
            });
        });
    }
	
	$scope.timeSpan = function(input) {
		var m = moment(input);
		var valid = m.isValid();
		
		if (valid)
			return m.fromNow();
		else
			return input;
	}
}])