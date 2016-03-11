/*
***************** gloomy framework *********************
***************** copyright 2016 MIT ********************
***************** Developer Linuxb **********************

 render module and react statemachine components

*/

/* component module*/

define(['diff','jquery'],function(diff,$) {


	//async eval queue module
	var _asyncTaskQueue = [];
	//var _watchers = [];
	//test value
	var stateVal;

	var gyScope = function(id) {
		this._watchers = [];
		this.id = id || 0;
	};

	gyScope.prototype.watch = function(expr,handler) {
		this._watchers.push({
			expr : expr,
			handler : handler
		});
	};

	gyScope.prototype.apply = function() {
		//TODO
	};

	gyScope.prototype.digest = function() {
		//dirty check
		do {
			var dirty = false;
			for (var i = 0; i < this._watchers.length; i++) {
				var oldValue = this._watchers[i].last;
				var newValue = this._watchers[i].expr();
				if (oldValue !== newValue) {
					this._watchers[i].handler(oldValue,newValue);
					dirty = true;
					this._watchers[i].last = newValue;
				}
			}
		} while (dirty);
	};

	gyScope.prototype.render = function() {
		this.element.html(this.gyState.val);
	};

	gyScope.prototype.setState = function(newState) {
		this.gyState = newState;
		this.render();
	};

	var test = function() {
		//print out test
		var $explode = new gyScope();
		$explode.element = $('#explode');
		//init state
		$explode.gyState = {
			val : null
		}




		var $scope = new gyScope();
		$scope.gyState = {
			val : null
		};
		//var elements = document.querySelectorAll('input');
		var element = $('input');
		$scope.element = element;
		$scope.expr = '';

		//test
		$scope.element.keyup(function() {
			$scope.expr = $scope.element.val();
			$scope.digest();
		});

		//register watchers
		$scope.watch(function() {
			return $scope.expr;
		}, function(oldValue,newValue) {
			//console.log(newValue);
			$scope.gyState.val = newValue;
			stateVal = $scope.gyState.val;
			$explode.setState({
				val : stateVal
			});
		});
	}

	var exports = {

		//parser module
		gyCreateComponent : function(name,callback) {
			//TODO
		},

		test : test
	};

	return exports;
});
