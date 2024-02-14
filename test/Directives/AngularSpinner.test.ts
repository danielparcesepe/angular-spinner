import * as angular from 'angular';
import { IUsSpinnerConfig } from '../../src/Interfaces/IUsSpinnerConfig';
import { IUsSpinnerService } from '../../src/Interfaces/IUsSpinnerService';

beforeEach(angular.mock.module('angularSpinner'));

describe('Directive: us-spinner', function () {
	var Spinner;

	beforeEach(angular.mock.module(function ($provide:ng.auto.IProvideService) {
		Spinner = jasmine.createSpy('Spinner');
		Spinner.prototype.spin = jasmine.createSpy('Spinner.spin');
		Spinner.prototype.stop = jasmine.createSpy('Spinner.stop');

		$provide.constant('SpinJSSpinner', Spinner);
	}));

	it('should create a spinner object', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			var element = angular.element('<div us-spinner></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner).toHaveBeenCalled();
		}));

	it('should start spinning the spinner automatically', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			var element = angular.element('<div us-spinner></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner.prototype.spin).toHaveBeenCalled();
			expect(Spinner.prototype.stop).not.toHaveBeenCalled();
		}));

	it('should start spinning the second spinner without stopping the first one', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			var element = angular.element('<div us-spinner></div>');
			element = $compile(element)($rootScope);
			var secondElement = angular.element('<div us-spinner></div>');
			secondElement = $compile(secondElement)($rootScope);
			$rootScope.$digest();
			expect(Spinner.prototype.spin.calls.count()).toBe(2);
			expect(Spinner.prototype.stop).not.toHaveBeenCalled();
		}));

	it('should set spinner options as given in attribute', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			var element = angular.element('<div us-spinner="{width:15}"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner).toHaveBeenCalledWith({width: 15});
		}));

	describe('with default options', function() {
		beforeEach(angular.mock.module(function(usSpinnerConfigProvider:IUsSpinnerConfig) {
			usSpinnerConfigProvider.setDefaults({width: 10, color: 'black'});
		}));

		it('should add spinner default options to options', 
			inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
				var element = angular.element('<div us-spinner="{width:15}"></div>');
				element = $compile(element)($rootScope);
				$rootScope.$digest();
				expect(Spinner).toHaveBeenCalledWith({width: 15, color: 'black'});
			}));

		describe('and with theme options', function() {
			beforeEach(angular.mock.module(function(usSpinnerConfigProvider:IUsSpinnerConfig) {
				usSpinnerConfigProvider.setTheme('bigRed', {speed: 20, color: 'red'});
			}));

			it('should add theme options to options', 
				inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
					var element = angular.element('<div us-spinner="{width:15}" spinner-theme="bigRed"></div>');
					element = $compile(element)($rootScope);
					$rootScope.$digest();
					expect(Spinner).toHaveBeenCalledWith({width: 15, color: 'red', speed: 20});
				}));

			it('should not change default options by spinner options or theme options', 
				inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService, usSpinnerConfig:IUsSpinnerConfig) {
					var element = angular.element('<div us-spinner="{width:15}" spinner-theme="bigRed"></div>');
					element = $compile(element)($rootScope);
					$rootScope.$digest();
					expect(usSpinnerConfig.config).toEqual({width: 10, color: 'black'});
				}));
		});
	});

	it('should update spinner options in response to scope updates', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			$rootScope['actualWidth'] = 25;
			var element = angular.element('<div us-spinner="{width:actualWidth}"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner).toHaveBeenCalledWith({width: 25});
			expect(Spinner.prototype.stop).not.toHaveBeenCalled();

			$rootScope['actualWidth'] = 72;
			$rootScope.$digest();
			expect(Spinner).toHaveBeenCalledWith({width: 72});
			expect(Spinner.prototype.stop).toHaveBeenCalled();
			expect(Spinner.prototype.spin.calls.count()).toBe(2);
		}));

	it('should spin in response to scope updates', 
			inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			$rootScope['shouldSpin'] = false;
			var element = angular.element('<div us-spinner spinner-on="shouldSpin"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner).toHaveBeenCalled();
			expect(Spinner.prototype.spin).not.toHaveBeenCalled();

			$rootScope['shouldSpin'] = true;
			$rootScope.$digest();
			expect(Spinner.prototype.spin).toHaveBeenCalled();
	}));

	it('should stop the spinner when the scope is destroyed', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			var scope = $rootScope.$new();
			var element = angular.element('<div us-spinner></div>');
			element = $compile(element)(scope);
			$rootScope.$digest();
			expect(Spinner.prototype.stop).not.toHaveBeenCalled();
			scope.$destroy();
			expect(Spinner.prototype.stop).toHaveBeenCalled();
		}));

	it('should not start spinning automatically', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			var element = angular.element('<div us-spinner spinner-key="spinner"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner.prototype.spin).not.toHaveBeenCalled();
		}));

	it('should start spinning when service trigger the spin event', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService, usSpinnerService:IUsSpinnerService) {
			var element = angular.element('<div us-spinner spinner-key="spinner"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner.prototype.spin).not.toHaveBeenCalled();
			usSpinnerService.spin('spinner');
			expect(Spinner.prototype.spin).toHaveBeenCalled();
		}));

	it('should start spinning the spinner automatically and stop when service trigger the stop event', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService, usSpinnerService:IUsSpinnerService) {
			var element = angular.element('<div us-spinner spinner-key="spinner" spinner-start-active="1"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner.prototype.spin).toHaveBeenCalled();
			usSpinnerService.stop('spinner');
			expect(Spinner.prototype.stop).toHaveBeenCalled();
		}));

	it('should not start spinning the spinner automatically from binding', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			$rootScope['spinnerActive'] = false;
			var element = angular.element('<div us-spinner spinner-key="spinner" spinner-start-active="spinnerActive"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner.prototype.spin).not.toHaveBeenCalled();
		}));

	it('should start spinning the spinner automatically from binding', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService) {
			$rootScope['spinnerActive'] = true;
			var element = angular.element('<div us-spinner spinner-key="spinner" spinner-start-active="spinnerActive"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(Spinner.prototype.spin).toHaveBeenCalled();
		}));

	it('should start spinning the second spinner without starting the first one', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService, usSpinnerService:IUsSpinnerService) {
			var element = angular.element('<div us-spinner spinner-key="spinner"></div>');
			element = $compile(element)($rootScope);
			var secondElement = angular.element('<div us-spinner spinner-key="spinner2"></div>');
			secondElement = $compile(secondElement)($rootScope);
			$rootScope.$digest();
			usSpinnerService.spin('spinner2');
			expect(Spinner.prototype.spin.calls.count()).toBe(1);
			expect(Spinner.prototype.stop).not.toHaveBeenCalled();
		}));

	it('should start spinning the spinners with the same key', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService, usSpinnerService:IUsSpinnerService) {
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner2"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner2"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$rootScope.$digest();
			usSpinnerService.spin('spinner');
			expect(Spinner.prototype.spin.calls.count()).toBe(3);
			expect(Spinner.prototype.stop).not.toHaveBeenCalled();
			usSpinnerService.stop('spinner');
			expect(Spinner.prototype.stop.calls.count()).toBe(3);
			usSpinnerService.spin('spinner2');
			expect(Spinner.prototype.spin.calls.count()).toBe(5);
			usSpinnerService.stop('spinner2');
			expect(Spinner.prototype.stop.calls.count()).toBe(5);
		}));

	//Feature: Stop all/Start all spinners - Issue #28
	it('should start spinning all the spinners when usSpinnerService.spin() is called without specific key', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService, usSpinnerService:IUsSpinnerService) {
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner2"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner2"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$rootScope.$digest();
			usSpinnerService.spin();
			expect(Spinner.prototype.spin.calls.count()).toBe(5);
			expect(Spinner.prototype.stop).not.toHaveBeenCalled();
		}));

	//Feature: Stop all/Start all spinners - Issue #28
	it('should stop spinning all the spinners when usSpinnerService.stop() is called without specific key', 
		inject(function ($rootScope:ng.IRootScopeService, $compile:ng.ICompileService, usSpinnerService:IUsSpinnerService) {
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner2"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner2"></div>')($rootScope);
			$compile('<div us-spinner spinner-key="spinner"></div>')($rootScope);
			$rootScope.$digest();
			usSpinnerService.stop();
			expect(Spinner.prototype.stop.calls.count()).toBe(5);
			expect(Spinner.prototype.spin).not.toHaveBeenCalled();
		}));

});
