System.register("app/app/service/service.ts", [], function(exports_1) {
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("app/impl.web/context.ts", ["angular2/core", "angular2-reflow", "../app/service/service"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var core_1,
      reflow,
      service;
  var Service,
      Command1,
      Command2,
      Command3,
      ContextFactory;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(reflow_1) {
      reflow = reflow_1;
    }, function(service_1) {
      service = service_1;
    }],
    execute: function() {
      Service = (function() {
        function Service() {}
        Service.prototype.hello = function() {
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              return resolve('web service');
            }, 1000);
          });
        };
        return Service;
      })();
      Command1 = (function() {
        function Command1(service) {
          this.service = service;
        }
        Command1.prototype.execute = function(chain) {
          var _this = this;
          setTimeout(function() {
            console.log('web command1 executed', _this.service);
            chain.next();
          }, 1000);
        };
        Command1.prototype.stop = function() {};
        Command1 = __decorate([__param(0, core_1.Inject('service')), __metadata('design:paramtypes', [Object])], Command1);
        return Command1;
      })();
      Command2 = (function() {
        function Command2(service) {
          this.service = service;
        }
        Command2.prototype.execute = function(chain) {
          var _this = this;
          setTimeout(function() {
            console.log('web command2 executed', _this.service);
            chain.next();
          }, 1000);
        };
        Command2.prototype.stop = function() {};
        Command2 = __decorate([__param(0, core_1.Inject('service')), __metadata('design:paramtypes', [Object])], Command2);
        return Command2;
      })();
      Command3 = (function() {
        function Command3(service) {
          this.service = service;
        }
        Command3.prototype.execute = function(chain) {
          var _this = this;
          setTimeout(function() {
            console.log('web command3 executed', _this.service);
            chain.next();
          }, 1000);
        };
        Command3.prototype.stop = function() {};
        Command3 = __decorate([__param(0, core_1.Inject('service')), __metadata('design:paramtypes', [Object])], Command3);
        return Command3;
      })();
      ContextFactory = (function(_super) {
        __extends(ContextFactory, _super);
        function ContextFactory() {
          _super.apply(this, arguments);
        }
        ContextFactory.prototype.mapDependency = function() {
          this.provide(new core_1.Provider('service', {useClass: Service}));
          this.mapCommand('execute-commands', [Command1, Command2, Command3]);
        };
        return ContextFactory;
      })(reflow.ContextFactory);
      exports_1("ContextFactory", ContextFactory);
    }
  };
});

System.register("app/app/index/index.ts", ["angular2/core", "angular2-reflow"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var core_1,
      angular2_reflow_1;
  var Index;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(angular2_reflow_1_1) {
      angular2_reflow_1 = angular2_reflow_1_1;
    }],
    execute: function() {
      Index = (function() {
        function Index(service, eventBus) {
          this.service = service;
          this.eventBus = eventBus;
          this.message = 'Test';
        }
        Index.prototype.ngOnInit = function() {
          var _this = this;
          this.service.hello().then(function(result) {
            _this.message = result;
            _this.eventBus.fire(new Event('eventBusTest'));
            _this.eventBus.fire(new Event('execute-commands'));
          });
        };
        Index = __decorate([core_1.Component({
          selector: 'content-index',
          template: "<h1>hello {{message}}</h1>"
        }), __param(0, core_1.Inject('service')), __param(1, core_1.Inject(angular2_reflow_1.EVENT_BUS)), __metadata('design:paramtypes', [Object, (typeof(_a = typeof angular2_reflow_1.EventBus !== 'undefined' && angular2_reflow_1.EventBus) === 'function' && _a) || Object])], Index);
        return Index;
        var _a;
      })();
      exports_1("Index", Index);
    }
  };
});

System.register("app/app/sample/sample.ts", ["angular2/core"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var core_1;
  var Sample;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }],
    execute: function() {
      Sample = (function() {
        function Sample() {}
        Sample = __decorate([core_1.Component({
          selector: 'content-sample',
          template: "<h1>sample page</h1>"
        }), __metadata('design:paramtypes', [])], Sample);
        return Sample;
      })();
      exports_1("Sample", Sample);
    }
  };
});

System.register("app/app/main/main.css!github:systemjs/plugin-css@0.1.20", [], function() { return { setters: [], execute: function() {} } });

System.register("app/app/main/main.ts", ["angular2/core", "angular2/router", "angular2-reflow", "impl:context", "../index/index", "../sample/sample", "./main.css!"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var core_1,
      router_1,
      rf,
      impl_context_1,
      index_1,
      sample_1;
  var context,
      routeConfig,
      Main;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(router_1_1) {
      router_1 = router_1_1;
    }, function(rf_1) {
      rf = rf_1;
    }, function(impl_context_1_1) {
      impl_context_1 = impl_context_1_1;
    }, function(index_1_1) {
      index_1 = index_1_1;
    }, function(sample_1_1) {
      sample_1 = sample_1_1;
    }, function(_1) {}],
    execute: function() {
      context = new impl_context_1.ContextFactory;
      routeConfig = [{
        path: '/',
        name: 'Index',
        component: index_1.Index
      }, {
        path: '/sample',
        name: 'Sample',
        component: sample_1.Sample
      }];
      Main = (function() {
        function Main(location, context, eventBus) {
          this.location = location;
          this.context = context;
          this.eventBus = eventBus;
          this.routeConfig = routeConfig;
          eventBus.on('eventBusTest', this.eventHandler);
        }
        Main.prototype.ngOnInit = function() {
          this.context.start();
        };
        Main.prototype.ngOnDestroy = function() {
          this.context.destroy();
        };
        Main.prototype.eventHandler = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
          }
          console.log('eventHandler...', args);
        };
        Main.prototype.isActive = function(path) {
          if (this.location.path() === '' && path === '/')
            return true;
          return this.location.path() === path;
        };
        Main = __decorate([core_1.Component({
          selector: 'app-main',
          providers: [context.providers, router_1.ROUTER_PROVIDERS, core_1.provide(router_1.LocationStrategy, {useClass: router_1.HashLocationStrategy})],
          templateUrl: 'app/app/main/main.html',
          directives: [router_1.ROUTER_DIRECTIVES]
        }), router_1.RouteConfig(routeConfig), __param(0, core_1.Inject(router_1.Location)), __param(1, core_1.Inject(rf.CONTEXT)), __param(2, core_1.Inject(rf.EVENT_BUS)), __metadata('design:paramtypes', [(typeof(_a = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _a) || Object, Object, Object])], Main);
        return Main;
        var _a;
      })();
      exports_1("Main", Main);
    }
  };
});

System.register("app/app/boot.ts", ["angular2/platform/browser", "./main/main"], function(exports_1) {
  var browser_1,
      main_1;
  return {
    setters: [function(browser_1_1) {
      browser_1 = browser_1_1;
    }, function(main_1_1) {
      main_1 = main_1_1;
    }],
    execute: function() {
      browser_1.bootstrap(main_1.Main);
    }
  };
});

System.register('app/app/main/main.css!github:systemjs/plugin-css@0.1.20', [], false, function() {});