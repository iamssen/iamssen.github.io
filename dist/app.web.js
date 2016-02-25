System.register("app/consts.ts", [], function(exports_1) {
  var GITHUB_USER_ID,
      JSFIDDLE_USER_ID;
  return {
    setters: [],
    execute: function() {
      exports_1("GITHUB_USER_ID", GITHUB_USER_ID = 'iamssen');
      exports_1("JSFIDDLE_USER_ID", JSFIDDLE_USER_ID = 'iamssen');
    }
  };
});

System.register("app/services/services.web.ts", ["angular2/core", "rxjs", "angular2/router", "../consts", "../services"], function(exports_1) {
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
  var ng,
      rx,
      router_1,
      consts_1;
  var GithubService,
      JsFiddleService,
      AnalyticsService;
  function http(req) {
    return rx.Observable.fromPromise($.getJSON(req));
  }
  function jsonp(url) {
    return rx.Observable.create(function(subject) {
      $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'callback'
      }).then(function(x) {
        subject.next(x.list);
        subject.complete();
      });
    });
  }
  function githubHttp(url) {
    return http({
      url: url,
      beforeSend: function(req) {
        return req.setRequestHeader('Authorization', "token cd4981226b72e9bffd3f8796026aa6865c81cb73");
      }
    });
  }
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rx_1) {
      rx = rx_1;
    }, function(router_1_1) {
      router_1 = router_1_1;
    }, function(consts_1_1) {
      consts_1 = consts_1_1;
    }, function(services_1_1) {
      exports_1({"ActivityService": services_1_1["ActivityService"]});
    }],
    execute: function() {
      GithubService = (function() {
        function GithubService() {}
        GithubService.prototype.repositories = function() {
          return githubHttp("https://api.github.com/users/" + consts_1.GITHUB_USER_ID + "/repos");
        };
        GithubService.prototype.gists = function() {
          return githubHttp("https://api.github.com/users/" + consts_1.GITHUB_USER_ID + "/gists");
        };
        GithubService = __decorate([ng.Injectable(), __metadata('design:paramtypes', [])], GithubService);
        return GithubService;
      })();
      exports_1("GithubService", GithubService);
      JsFiddleService = (function() {
        function JsFiddleService() {}
        JsFiddleService.prototype.fiddles = function() {
          return jsonp("http://jsfiddle.net/api/user/" + consts_1.JSFIDDLE_USER_ID + "/demo/list.json");
        };
        JsFiddleService = __decorate([ng.Injectable(), __metadata('design:paramtypes', [])], JsFiddleService);
        return JsFiddleService;
      })();
      exports_1("JsFiddleService", JsFiddleService);
      AnalyticsService = (function() {
        function AnalyticsService(router) {
          this.router = router;
          router.subscribe(function(path) {
            ga('send', 'preview', "/" + path);
          });
        }
        AnalyticsService = __decorate([ng.Injectable(), __param(0, ng.Inject(router_1.Router)), __metadata('design:paramtypes', [(typeof(_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object])], AnalyticsService);
        return AnalyticsService;
        var _a;
      })();
      exports_1("AnalyticsService", AnalyticsService);
    }
  };
});

System.register("contexts:main.ts", ["angular2/core", "angular2-reflow", "../app/services", "../app/services/services.web", "../app/stores"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ng,
      rf,
      services_1,
      services_web_1,
      stores_1;
  var ContextFactory;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rf_1) {
      rf = rf_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }, function(services_web_1_1) {
      services_web_1 = services_web_1_1;
    }, function(stores_1_1) {
      stores_1 = stores_1_1;
    }],
    execute: function() {
      ContextFactory = (function(_super) {
        __extends(ContextFactory, _super);
        function ContextFactory() {
          _super.apply(this, arguments);
        }
        ContextFactory.prototype.mapDependency = function() {
          this.provide(new ng.Provider(stores_1.ACTIVITY_STORE, {useClass: stores_1.ActivityStore}));
          this.provide(new ng.Provider(services_1.GITHUB_SERVICE, {useClass: services_web_1.GithubService}));
          this.provide(new ng.Provider(services_1.JSFIDDLE_SERVICE, {useClass: services_web_1.JsFiddleService}));
          this.provide(new ng.Provider(services_1.ACTIVITY_SERVICE, {useClass: services_web_1.ActivityService}));
          this.provide(new ng.Provider(services_1.ANALYTICS_SERVICE, {useClass: services_web_1.AnalyticsService}));
        };
        return ContextFactory;
      })(rf.ContextFactory);
      exports_1("ContextFactory", ContextFactory);
    }
  };
});

System.register("app/components/github.ts", ["angular2/core", "angular2-reflow", "../events", "../services"], function(exports_1) {
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
  var ng,
      rf,
      events_1,
      services_1;
  var Github;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rf_1) {
      rf = rf_1;
    }, function(events_1_1) {
      events_1 = events_1_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }],
    execute: function() {
      Github = (function() {
        function Github(githubService, eventBus) {
          this.githubService = githubService;
          this.eventBus = eventBus;
        }
        Github.prototype.openLink = function(url) {
          this.eventBus.dispatchEvent(new events_1.ActionEvent(events_1.ActionEvent.ACTION, "Open Gist Link: " + url));
        };
        Github.prototype.ngOnInit = function() {
          var _this = this;
          var subscription1 = this.githubService.repositories().subscribe(function(x) {
            return _this.repositories = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription1 && subscription1.unsubscribe();
          });
          var subscription2 = this.githubService.gists().subscribe(function(x) {
            return _this.gists = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription2 && subscription2.unsubscribe();
          });
        };
        Github = __decorate([ng.Component({
          selector: 'content-github',
          template: "\n  <h1>Github Repositories</h1>\n  <ul>\n    <li template=\"ngFor #repository of repositories\">\n      <a href=\"{{repository.html_url}}\" target=\"_blank\">\n        {{repository.name}}\n      </a>\n    </li>\n  </ul>\n  <h1>Github Gists</h1>\n  <ul>\n    <li template=\"ngFor #gist of gists\">\n      <a (click)=\"openLink(gist.html_url)\">\n        {{gist.description}}\n      </a>\n    </li>\n  </ul>\n  "
        }), __param(0, ng.Inject(services_1.GITHUB_SERVICE)), __param(1, ng.Inject(rf.EVENT_BUS)), __metadata('design:paramtypes', [(typeof(_a = typeof services_1.GithubService !== 'undefined' && services_1.GithubService) === 'function' && _a) || Object, Object])], Github);
        return Github;
        var _a;
      })();
      exports_1("Github", Github);
    }
  };
});

System.register("app/components/jsfiddle.ts", ["angular2/core", "angular2-reflow", "../events", "../services"], function(exports_1) {
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
  var ng,
      rf,
      events_1,
      services_1;
  var JsFiddle;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rf_1) {
      rf = rf_1;
    }, function(events_1_1) {
      events_1 = events_1_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }],
    execute: function() {
      JsFiddle = (function() {
        function JsFiddle(jsfiddleService, eventBus) {
          this.jsfiddleService = jsfiddleService;
          this.eventBus = eventBus;
        }
        JsFiddle.prototype.openLink = function(url) {
          this.eventBus.dispatchEvent(new events_1.ActionEvent(events_1.ActionEvent.ACTION, "Open Fiddle Link: " + url));
        };
        JsFiddle.prototype.ngOnInit = function() {
          var _this = this;
          var subscription = this.jsfiddleService.fiddles().subscribe(function(x) {
            return _this.fiddles = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription && subscription.unsubscribe();
          });
        };
        JsFiddle = __decorate([ng.Component({
          selector: 'content-jsfiddle',
          template: "\n  <h1>Js Fiddle</h1>\n  <ul>\n    <li template=\"ngFor #fiddle of fiddles\">\n      <a (click)=\"openLink(fiddle.url)\">\n        {{fiddle.title}}\n      </a>\n    </li>\n  </ul>\n  "
        }), __param(0, ng.Inject(services_1.JSFIDDLE_SERVICE)), __param(1, ng.Inject(rf.EVENT_BUS)), __metadata('design:paramtypes', [(typeof(_a = typeof services_1.JsFiddleService !== 'undefined' && services_1.JsFiddleService) === 'function' && _a) || Object, Object])], JsFiddle);
        return JsFiddle;
        var _a;
      })();
      exports_1("JsFiddle", JsFiddle);
    }
  };
});

System.register("app/components/activity.css!github:systemjs/plugin-css@0.1.20.js", [], function() { return { setters: [], execute: function() {} } });

System.register("app/components/activity.ts", ["angular2/core", "moment", "../services", "./activity.css!"], function(exports_1) {
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
  var ng,
      moment_1,
      services_1;
  var Activity;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(moment_1_1) {
      moment_1 = moment_1_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }, function(_1) {}],
    execute: function() {
      Activity = (function() {
        function Activity(activityService) {
          this.activityService = activityService;
        }
        Activity.prototype.chooseBehanceCover = function(activity) {
          var sizes = ['404', '230', '202', '115'];
          var f = -1;
          var fmax = sizes.length;
          while (++f < fmax) {
            var size = sizes[f];
            if (typeof activity.behance.covers[size] === 'string')
              return activity.behance.covers[size];
          }
          return '';
        };
        Activity.prototype.hasGhPages = function(activity) {
          return activity.github.branches.filter(function(branch) {
            return branch.name === 'gh-pages';
          }).length > 0;
        };
        Activity.prototype.ngOnInit = function() {
          var _this = this;
          var subscription = this.activityService.activities().map(function(activities) {
            return activities.sort(function(a, b) {
              return (a.date > b.date) ? -1 : 1;
            }).map(function(activity) {
              var name = activity.name;
              var date = moment_1.default(activity.date).format('MMM D, YYYY');
              var preview;
              var links = [];
              switch (activity.from) {
                case 'github':
                  preview = 'assets/github.svg';
                  links.push({
                    name: 'github',
                    url: activity.github.html_url
                  });
                  if (_this.hasGhPages(activity))
                    links.push({
                      name: 'pages',
                      url: "http://iamssen.github.io/" + activity.github.name
                    });
                  break;
                case 'gist':
                  preview = 'assets/gist.svg';
                  links.push({
                    name: 'gist',
                    url: activity.gist.html_url
                  });
                  break;
                case 'jsfiddle':
                  preview = 'assets/jsfiddle.svg';
                  links.push({
                    name: 'jsfiddle',
                    url: activity.jsfiddle.url
                  });
                  break;
                case 'behance':
                  preview = _this.chooseBehanceCover(activity);
                  links.push({
                    name: 'behance',
                    url: activity.behance.url
                  });
                  break;
              }
              return {
                name: name,
                preview: preview,
                links: links,
                date: date
              };
            });
          }).subscribe(function(x) {
            return _this.items = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription && subscription.unsubscribe();
          });
        };
        Activity = __decorate([ng.Component({
          selector: 'content-activity',
          templateUrl: 'app/components/activity.html'
        }), __param(0, ng.Inject(services_1.ACTIVITY_SERVICE)), __metadata('design:paramtypes', [(typeof(_a = typeof services_1.ActivityService !== 'undefined' && services_1.ActivityService) === 'function' && _a) || Object])], Activity);
        return Activity;
        var _a;
      })();
      exports_1("Activity", Activity);
    }
  };
});

System.register("app/components/infographics/basic-chart/bar.ts", ["d3tip"], function(exports_1) {
  var d3tip_1;
  var BarChart;
  return {
    setters: [function(d3tip_1_1) {
      d3tip_1 = d3tip_1_1;
    }],
    execute: function() {
      BarChart = (function() {
        function BarChart(svg, WIDTH, HEIGHT, MARGIN) {
          this.svg = svg;
          this.WIDTH = WIDTH;
          this.HEIGHT = HEIGHT;
          this.MARGIN = MARGIN;
          this.duration = 300;
          this.delay = 40;
          this.color = d3.scale.category20c();
          this.width = this.WIDTH - this.MARGIN.LEFT - this.MARGIN.RIGHT;
          this.height = this.HEIGHT - this.MARGIN.TOP - this.MARGIN.BOTTOM;
          this.svg.attr({
            width: WIDTH,
            height: HEIGHT
          });
          this.g = this.svg.append('g').attr('transform', "translate(" + this.MARGIN.LEFT + ", " + this.MARGIN.TOP + ")");
          this.x = this.g.append('g').attr('transform', "translate(0, 0)");
          this.y = this.g.append('g').attr('transform', "translate(0, " + this.height + ")");
          this.easeIn = d3.ease('quad-in');
          this.easeOut = d3.ease('quad-out');
        }
        BarChart.prototype.update = function(data) {
          var _this = this;
          var xmax = d3.max(data, function(d) {
            return d.Data1;
          });
          var xscale = d3.scale.linear().rangeRound([0, this.width]).domain([0, xmax]).nice();
          var yscale = d3.scale.ordinal().rangeRoundBands([0, this.height]).domain(data.map(function(d) {
            return d.Category;
          }));
          var rects = this.g.selectAll('rect').data(data);
          rects.transition().duration(this.duration).delay(function(d, i) {
            return _this.delay * i;
          }).ease(this.easeOut).attr({
            fill: function(d) {
              return _this.color(d.Category);
            },
            y: function(d) {
              return yscale(d.Category);
            },
            width: function(d) {
              return xscale(d.Data1);
            },
            height: function(d) {
              return yscale.rangeBand();
            }
          });
          rects.exit().transition().duration(this.duration).delay(function(d, i) {
            return _this.delay * i;
          }).ease(this.easeIn).attr({
            opacity: 0,
            y: this.height,
            width: 0,
            height: 0
          }).remove();
          rects.enter().append('rect').attr({
            fill: function(d) {
              return _this.color(d.Category);
            },
            opacity: 0,
            y: function(d) {
              return yscale(d.Category);
            },
            width: 0,
            height: function(d) {
              return yscale.rangeBand();
            }
          }).call(d3tip_1.default({html: function(d) {
              return ("<h5>" + d.Category + "</h5>" + d.Data1);
            }})).transition().duration(this.duration).delay(function(d, i) {
            return _this.delay * i;
          }).ease(this.easeOut).attr({
            opacity: 1,
            width: function(d) {
              return xscale(d.Data1);
            }
          });
          var xaxis = d3.svg.axis().scale(xscale).orient('bottom');
          var yaxis = d3.svg.axis().scale(yscale).orient('left');
          this.y.call(xaxis);
          this.x.call(yaxis);
        };
        return BarChart;
      })();
      exports_1("BarChart", BarChart);
    }
  };
});

System.register("app/components/infographics/basic-chart/column.ts", ["d3tip"], function(exports_1) {
  var d3tip_1;
  var ColumnChart;
  return {
    setters: [function(d3tip_1_1) {
      d3tip_1 = d3tip_1_1;
    }],
    execute: function() {
      ColumnChart = (function() {
        function ColumnChart(svg, WIDTH, HEIGHT, MARGIN) {
          this.svg = svg;
          this.WIDTH = WIDTH;
          this.HEIGHT = HEIGHT;
          this.MARGIN = MARGIN;
          this.duration = 300;
          this.delay = 40;
          this.color = d3.scale.category20c();
          this.width = this.WIDTH - this.MARGIN.LEFT - this.MARGIN.RIGHT;
          this.height = this.HEIGHT - this.MARGIN.TOP - this.MARGIN.BOTTOM;
          this.svg.attr({
            width: WIDTH,
            height: HEIGHT
          });
          this.g = this.svg.append('g').attr('transform', "translate(" + this.MARGIN.LEFT + ", " + this.MARGIN.TOP + ")");
          this.x = this.g.append('g').attr('transform', "translate(0, " + this.height + ")");
          this.y = this.g.append('g').attr('transform', "translate(0, 0)");
          this.easeIn = d3.ease('quad-in');
          this.easeOut = d3.ease('quad-out');
        }
        ColumnChart.prototype.update = function(data) {
          var _this = this;
          var ymax = d3.max(data, function(d) {
            return d.Data1;
          });
          var xscale = d3.scale.ordinal().rangeRoundBands([0, this.width]).domain(data.map(function(d) {
            return d.Category;
          }));
          var yscale = d3.scale.linear().rangeRound([this.height, 0]).domain([0, ymax]).nice();
          var rects = this.g.selectAll('rect').data(data);
          rects.transition().duration(this.duration).delay(function(d, i) {
            return _this.delay * i;
          }).ease(this.easeOut).attr({
            fill: function(d) {
              return _this.color(d.Category);
            },
            x: function(d) {
              return xscale(d.Category);
            },
            y: function(d) {
              return yscale(d.Data1);
            },
            width: function(d) {
              return xscale.rangeBand();
            },
            height: function(d) {
              return _this.height - yscale(d.Data1);
            }
          });
          rects.exit().transition().duration(this.duration).delay(function(d, i) {
            return _this.delay * i;
          }).ease(this.easeIn).attr({
            opacity: 0,
            x: this.width,
            y: this.height,
            width: 0,
            height: 0
          }).remove();
          rects.enter().append('rect').attr({
            fill: function(d) {
              return _this.color(d.Category);
            },
            opacity: 0,
            x: function(d) {
              return xscale(d.Category);
            },
            y: this.height,
            width: function(d) {
              return xscale.rangeBand();
            },
            height: 0
          }).call(d3tip_1.default({html: function(d) {
              return ("<h5>" + d.Category + "</h5>" + d.Data1);
            }})).transition().duration(this.duration).delay(function(d, i) {
            return _this.delay * i;
          }).ease(this.easeOut).attr({
            opacity: 1,
            y: function(d) {
              return yscale(d.Data1);
            },
            height: function(d) {
              return _this.height - yscale(d.Data1);
            }
          });
          var xaxis = d3.svg.axis().scale(xscale).orient('bottom');
          var yaxis = d3.svg.axis().scale(yscale).orient('left');
          this.x.call(xaxis);
          this.y.call(yaxis);
        };
        return ColumnChart;
      })();
      exports_1("ColumnChart", ColumnChart);
    }
  };
});

System.register("app/components/infographics/basic-chart/pie.ts", ["d3tip"], function(exports_1) {
  var d3tip_1;
  var PieChart;
  return {
    setters: [function(d3tip_1_1) {
      d3tip_1 = d3tip_1_1;
    }],
    execute: function() {
      PieChart = (function() {
        function PieChart(svg, RADIUS) {
          this.svg = svg;
          this.RADIUS = RADIUS;
          this.duration = 300;
          this.color = d3.scale.category20c();
          this.pie = d3.layout.pie().value(function(d) {
            return d.Data1;
          }).sort(null);
          this.arc = d3.svg.arc().outerRadius(RADIUS - 20).innerRadius(RADIUS - 60);
          this.svg.attr({
            width: this.RADIUS * 2,
            height: this.RADIUS * 2
          });
          this.g = this.svg.append('g').attr('transform', "translate(" + this.RADIUS + ", " + this.RADIUS + ")");
          this.easeIn = d3.ease('quad-in');
          this.easeOut = d3.ease('quad-out');
        }
        PieChart.prototype.update = function(data) {
          var _this = this;
          var pieData = this.pie(data);
          var arc = this.arc;
          if (this.prev) {
            this.prev.transition().duration(this.duration).tween('exit arc', function() {
              var selection = d3.select(this);
              return function(t) {
                var r = 1 - t;
                var a = (Math.PI * 2) - (Math.PI * 2 * r);
                selection.attr('d', function(d, i) {
                  var start = (d.startAngle * r) + a;
                  var end = (d.endAngle * r) + a;
                  return arc.startAngle(start).endAngle(end)(d, i);
                });
              };
            }).remove();
          }
          var path = this.g.selectAll('.path').data(pieData).enter().append('path').attr('fill', function(d) {
            return _this.color(d.data.Category);
          }).call(d3tip_1.default({html: function(d) {
              return ("<h5>" + d.data.Category + "</h5>" + d.data.Data1);
            }}));
          path.transition().duration(this.duration).tween('entry arc', function() {
            var selection = d3.select(this);
            return function(t) {
              selection.attr('d', function(d, i) {
                var start = d.startAngle * t;
                var end = d.endAngle * t;
                return arc.startAngle(start).endAngle(end)(d, i);
              });
            };
          });
          this.prev = path;
        };
        return PieChart;
      })();
      exports_1("PieChart", PieChart);
    }
  };
});

System.register("app/components/infographics/basic-chart/line.ts", [], function(exports_1) {
  var LineChart;
  return {
    setters: [],
    execute: function() {
      LineChart = (function() {
        function LineChart(svg, WIDTH, HEIGHT, MARGIN) {
          this.svg = svg;
          this.WIDTH = WIDTH;
          this.HEIGHT = HEIGHT;
          this.MARGIN = MARGIN;
          this.duration = 300;
          this.color = d3.scale.category20c();
          this.width = this.WIDTH - this.MARGIN.LEFT - this.MARGIN.RIGHT;
          this.height = this.HEIGHT - this.MARGIN.TOP - this.MARGIN.BOTTOM;
          this.svg.attr({
            width: WIDTH,
            height: HEIGHT
          });
          this.g = this.svg.append('g').attr('transform', "translate(" + this.MARGIN.LEFT + ", " + this.MARGIN.TOP + ")");
          this.x = this.g.append('g').attr('transform', "translate(0, " + this.height + ")");
          this.y = this.g.append('g').attr('transform', "translate(0, 0)");
          this.easeIn = d3.ease('quad-in');
          this.easeOut = d3.ease('quad-out');
        }
        LineChart.prototype.update = function(data) {
          var ymax = d3.max(data, function(d) {
            return d.Data1;
          });
          var xscale = d3.scale.ordinal().rangeRoundBands([0, this.width]).domain(data.map(function(d) {
            return d.Category;
          }));
          var yscale = d3.scale.linear().rangeRound([this.height, 0]).domain([0, ymax]).nice();
          var line1 = d3.svg.line().x(function(d, i) {
            return xscale(d.Category) + (xscale.rangeBand() / 2);
          }).y(function(d, i) {
            return yscale(d.Data1);
          });
          if (!this.path1) {
            var line0 = d3.svg.line().x(function(d, i) {
              return xscale(d.Category) + (xscale.rangeBand() / 2);
            }).y(function(d, i) {
              return yscale.range()[0];
            });
            this.path1 = this.g.append('path').attr({
              fill: 'none',
              stroke: this.color('line1'),
              'stroke-width': '4px',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round'
            });
            this.path1.datum(data).attr('d', line0).transition().attr('d', line1);
          } else {
            this.path1.datum(data).transition().attr('d', line1);
          }
          var xaxis = d3.svg.axis().scale(xscale).orient('bottom');
          var yaxis = d3.svg.axis().scale(yscale).orient('left');
          this.x.call(xaxis);
          this.y.call(yaxis);
        };
        return LineChart;
      })();
      exports_1("LineChart", LineChart);
    }
  };
});

System.registerDynamic("npm:d3tip@0.4.2/dist/d3tip.js", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  if (window && !window.hasOwnProperty('exports'))
    window['exports'] = {};
  var POS;
  (function(POS) {
    POS[POS["TOP"] = 0] = "TOP";
    POS[POS["BOTTOM"] = 1] = "BOTTOM";
    POS[POS["LEFT"] = 2] = "LEFT";
    POS[POS["RIGHT"] = 3] = "RIGHT";
    POS[POS["TOP_LEFT"] = 4] = "TOP_LEFT";
    POS[POS["TOP_RIGHT"] = 5] = "TOP_RIGHT";
    POS[POS["BOTTOM_LEFT"] = 6] = "BOTTOM_LEFT";
    POS[POS["BOTTOM_RIGHT"] = 7] = "BOTTOM_RIGHT";
  })(POS || (POS = {}));
  var MODE;
  (function(MODE) {
    MODE[MODE["ELEMENT"] = 0] = "ELEMENT";
    MODE[MODE["POINTER"] = 1] = "POINTER";
  })(MODE || (MODE = {}));
  function toPOS(value) {
    switch (value.toLowerCase()) {
      case 'top':
        return POS.TOP;
      case 'bottom':
        return POS.BOTTOM;
      case 'left':
        return POS.LEFT;
      case 'right':
        return POS.RIGHT;
      case 'topleft':
        return POS.TOP_LEFT;
      case 'topright':
        return POS.TOP_RIGHT;
      case 'bottomleft':
        return POS.BOTTOM_LEFT;
      case 'bottomright':
        return POS.BOTTOM_RIGHT;
    }
    return POS.TOP;
  }
  var DEFAULT_DISTANCE = 10;
  var DEFAULT_POSITION = "topRight";
  function option(d, i, o, option, defaultValue) {
    if (!option)
      return defaultValue;
    if (typeof option === 'function')
      return option(d, i, o);
    return option;
  }
  function d3tip(options) {
    if (options === void 0) {
      options = {};
    }
    return function(selection) {
      var tip;
      selection.on('mouseover', function(d, i, o) {
        var html = option(d, i, o, options.html, '-');
        var classed = option(d, i, o, options.classed, []);
        var mode;
        if (options.target && options.target.toLowerCase() === 'element') {
          mode = MODE.ELEMENT;
        } else {
          mode = MODE.POINTER;
        }
        var element = selection[o][i];
        var elementBound = element.getBoundingClientRect();
        tip = d3.select('body').append('div').html(html).style({
          'position': 'absolute',
          'pointer-events': 'none',
          'opacity': 0
        });
        if (classed.length > 0) {
          var classes = {};
          classed.forEach(function(name) {
            return classes[name] = true;
          });
          tip.classed(classes);
        } else {
          tip.classed('d3tip', true);
        }
        var dom = $(document);
        var documentWidth = dom.width();
        var documentHeight = dom.height();
        var box = $(tip.node());
        var w = box.outerWidth();
        var h = box.outerHeight();
        if (mode === MODE.ELEMENT) {
          var distance = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
          var pos = toPOS(option(d, i, o, options.position, DEFAULT_POSITION));
          var x;
          var y;
          var tx;
          var ty;
          if (pos === POS.LEFT || pos === POS.RIGHT) {
            y = elementBound.bottom - (elementBound.height / 2) - (h / 2);
            ty = y;
          } else if (pos === POS.TOP || pos === POS.TOP_LEFT || pos === POS.TOP_RIGHT) {
            y = elementBound.top - h;
            ty = y - distance;
            if (ty < 0) {
              y = elementBound.bottom;
              ty = y + distance;
            }
          } else {
            y = elementBound.bottom;
            ty = y + distance;
            if (ty + h > documentHeight) {
              y = elementBound.top - h;
              ty = y - distance;
            }
          }
          if (pos === POS.LEFT) {
            x = elementBound.left - w;
            tx = x - distance;
            if (tx < 0) {
              x = elementBound.right;
              tx = x + distance;
            }
          } else if (pos === POS.RIGHT) {
            x = elementBound.right;
            tx = x + distance;
            if (tx + w > documentWidth) {
              x = elementBound.left - w;
              tx = x - distance;
            }
          } else if (pos === POS.TOP_LEFT || pos === POS.BOTTOM_LEFT) {
            x = elementBound.right - (elementBound.width / 2) - w;
            tx = x - distance;
            if (tx < 0) {
              x = elementBound.right - (elementBound.width / 2);
              tx = x + distance;
            }
          } else if (pos === POS.TOP_RIGHT || pos === POS.BOTTOM_RIGHT) {
            x = elementBound.right - (elementBound.width / 2);
            tx = x + distance;
            if (tx + w > documentWidth) {
              x = elementBound.right - (elementBound.width / 2) - w;
              tx = x - distance;
            }
          } else {
            x = elementBound.right - (elementBound.width / 2) - (w / 2);
            tx = x;
          }
          var bumper = 5;
          if (tx < 0) {
            tx = bumper;
            x = tx + distance;
          } else if (tx + w > documentWidth) {
            tx = documentWidth - w - bumper;
            x = tx - distance;
          }
          if (ty < 0) {
            ty = bumper;
            y = ty + distance;
          } else if (ty + h > documentHeight) {
            ty = documentHeight - h - bumper;
            y = ty - distance;
          }
          tip.style({
            'transition-property': 'transform, opacity',
            'left': x + "px",
            'top': y + "px",
            'opacity': 1,
            'transform': "translate(" + (tx - x) + "px, " + (ty - y) + "px)"
          });
        } else if (mode === MODE.POINTER) {
          var distance = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
          var pos = toPOS(option(d, i, o, options.position, DEFAULT_POSITION));
          var x;
          var y;
          var tx;
          var ty;
          if (pos === POS.LEFT || pos === POS.RIGHT) {
            y = h / -2;
            ty = 0;
          } else if (pos === POS.TOP || pos === POS.TOP_LEFT || pos === POS.TOP_RIGHT) {
            y = -h;
            ty = -distance;
          } else {
            y = 0;
            ty = distance;
          }
          if (pos === POS.TOP || pos === POS.BOTTOM) {
            x = w / -2;
            tx = 0;
          } else if (pos === POS.LEFT || pos === POS.TOP_LEFT || pos === POS.BOTTOM_LEFT) {
            x = -w;
            tx = (pos === POS.LEFT) ? -distance : 0;
          } else {
            x = 0;
            tx = (pos === POS.RIGHT) ? distance : 0;
          }
          var bumper = 5;
          var mousemove = function(event) {
            var px = event.pageX + x;
            var py = event.pageY + y;
            if (px < 0) {
              px = bumper;
            } else if (px + w > documentWidth) {
              px = documentWidth - w - bumper;
            }
            if (py < 0) {
              py = bumper;
            } else if (py + h > documentHeight) {
              py = documentHeight - h - bumper;
            }
            tip.style({
              'left': px + "px",
              'top': py + "px"
            });
          };
          var $window = $(window).on('mousemove', mousemove);
          var $element = $(element).on('mouseout', function() {
            $window.off();
            $element.off();
          });
          tip.style({
            'transition-property': 'transform, opacity',
            'opacity': 1,
            'transform': "translate(" + tx + "px, " + ty + "px)"
          });
        }
      }).on('mouseout', function() {
        tip.remove();
        tip = null;
      });
    };
  }
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.default = d3tip;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("npm:d3tip@0.4.2.js", ["npm:d3tip@0.4.2/dist/d3tip.js"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('npm:d3tip@0.4.2/dist/d3tip.js');
  global.define = __define;
  return module.exports;
});

System.register("app/components/infographics/basic-chart/bubble.ts", ["d3tip"], function(exports_1) {
  var d3tip_1;
  var BubbleChart;
  return {
    setters: [function(d3tip_1_1) {
      d3tip_1 = d3tip_1_1;
    }],
    execute: function() {
      BubbleChart = (function() {
        function BubbleChart(svg, WIDTH, HEIGHT, MARGIN) {
          this.svg = svg;
          this.WIDTH = WIDTH;
          this.HEIGHT = HEIGHT;
          this.MARGIN = MARGIN;
          this.duration = 300;
          this.delay = 40;
          this.color = d3.scale.category20c();
          this.width = this.WIDTH - this.MARGIN.LEFT - this.MARGIN.RIGHT;
          this.height = this.HEIGHT - this.MARGIN.TOP - this.MARGIN.BOTTOM;
          this.svg.attr({
            width: WIDTH,
            height: HEIGHT
          });
          this.g = this.svg.append('g').attr('transform', "translate(" + this.MARGIN.LEFT + ", " + this.MARGIN.TOP + ")");
          this.x = this.g.append('g').attr('transform', "translate(0, " + this.height + ")");
          this.y = this.g.append('g').attr('transform', "translate(0, 0)");
          this.easeIn = d3.ease('quad-in');
          this.easeOut = d3.ease('quad-out');
        }
        BubbleChart.prototype.update = function(data) {
          var _this = this;
          var xmax = d3.max(data, function(d) {
            return d.Data2;
          });
          var ymax = d3.max(data, function(d) {
            return d.Data1;
          });
          var zmax = d3.max(data, function(d) {
            return d.Data3;
          });
          var xscale = d3.scale.linear().rangeRound([0, this.width]).domain([0, xmax]).nice();
          var yscale = d3.scale.linear().rangeRound([this.height, 0]).domain([0, ymax]).nice();
          if (this.prev) {
            this.prev.transition().duration(this.duration).delay(function(d, i) {
              return _this.delay * i;
            }).ease(this.easeIn).attr({
              opacity: 0,
              r: 0
            }).remove();
          }
          this.prev = this.g.selectAll('.circle').data(data).enter().append('circle').attr({
            fill: function(d) {
              return _this.color(d.Category);
            },
            cx: function(d) {
              return xscale(d.Data2);
            },
            cy: function(d) {
              return yscale(d.Data1);
            },
            r: 0,
            opacity: 0
          }).call(d3tip_1.default({html: function(d) {
              return ("<h5>" + d.Category + "</h5>" + d.Data1 + "<br/>" + d.Data2 + "<br/>" + d.Data3);
            }}));
          this.prev.transition().delay(function(d, i) {
            return _this.delay * i;
          }).ease(this.easeOut).attr({
            opacity: 1,
            r: function(d) {
              return 5 + ((d.Data3 / zmax) * 15);
            }
          });
          var xaxis = d3.svg.axis().scale(xscale).orient('bottom');
          var yaxis = d3.svg.axis().scale(yscale).orient('left');
          this.x.call(xaxis);
          this.y.call(yaxis);
        };
        return BubbleChart;
      })();
      exports_1("BubbleChart", BubbleChart);
    }
  };
});

System.register("npm:d3tip@0.4.2/dist/d3tip.css!github:systemjs/plugin-css@0.1.20.js", [], function() { return { setters: [], execute: function() {} } });

System.register("app/components/infographics/basic-chart.ts", ["angular2/core", "./basic-chart/bar", "./basic-chart/column", "./basic-chart/pie", "./basic-chart/line", "./basic-chart/bubble", "d3tip/dist/d3tip.css!"], function(exports_1) {
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
      bar_1,
      column_1,
      pie_1,
      line_1,
      bubble_1;
  var BasicChart;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(bar_1_1) {
      bar_1 = bar_1_1;
    }, function(column_1_1) {
      column_1 = column_1_1;
    }, function(pie_1_1) {
      pie_1 = pie_1_1;
    }, function(line_1_1) {
      line_1 = line_1_1;
    }, function(bubble_1_1) {
      bubble_1 = bubble_1_1;
    }, function(_1) {}],
    execute: function() {
      BasicChart = (function() {
        function BasicChart(elementRef) {
          this.elementRef = elementRef;
        }
        BasicChart.prototype.ngOnInit = function() {
          this.columnChart = new column_1.ColumnChart(d3.select(this.elementRef.nativeElement).select('.column-chart'), 540, 320, {
            TOP: 20,
            BOTTOM: 30,
            LEFT: 50,
            RIGHT: 20
          });
          this.barChart = new bar_1.BarChart(d3.select(this.elementRef.nativeElement).select('.bar-chart'), 540, 320, {
            TOP: 20,
            BOTTOM: 30,
            LEFT: 50,
            RIGHT: 20
          });
          this.pieChart = new pie_1.PieChart(d3.select(this.elementRef.nativeElement).select('.pie-chart'), 160);
          this.lineChart = new line_1.LineChart(d3.select(this.elementRef.nativeElement).select('.line-chart'), 540, 320, {
            TOP: 20,
            BOTTOM: 30,
            LEFT: 50,
            RIGHT: 20
          });
          this.bubbleChart = new bubble_1.BubbleChart(d3.select(this.elementRef.nativeElement).select('.bubble-chart'), 540, 320, {
            TOP: 20,
            BOTTOM: 30,
            LEFT: 50,
            RIGHT: 20
          });
          this.refresh();
        };
        BasicChart.prototype.refresh = function() {
          var data = this.data();
          this.columnChart.update(data);
          this.barChart.update(data);
          this.pieChart.update(data);
          this.lineChart.update(data);
          this.bubbleChart.update(data);
        };
        BasicChart.prototype.data = function() {
          var max = Math.random() * 1000;
          var arr = [];
          var f = -1;
          var fmax = 3 + (Math.random() * 6);
          while (++f < fmax) {
            arr.push({
              Category: 1980 + f,
              Data1: Math.random() * max,
              Data2: Math.random() * max,
              Data3: Math.random() * max,
              Data4: Math.random() * max
            });
          }
          return arr;
        };
        BasicChart = __decorate([core_1.Component({
          selector: 'basic-column-chart',
          template: "\n  <div align=\"right\">\n    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"refresh()\">Refresh</button>\n  </div>\n  <svg class=\"radar-chart\"></svg>\n  <svg class=\"pie-chart\"></svg>\n  <svg class=\"bubble-chart\"></svg>\n  <svg class=\"line-chart\"></svg>\n  <svg class=\"column-chart\"></svg>\n  <svg class=\"bar-chart\"></svg>\n  "
        }), __param(0, core_1.Inject(core_1.ElementRef)), __metadata('design:paramtypes', [(typeof(_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])], BasicChart);
        return BasicChart;
        var _a;
      })();
      exports_1("BasicChart", BasicChart);
    }
  };
});

System.register("app/components/infographics/datagrid-basic.ts", ["angular2/core"], function(exports_1) {
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
  var ng;
  var DataGridBasic;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }],
    execute: function() {
      DataGridBasic = (function() {
        function DataGridBasic() {}
        DataGridBasic = __decorate([ng.Component({
          selector: 'datagrid-basic',
          template: "\n  <h1>Data Grid Basic</h1>\n  "
        }), __metadata('design:paramtypes', [])], DataGridBasic);
        return DataGridBasic;
      })();
      exports_1("DataGridBasic", DataGridBasic);
    }
  };
});

System.register("app/components/infographics/datagrid-merge.ts", ["angular2/core"], function(exports_1) {
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
  var ng;
  var DataGridMerge;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }],
    execute: function() {
      DataGridMerge = (function() {
        function DataGridMerge() {}
        DataGridMerge = __decorate([ng.Component({
          selector: 'datagrid-merge',
          template: "\n  <h1>Data Grid Merge</h1>\n  "
        }), __metadata('design:paramtypes', [])], DataGridMerge);
        return DataGridMerge;
      })();
      exports_1("DataGridMerge", DataGridMerge);
    }
  };
});

System.register("app/components/infographics/route-config.ts", ["./basic-chart", "./datagrid-basic", "./datagrid-merge"], function(exports_1) {
  var basic_chart_1,
      datagrid_basic_1,
      datagrid_merge_1;
  var routeConfig;
  return {
    setters: [function(basic_chart_1_1) {
      basic_chart_1 = basic_chart_1_1;
    }, function(datagrid_basic_1_1) {
      datagrid_basic_1 = datagrid_basic_1_1;
    }, function(datagrid_merge_1_1) {
      datagrid_merge_1 = datagrid_merge_1_1;
    }],
    execute: function() {
      routeConfig = [{
        path: '/',
        name: 'Data Grid Basic',
        component: datagrid_basic_1.DataGridBasic
      }, {
        path: '/basic-chart',
        name: 'Basic Chart',
        component: basic_chart_1.BasicChart
      }, {
        path: '/datagrid-merge',
        name: 'Data Grid Merge',
        component: datagrid_merge_1.DataGridMerge
      }];
      exports_1("routeConfig", routeConfig);
    }
  };
});

System.register("app/components/infographics.ts", ["angular2/core", "angular2/router", "./infographics/route-config"], function(exports_1) {
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
  var ng,
      router,
      route_config_1;
  var Infographics;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(router_1) {
      router = router_1;
    }, function(route_config_1_1) {
      route_config_1 = route_config_1_1;
    }],
    execute: function() {
      Infographics = (function() {
        function Infographics(location) {
          this.location = location;
          this.routeConfig = route_config_1.routeConfig;
        }
        Infographics.prototype.ngOnInit = function() {};
        Infographics.prototype.ngOnDestroy = function() {};
        Infographics.prototype.isActive = function(path) {
          var locationPath = this.location.path();
          path = "/infographics" + path;
          console.log(locationPath, path);
          if (locationPath === '/infographics' && path === '/infographics/')
            return true;
          return locationPath === path;
        };
        Infographics = __decorate([ng.Component({
          selector: 'content-infographics',
          templateUrl: 'app/components/infographics.html',
          directives: [router.ROUTER_DIRECTIVES]
        }), router.RouteConfig(route_config_1.routeConfig), __param(0, ng.Inject(router.Location)), __metadata('design:paramtypes', [Object])], Infographics);
        return Infographics;
      })();
      exports_1("Infographics", Infographics);
    }
  };
});

System.register("app/components/main-route-config.ts", ["./github", "./jsfiddle", "./activity", "./infographics"], function(exports_1) {
  var github_1,
      jsfiddle_1,
      activity_1,
      infographics_1;
  var routeConfig;
  return {
    setters: [function(github_1_1) {
      github_1 = github_1_1;
    }, function(jsfiddle_1_1) {
      jsfiddle_1 = jsfiddle_1_1;
    }, function(activity_1_1) {
      activity_1 = activity_1_1;
    }, function(infographics_1_1) {
      infographics_1 = infographics_1_1;
    }],
    execute: function() {
      routeConfig = [{
        path: '/',
        name: 'Activities',
        component: activity_1.Activity
      }, {
        path: '/infographics/...',
        name: 'Infographics',
        component: infographics_1.Infographics,
        link: ['Infographics', 'Data Grid Basic']
      }, {
        path: '/github',
        name: 'Github',
        component: github_1.Github
      }, {
        path: '/jsfiddle',
        name: 'JS Fiddle',
        component: jsfiddle_1.JsFiddle
      }];
      routeConfig.forEach(function(route) {
        if (!route.hasOwnProperty('link'))
          route['link'] = [route.name];
      });
      exports_1("routeConfig", routeConfig);
    }
  };
});

System.register("app/stores.ts", ["angular2/core"], function(exports_1) {
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
  var ng;
  var ACTIVITY_STORE,
      CACHE_LIFE,
      ActivityStore;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }],
    execute: function() {
      exports_1("ACTIVITY_STORE", ACTIVITY_STORE = "activityStore");
      CACHE_LIFE = 1000 * 60 * 10;
      ActivityStore = (function() {
        function ActivityStore() {}
        Object.defineProperty(ActivityStore.prototype, "activities", {
          get: function() {
            if (this._activities && (+new Date - this._activitiesCached) > CACHE_LIFE) {
              this._activities = null;
            }
            return this._activities;
          },
          set: function(value) {
            this._activitiesCached = +new Date;
            this._activities = value;
          },
          enumerable: true,
          configurable: true
        });
        ActivityStore = __decorate([ng.Injectable(), __metadata('design:paramtypes', [])], ActivityStore);
        return ActivityStore;
      })();
      exports_1("ActivityStore", ActivityStore);
    }
  };
});

System.register("app/services.ts", ["angular2/core", "rxjs", "./stores"], function(exports_1) {
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
  var ng,
      rx,
      stores_1;
  var GITHUB_SERVICE,
      JSFIDDLE_SERVICE,
      ACTIVITY_SERVICE,
      ANALYTICS_SERVICE,
      ActivityService;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rx_1) {
      rx = rx_1;
    }, function(stores_1_1) {
      stores_1 = stores_1_1;
    }],
    execute: function() {
      exports_1("GITHUB_SERVICE", GITHUB_SERVICE = 'githubService');
      exports_1("JSFIDDLE_SERVICE", JSFIDDLE_SERVICE = 'jsfiddleService');
      exports_1("ACTIVITY_SERVICE", ACTIVITY_SERVICE = 'activityService');
      exports_1("ANALYTICS_SERVICE", ANALYTICS_SERVICE = 'analyticsService');
      ActivityService = (function() {
        function ActivityService(activityStore) {
          this.activityStore = activityStore;
        }
        ActivityService.prototype.activities = function() {
          var _this = this;
          if (this.activityStore.activities) {
            return rx.Observable.of(this.activityStore.activities);
          }
          return rx.Observable.fromPromise($.getJSON("store/activity.json")).do(function(activities) {
            return _this.activityStore.activities = activities;
          });
        };
        ActivityService = __decorate([ng.Injectable(), __param(0, ng.Inject(stores_1.ACTIVITY_STORE)), __metadata('design:paramtypes', [(typeof(_a = typeof stores_1.ActivityStore !== 'undefined' && stores_1.ActivityStore) === 'function' && _a) || Object])], ActivityService);
        return ActivityService;
        var _a;
      })();
      exports_1("ActivityService", ActivityService);
    }
  };
});

System.register("app/events.ts", [], function(exports_1) {
  var ActionEvent;
  return {
    setters: [],
    execute: function() {
      ActionEvent = (function() {
        function ActionEvent(_type, _action) {
          this._type = _type;
          this._action = _action;
        }
        Object.defineProperty(ActionEvent.prototype, "type", {
          get: function() {
            return this._type;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ActionEvent.prototype, "action", {
          get: function() {
            return this._action;
          },
          enumerable: true,
          configurable: true
        });
        ActionEvent.ACTION = "actionEvent:action";
        return ActionEvent;
      })();
      exports_1("ActionEvent", ActionEvent);
    }
  };
});

System.register("app/components/event-bus-listener.css!github:systemjs/plugin-css@0.1.20.js", [], function() { return { setters: [], execute: function() {} } });

System.register("app/components/event-bus-listener.ts", ["angular2/core", "angular2-reflow", "../events", "./event-bus-listener.css!"], function(exports_1) {
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
  var ng,
      rf,
      events_1;
  var EventBusListener;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rf_1) {
      rf = rf_1;
    }, function(events_1_1) {
      events_1 = events_1_1;
    }, function(_1) {}],
    execute: function() {
      EventBusListener = (function() {
        function EventBusListener(eventBus) {
          this.eventBus = eventBus;
          this.opacity = 0;
          this.timeout = -1;
        }
        EventBusListener.prototype.ngOnInit = function() {
          var _this = this;
          this.listener = this.eventBus.addEventListener(events_1.ActionEvent.ACTION, function(event) {
            if (_this.timeout > -1)
              clearTimeout(_this.timeout);
            _this.action = event.action;
            _this.opacity = 1;
            _this.timeout = setTimeout(function() {
              _this.opacity = 0;
              _this.timeout = -1;
            }, 1200);
          });
        };
        EventBusListener.prototype.ngOnDestroy = function() {
          this.listener.remove();
          this.listener = null;
        };
        EventBusListener = __decorate([ng.Component({
          selector: 'event-bus-listener',
          template: "\n  <div class=\"event-bus-listener\" [style.opacity]=\"opacity\">\n    <div class=\"container\">\n      {{action}}\n    </div>\n  </div>\n  "
        }), __param(0, ng.Inject(rf.EVENT_BUS)), __metadata('design:paramtypes', [Object])], EventBusListener);
        return EventBusListener;
      })();
      exports_1("EventBusListener", EventBusListener);
    }
  };
});

System.register("app/components/main.css!github:systemjs/plugin-css@0.1.20.js", [], function() { return { setters: [], execute: function() {} } });

System.register("app/components/main.ts", ["angular2/core", "angular2/router", "angular2-reflow", "contexts:main", "./main-route-config", "../services", "./event-bus-listener", "./main.css!"], function(exports_1) {
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
  var ng,
      router,
      rf,
      contexts_main_1,
      main_route_config_1,
      services_1,
      event_bus_listener_1;
  var context,
      Main;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(router_1) {
      router = router_1;
    }, function(rf_1) {
      rf = rf_1;
    }, function(contexts_main_1_1) {
      contexts_main_1 = contexts_main_1_1;
    }, function(main_route_config_1_1) {
      main_route_config_1 = main_route_config_1_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }, function(event_bus_listener_1_1) {
      event_bus_listener_1 = event_bus_listener_1_1;
    }, function(_1) {}],
    execute: function() {
      context = new contexts_main_1.ContextFactory;
      Main = (function() {
        function Main(location, context, analyticsService) {
          this.location = location;
          this.context = context;
          this.analyticsService = analyticsService;
          this.routeConfig = main_route_config_1.routeConfig;
        }
        Main.prototype.ngOnInit = function() {
          this.context.start();
        };
        Main.prototype.ngOnDestroy = function() {
          this.context.destroy();
        };
        Main.prototype.isActive = function(path) {
          if (this.location.path() === '' && path === '/')
            return true;
          return this.location.path() === path;
        };
        Main = __decorate([ng.Component({
          selector: 'app-main',
          providers: [context.providers, router.ROUTER_PROVIDERS, ng.provide(router.LocationStrategy, {useClass: router.HashLocationStrategy})],
          templateUrl: 'app/components/main.html',
          directives: [router.ROUTER_DIRECTIVES, event_bus_listener_1.EventBusListener]
        }), router.RouteConfig(main_route_config_1.routeConfig), __param(0, ng.Inject(router.Location)), __param(1, ng.Inject(rf.CONTEXT)), __param(2, ng.Inject(services_1.ANALYTICS_SERVICE)), __metadata('design:paramtypes', [Object, Object, (typeof(_a = typeof services_1.AnalyticsService !== 'undefined' && services_1.AnalyticsService) === 'function' && _a) || Object])], Main);
        return Main;
        var _a;
      })();
      exports_1("Main", Main);
    }
  };
});

System.register("app/boot.ts", ["es6-shim", "es6-promise", "zone.js/lib/browser/zone-microtask", "reflect-metadata", "d3", "angular2/platform/browser", "./components/main"], function(exports_1) {
  var browser_1,
      main_1;
  return {
    setters: [function(_1) {}, function(_2) {}, function(_3) {}, function(_4) {}, function(_5) {}, function(browser_1_1) {
      browser_1 = browser_1_1;
    }, function(main_1_1) {
      main_1 = main_1_1;
    }],
    execute: function() {
      Error.stackTraceLimit = Infinity;
      browser_1.bootstrap(main_1.Main);
    }
  };
});

System.register('app/components/activity.css!github:systemjs/plugin-css@0.1.20.js', [], false, function() {});
System.register('npm:d3tip@0.4.2/dist/d3tip.css!github:systemjs/plugin-css@0.1.20.js', [], false, function() {});
System.register('app/components/event-bus-listener.css!github:systemjs/plugin-css@0.1.20.js', [], false, function() {});
System.register('app/components/main.css!github:systemjs/plugin-css@0.1.20.js', [], false, function() {});