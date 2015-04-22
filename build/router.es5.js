'use strict';

/*
 * A module for adding new a routing system Angular 1.
 */
angular.module('ngNewRouter', [])
  .factory('$router', routerFactory)
  .value('$routeParams', {})
  .provider('$componentLoader', $componentLoaderProvider)
  .provider('$pipeline', pipelineProvider)
  .factory('$$pipeline', privatePipelineFactory)
  .factory('$setupRoutersStep', setupRoutersStepFactory)
  .factory('$initLocalsStep', initLocalsStepFactory)
  .factory('$initControllersStep', initControllersStepFactory)
  .factory('$runCanDeactivateHookStep', runCanDeactivateHookStepFactory)
  .factory('$runCanActivateHookStep', runCanActivateHookStepFactory)
  .factory('$loadTemplatesStep', loadTemplatesStepFactory)
  .value('$activateStep', activateStepValue)
  .directive('ngViewport', ngViewportDirective)
  .directive('ngViewport', ngViewportFillContentDirective)
  .directive('ngLink', ngLinkDirective)
  .directive('a', anchorLinkDirective)




/*
 * A module for inspecting controller constructors
 */
angular.module('ng')
  .provider('$controllerIntrospector', $controllerIntrospectorProvider)
  .config(controllerProviderDecorator);

/*
 * decorates with routing info
 */
function controllerProviderDecorator($controllerProvider, $controllerIntrospectorProvider)  { console.log(arguments);
  var register = $controllerProvider.register;
  $controllerProvider.register = function (name, ctrl)  { console.log(arguments);
    $controllerIntrospectorProvider.register(name, ctrl);
    return register.apply(this, arguments);
  };
}
controllerProviderDecorator.$inject = ["$controllerProvider", "$controllerIntrospectorProvider"];

/*
 * private service that holds route mappings for each controller
 */
function $controllerIntrospectorProvider()  { console.log(arguments);
  var controllers = [];
  var onControllerRegistered = null;
  return {
    register: function (name, constructor)  { console.log(arguments);
      if (angular.isArray(constructor)) {
        constructor = constructor[constructor.length - 1];
      }
      if (constructor.$routeConfig) {
        if (onControllerRegistered) {
          onControllerRegistered(name, constructor.$routeConfig);
        } else {
          controllers.push({name: name, config: constructor.$routeConfig});
        }
      }
    },
    $get: ['$componentLoader', function ($componentLoader)  { console.log(arguments);
      return function (newOnControllerRegistered)  { console.log(arguments);
        onControllerRegistered = function (name, constructor)  { console.log(arguments);
          name = $componentLoader.component(name);
          return newOnControllerRegistered(name, constructor);
        };
        while(controllers.length > 0) {
          var rule = controllers.pop();
          onControllerRegistered(rule.name, rule.config);
        }
      }
    }]
  }
}

function routerFactory($$rootRouter, $rootScope, $location, $$grammar, $controllerIntrospector)  { console.log(arguments);

  $controllerIntrospector(function (name, config)  { console.log(arguments);
    $$grammar.config(name, config);
  });

  $rootScope.$watch(function ()  { console.log(arguments);
    return $location.path();
  }, function (newUrl)  { console.log(arguments);
    $$rootRouter.navigate(newUrl);
  });

  var nav = $$rootRouter.navigate;
  $$rootRouter.navigate = function (url)  { console.log(arguments);
    return nav.call(this, url).then(function (newUrl)  { console.log(arguments);
      if (newUrl) {
        $location.path(newUrl);
      }
    });
  }

  return $$rootRouter;
}
routerFactory.$inject = ["$$rootRouter", "$rootScope", "$location", "$$grammar", "$controllerIntrospector"];

/**
 * @name ngViewport
 *
 * @description
 * An ngViewport is where resolved content goes.
 *
 * ## Use
 *
 * ```html
 * <div router-viewport="name"></div>
 * ```
 *
 * The value for the `ngViewport` attribute is optional.
 */
function ngViewportDirective($animate, $injector, $q, $router)  { console.log(arguments);
  var rootRouter = $router;

  return {
    restrict: 'AE',
    transclude: 'element',
    terminal: true,
    priority: 400,
    require: ['?^^ngViewport', 'ngViewport'],
    link: viewportLink,
    controller: function()  { console.log(arguments);},
    controllerAs: '$$ngViewport'
  };

  function invoke(method, context, instruction)  { console.log(arguments);
    return $injector.invoke(method, context, instruction.locals);
  }

  function viewportLink(scope, $element, attrs, ctrls, $transclude)  { console.log(arguments);
    var viewportName = attrs.ngViewport || 'default',
        parentCtrl = ctrls[0],
        myCtrl = ctrls[1],
        router = (parentCtrl && parentCtrl.$$router) || rootRouter;

    var currentScope,
        newScope,
        currentController,
        currentElement,
        previousLeaveAnimation,
        previousInstruction;

    function cleanupLastView()  { console.log(arguments);
      if (previousLeaveAnimation) {
        $animate.cancel(previousLeaveAnimation);
        previousLeaveAnimation = null;
      }

      if (currentScope) {
        currentScope.$destroy();
        currentScope = null;
      }
      if (currentElement) {
        previousLeaveAnimation = $animate.leave(currentElement);
        previousLeaveAnimation.then(function()  { console.log(arguments);
          previousLeaveAnimation = null;
        });
        currentElement = null;
      }
    }

    router.registerViewport({
      canDeactivate: function(instruction)  { console.log(arguments);
        if (currentController && currentController.canDeactivate) {
          return invoke(currentController.canDeactivate, currentController, instruction);
        }
        return true;
      },
      activate: function(instruction)  { console.log(arguments);
        var nextInstruction = serializeInstruction(instruction);
        if (nextInstruction === previousInstruction) {
          return;
        }

        instruction.locals.$scope = newScope = scope.$new();
        myCtrl.$$router = instruction.router;
        myCtrl.$$template = instruction.template;
        var componentName = instruction.component;
        var clone = $transclude(newScope, function(clone)  { console.log(arguments);
          $animate.enter(clone, null, currentElement || $element);
          cleanupLastView();
        });

        var newController = instruction.controller;
        newScope[componentName] = newController;

        var result;
        if (currentController && currentController.deactivate) {
          result = $q.when(invoke(currentController.deactivate, currentController, instruction));
        }

        currentController = newController;

        currentElement = clone;
        currentScope = newScope;

        previousInstruction = nextInstruction;

        // finally, run the hook
        if (newController.activate) {
          var activationResult = $q.when(invoke(newController.activate, newController, instruction));
          if (result) {
            return result.then(activationResult);
          } else {
            return activationResult;
          }
        }
        return result;
      }
    }, viewportName);
  }

  // TODO: how best to serialize?
  function serializeInstruction(instruction)  { console.log(arguments);
    return JSON.stringify({
      path: instruction.path,
      component: instruction.component,
      params: Object.keys(instruction.params).reduce(function (acc, key)  { console.log(arguments);
        return (key !== 'childRoute' && (acc[key] = instruction.params[key])), acc;
      }, {})
    });
  }
}
ngViewportDirective.$inject = ["$animate", "$injector", "$q", "$router"];

function ngViewportFillContentDirective($compile)  { console.log(arguments);
  return {
    restrict: 'EA',
    priority: -400,
    require: 'ngViewport',
    link: function(scope, $element, attrs, ctrl)  { console.log(arguments);
      var template = ctrl.$$template;
      $element.html(template);
      var link = $compile($element.contents());
      link(scope);
    }
  };
}
ngViewportFillContentDirective.$inject = ["$compile"];

function makeComponentString(name)  { console.log(arguments);
  return [
    '<router-component component-name="', name, '">',
    '</router-component>'
  ].join('');
}


var LINK_MICROSYNTAX_RE = /^(.+?)(?:\((.*)\))?$/;
/**
 * @name ngLink
 * @description
 * Lets you link to different parts of the app, and automatically generates hrefs.
 *
 * ## Use
 * The directive uses a simple syntax: `router-link="componentName({ param: paramValue })"`
 *
 * ## Example
 *
 * ```js
 * angular.module('myApp', ['ngFuturisticRouter'])
 *   .controller('AppController', ['$router', function($router)  { console.log(arguments);
 *     $router.config({ path: '/user/:id' component: 'user' });
 *     this.user = { name: 'Brian', id: 123 };
 *   });
 * ```
 *
 * ```html
 * <div ng-controller="AppController as app">
 *   <a router-link="user({id: app.user.id})">{{app.user.name}}</a>
 * </div>
 * ```
 */
function ngLinkDirective($router, $location, $parse)  { console.log(arguments);
  var rootRouter = $router;

  return {
    require: '?^^ngViewport',
    restrict: 'A',
    link: ngLinkDirectiveLinkFn
  };

  function ngLinkDirectiveLinkFn(scope, elt, attrs, ctrl)  { console.log(arguments);
    var router = (ctrl && ctrl.$$router) || rootRouter;
    if (!router) {
      return;
    }

    var link = attrs.ngLink || '';
    var parts = link.match(LINK_MICROSYNTAX_RE);
    var routeName = parts[1];
    var routeParams = parts[2];
    var url;

    if (routeParams) {
      var routeParamsGetter = $parse(routeParams);
      // we can avoid adding a watcher if it's a literal
      if (routeParamsGetter.constant) {
        var params = routeParamsGetter();
        url = '.' + router.generate(routeName, params);
        elt.attr('href', url);
      } else {
        scope.$watch(function()  { console.log(arguments);
          return routeParamsGetter(scope);
        }, function(params)  { console.log(arguments);
          url = '.' + router.generate(routeName, params);
          elt.attr('href', url);
        }, true);
      }
    } else {
      url = '.' + router.generate(routeName);
      elt.attr('href', url);
    }
  }
}
ngLinkDirective.$inject = ["$router", "$location", "$parse"];


function anchorLinkDirective($router)  { console.log(arguments);
  return {
    restrict: 'E',
    link: function(scope, element)  { console.log(arguments);
      // If the linked element is not an anchor tag anymore, do nothing
      if (element[0].nodeName.toLowerCase() !== 'a') return;

      // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
      var hrefAttrName = Object.prototype.toString.call(element.prop('href')) === '[object SVGAnimatedString]' ?
                     'xlink:href' : 'href';

      element.on('click', function(event)  { console.log(arguments);
        var href = element.attr(hrefAttrName);
        if (!href) {
          event.preventDefault();
        }
        if ($router.recognize(href)) {
          $router.navigate(href);
          event.preventDefault();
        }
      });
    }
  }
}
anchorLinkDirective.$inject = ["$router"];

function setupRoutersStepFactory()  { console.log(arguments);
  return function (instruction)  { console.log(arguments);
    return instruction.router.makeDescendantRouters(instruction);
  }
}

/*
 * $initLocalsStep
 */
function initLocalsStepFactory()  { console.log(arguments);
  return function initLocals(instruction)  { console.log(arguments);
    return instruction.router.traverseInstruction(instruction, function(instruction)  { console.log(arguments);
      return instruction.locals = {
        $router: instruction.router,
        $routeParams: (instruction.params || {})
      };
    });
  }
}

/*
 * $initControllersStep
 */
function initControllersStepFactory($controller, $componentLoader)  { console.log(arguments);
  return function initControllers(instruction)  { console.log(arguments);
    return instruction.router.traverseInstruction(instruction, function(instruction)  { console.log(arguments);
      var controllerName = $componentLoader.controllerName(instruction.component);
      var locals = instruction.locals;
      var ctrl;
      try {
        ctrl = $controller(controllerName, locals);
      } catch(e) {
        console.warn && console.warn('Could not instantiate controller', controllerName);
        ctrl = $controller(angular.noop, locals);
      }
      return instruction.controller = ctrl;
    });
  }
}
initControllersStepFactory.$inject = ["$controller", "$componentLoader"];

function runCanDeactivateHookStepFactory()  { console.log(arguments);
  return function runCanDeactivateHook(instruction)  { console.log(arguments);
    return instruction.router.canDeactivatePorts(instruction);
  };
}

function runCanActivateHookStepFactory($injector)  { console.log(arguments);

  function invoke(method, context, instruction)  { console.log(arguments);
    return $injector.invoke(method, context, {
      $routeParams: instruction.params
    });
  }

  return function runCanActivateHook(instruction)  { console.log(arguments);
    return instruction.router.traverseInstruction(instruction, function(instruction)  { console.log(arguments);
      var controller = instruction.controller;
      return !controller.canActivate || invoke(controller.canActivate, controller, instruction);
    });
  }
}
runCanActivateHookStepFactory.$inject = ["$injector"];

function loadTemplatesStepFactory($componentLoader, $templateRequest)  { console.log(arguments);
  return function loadTemplates(instruction)  { console.log(arguments);
    return instruction.router.traverseInstruction(instruction, function(instruction)  { console.log(arguments);
      var componentTemplateUrl = $componentLoader.template(instruction.component);
      return $templateRequest(componentTemplateUrl).then(function (templateHtml)  { console.log(arguments);
        return instruction.template = templateHtml;
      });
    });
  };
}
loadTemplatesStepFactory.$inject = ["$componentLoader", "$templateRequest"];


function activateStepValue(instruction)  { console.log(arguments);
  return instruction.router.activatePorts(instruction);
}


function pipelineProvider()  { console.log(arguments);
  var stepConfiguration;

  var protoStepConfiguration = [
    '$setupRoutersStep',
    '$initLocalsStep',
    '$initControllersStep',
    '$runCanDeactivateHookStep',
    '$runCanActivateHookStep',
    '$loadTemplatesStep',
    '$activateStep'
  ];

  return {
    steps: protoStepConfiguration.slice(0),
    config: function (newConfig)  { console.log(arguments);
      protoStepConfiguration = newConfig;
    },
    $get: ["$injector", "$q", function ($injector, $q)  { console.log(arguments);
      stepConfiguration = protoStepConfiguration.map(function (step)  { console.log(arguments);
        return $injector.get(step);
      });
      return {
        process: function(instruction)  { console.log(arguments);
          // make a copy
          var steps = stepConfiguration.slice(0);

          function processOne(result)  { console.log(arguments);
            if (steps.length === 0) {
              return result;
            }
            var step = steps.shift();
            return $q.when(step(instruction)).then(processOne);
          }

          return processOne();
        }
      }
    }]
  };
}


/**
 * @name $componentLoaderProvider
 * @description
 *
 * This lets you configure conventions for what controllers are named and where to load templates from.
 *
 * The default behavior is to dasherize and serve from `./components`. A component called `myWidget`
 * uses a controller named `MyWidgetController` and a template loaded from `./components/my-widget/my-widget.html`.
 *
 * A component is:
 * - a controller
 * - a template
 * - an optional router
 *
 * This service makes it easy to group all of them into a single concept.
 */
function $componentLoaderProvider()  { console.log(arguments);

  var DEFAULT_SUFFIX = 'Controller';

  var componentToCtrl = function componentToCtrlDefault(name)  { console.log(arguments);
    return name[0].toUpperCase() + name.substr(1) + DEFAULT_SUFFIX;
  };

  var componentToTemplate = function componentToTemplateDefault(name)  { console.log(arguments);
    var dashName = dashCase(name);
    return './components/' + dashName + '/' + dashName + '.html';
  };

  var ctrlToComponent = function ctrlToComponentDefault(name)  { console.log(arguments);
    return name[0].toLowerCase() + name.substr(1, name.length - DEFAULT_SUFFIX.length - 1);
  };

  return {
    $get: function ()  { console.log(arguments);
      return {
        controllerName: componentToCtrl,
        template: componentToTemplate,
        component: ctrlToComponent
      };
    },

    /**
     * @name $componentLoaderProvider#setCtrlNameMapping
     * @description takes a function for mapping component names to component controller names
     */
    setCtrlNameMapping: function(newFn)  { console.log(arguments);
      componentToCtrl = newFn;
      return this;
    },

    /**
     * @name $componentLoaderProvider#setCtrlNameMapping
     * @description takes a function for mapping component controller names to component names
     */
    setComponentFromCtrlMapping: function (newFn)  { console.log(arguments);
      ctrlToComponent = newFn;
      return this;
    },

    /**
     * @name $componentLoaderProvider#setTemplateMapping
     * @description takes a function for mapping component names to component template URLs
     */
    setTemplateMapping: function(newFn)  { console.log(arguments);
      componentToTemplate = newFn;
      return this;
    }
  };
}

// this is a hack as a result of the build system used to transpile
function privatePipelineFactory($pipeline)  { console.log(arguments);
  return $pipeline;
}
privatePipelineFactory.$inject = ["$pipeline"];


function dashCase(str)  { console.log(arguments);
  return str.replace(/([A-Z])/g, function ($1)  { console.log(arguments);
    return '-' + $1.toLowerCase();
  });
}


angular.module('ngNewRouter').factory('$$rootRouter', ['$q', '$$grammar', '$$pipeline', function ($q, $$grammar, $$pipeline)  { console.log(arguments);
/*
 * artisinal, handcrafted subset of the traceur runtime for picky webdevs
 */

var $defineProperty = Object.defineProperty,
    $defineProperties = Object.defineProperties,
    $create = Object.create,
    $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    $getOwnPropertyNames = Object.getOwnPropertyNames,
    $getPrototypeOf = Object.getPrototypeOf;

function createClass(ctor, object, staticObject, superClass)  { console.log(arguments);
  $defineProperty(object, 'constructor', {
    value: ctor,
    configurable: true,
    enumerable: false,
    writable: true
  });
  if (arguments.length > 3) {
    if (typeof superClass === 'function')
      ctor.__proto__ = superClass;
    ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
  } else {
    ctor.prototype = object;
  }
  $defineProperty(ctor, 'prototype', {
    configurable: false,
    writable: false
  });
  return $defineProperties(ctor, getDescriptors(staticObject));
}

function getProtoParent(superClass)  { console.log(arguments);
  if (typeof superClass === 'function')  { console.log(arguments);
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null)
      return superClass.prototype;
    throw new TypeError('super prototype must be an Object or null');
  }
  if (superClass === null)
    return null;
  throw new TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
}

function getDescriptors(object)  { console.log(arguments);
  var descriptors = {};
  var names = $getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $getOwnPropertyDescriptor(object, name);
  }
  // TODO: someday you might use symbols and you'll have to re-evaluate
  //       your life choices that led to the creation of this file

  // var symbols = getOwnPropertySymbols(object);
  // for (var i = 0; i < symbols.length; i++) {
  //   var symbol = symbols[i];
  //   descriptors[$traceurRuntime.toProperty(symbol)] = $getOwnPropertyDescriptor(object, $traceurRuntime.toProperty(symbol));
  // }
  return descriptors;
}
function superDescriptor(homeObject, name)  { console.log(arguments);
  var proto = $getPrototypeOf(homeObject);
  do {
    var result = $getOwnPropertyDescriptor(proto, name);
    if (result)
      return result;
    proto = $getPrototypeOf(proto);
  } while (proto);
  return undefined;
}
function superCall(self, homeObject, name, args)  { console.log(arguments);
  return superGet(self, homeObject, name).apply(self, args);
}
function superGet(self, homeObject, name)  { console.log(arguments);
  var descriptor = superDescriptor(homeObject, name);
  if (descriptor) {
    if (!descriptor.get)
      return descriptor.value;
    return descriptor.get.call(self);
  }
  return undefined;
}

"use strict";
var Router = function Router(grammar, pipeline, parent, name)  { console.log(arguments);
    this.name = name;
    this.parent = parent || null;
    this.navigating = false;
    this.ports = {};
    this.children = {};
    this.registry = grammar;
    this.pipeline = pipeline;
  };
(createClass)(Router, {
    childRouter: function()  { console.log(arguments);
      var name = arguments[0] !== (void 0) ? arguments[0] : 'default';
      if (!this.children[name]) {
        this.children[name] = new ChildRouter(this, name);
      }
      return this.children[name];
    },
    registerViewport: function(view)  { console.log(arguments);
      var name = arguments[1] !== (void 0) ? arguments[1] : 'default';
      this.ports[name] = view;
      return this.renavigate();
    },
    config: function(mapping)  { console.log(arguments);
      this.registry.config(this.name, mapping);
      return this.renavigate();
    },
    navigate: function(url)  { console.log(arguments);
      var $__0 = this;
      if (this.navigating) {
        return $q.when();
      }
      this.lastNavigationAttempt = url;
      var instruction = this.recognize(url);
      if (!instruction) {
        return $q.reject();
      }
      this._startNavigating();
      instruction.router = this;
      return this.pipeline.process(instruction).then((function()  { console.log(arguments);
        return $__0._finishNavigating();
      }), (function()  { console.log(arguments);
        return $__0._finishNavigating();
      })).then((function()  { console.log(arguments);
        return instruction.canonicalUrl;
      }));
    },
    _startNavigating: function()  { console.log(arguments);
      this.navigating = true;
    },
    _finishNavigating: function()  { console.log(arguments);
      this.navigating = false;
    },
    makeDescendantRouters: function(instruction)  { console.log(arguments);
      this.traverseInstructionSync(instruction, (function(instruction, childInstruction)  { console.log(arguments);
        childInstruction.router = instruction.router.childRouter(childInstruction.component);
      }));
    },
    traverseInstructionSync: function(instruction, fn)  { console.log(arguments);
      var $__0 = this;
      forEach(instruction.viewports, (function(childInstruction, viewportName)  { console.log(arguments);
        return fn(instruction, childInstruction);
      }));
      forEach(instruction.viewports, (function(childInstruction)  { console.log(arguments);
        return $__0.traverseInstructionSync(childInstruction, fn);
      }));
    },
    traverseInstruction: function(instruction, fn)  { console.log(arguments);
      if (!instruction) {
        return $q.when();
      }
      return mapObjAsync(instruction.viewports, (function(childInstruction, viewportName)  { console.log(arguments);
        return boolToPromise(fn(childInstruction, viewportName));
      })).then((function()  { console.log(arguments);
        return mapObjAsync(instruction.viewports, (function(childInstruction, viewportName)  { console.log(arguments);
          return childInstruction.router.traverseInstruction(childInstruction, fn);
        }));
      }));
    },
    activatePorts: function(instruction)  { console.log(arguments);
      return this.queryViewports((function(port, name)  { console.log(arguments);
        return port.activate(instruction.viewports[name]);
      })).then((function()  { console.log(arguments);
        return mapObjAsync(instruction.viewports, (function(instruction)  { console.log(arguments);
          return instruction.router.activatePorts(instruction);
        }));
      }));
    },
    canDeactivatePorts: function(instruction)  { console.log(arguments);
      return this.traversePorts((function(port, name)  { console.log(arguments);
        return boolToPromise(port.canDeactivate(instruction.viewports[name]));
      }));
    },
    traversePorts: function(fn)  { console.log(arguments);
      var $__0 = this;
      return this.queryViewports(fn).then((function()  { console.log(arguments);
        return mapObjAsync($__0.children, (function(child)  { console.log(arguments);
          return child.traversePorts(fn);
        }));
      }));
    },
    queryViewports: function(fn)  { console.log(arguments);
      return mapObjAsync(this.ports, fn);
    },
    recognize: function(url)  { console.log(arguments);
      return this.registry.recognize(url);
    },
    renavigate: function()  { console.log(arguments);
      var renavigateDestination = this.previousUrl || this.lastNavigationAttempt;
      if (!this.navigating && renavigateDestination) {
        return this.navigate(renavigateDestination);
      } else {
        return $q.when();
      }
    },
    generate: function(name, params)  { console.log(arguments);
      return this.registry.generate(name, params);
    }
  }, {});
Object.defineProperty(Router, "parameters", {get: function()  { console.log(arguments);
      return [[Grammar], [Pipeline], [], []];
    }});
Object.defineProperty(Router.prototype.generate, "parameters", {get: function()  { console.log(arguments);
      return [[$traceurRuntime.type.string], []];
    }});
var RootRouter = function RootRouter(grammar, pipeline)  { console.log(arguments);
    superCall(this, $RootRouter.prototype, "constructor", [grammar, pipeline, null, '/']);
  };
var $RootRouter = RootRouter;
(createClass)(RootRouter, {}, {}, Router);
Object.defineProperty(RootRouter, "parameters", {get: function()  { console.log(arguments);
      return [[Grammar], [Pipeline]];
    }});
var ChildRouter = function ChildRouter(parent, name)  { console.log(arguments);
    superCall(this, $ChildRouter.prototype, "constructor", [parent.registry, parent.pipeline, parent, name]);
    this.parent = parent;
  };
var $ChildRouter = ChildRouter;
(createClass)(ChildRouter, {}, {}, Router);
function forEach(obj, fn)  { console.log(arguments);
    Object.keys(obj).forEach((function(key)  { console.log(arguments);
      return fn(obj[key], key);
    }));
  }
function mapObjAsync(obj, fn)  { console.log(arguments);
    return $q.all(mapObj(obj, fn));
  }
function mapObj(obj, fn)  { console.log(arguments);
    var result = [];
    Object.keys(obj).forEach((function(key)  { console.log(arguments);
      return result.push(fn(obj[key], key));
    }));
    return result;
  }
function boolToPromise(value)  { console.log(arguments);
    return value ? $q.when(value) : $q.reject();
  }
return new RootRouter($$grammar, $$pipeline);
}]);


angular.module('ngNewRouter').factory('$$grammar', ['$q', function ($q)  { console.log(arguments);
/*
 * artisinal, handcrafted subset of the traceur runtime for picky webdevs
 */

var $defineProperty = Object.defineProperty,
    $defineProperties = Object.defineProperties,
    $create = Object.create,
    $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    $getOwnPropertyNames = Object.getOwnPropertyNames,
    $getPrototypeOf = Object.getPrototypeOf;

function createClass(ctor, object, staticObject, superClass)  { console.log(arguments);
  $defineProperty(object, 'constructor', {
    value: ctor,
    configurable: true,
    enumerable: false,
    writable: true
  });
  if (arguments.length > 3) {
    if (typeof superClass === 'function')
      ctor.__proto__ = superClass;
    ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
  } else {
    ctor.prototype = object;
  }
  $defineProperty(ctor, 'prototype', {
    configurable: false,
    writable: false
  });
  return $defineProperties(ctor, getDescriptors(staticObject));
}

function getProtoParent(superClass)  { console.log(arguments);
  if (typeof superClass === 'function')  { console.log(arguments);
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null)
      return superClass.prototype;
    throw new TypeError('super prototype must be an Object or null');
  }
  if (superClass === null)
    return null;
  throw new TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
}

function getDescriptors(object)  { console.log(arguments);
  var descriptors = {};
  var names = $getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $getOwnPropertyDescriptor(object, name);
  }
  // TODO: someday you might use symbols and you'll have to re-evaluate
  //       your life choices that led to the creation of this file

  // var symbols = getOwnPropertySymbols(object);
  // for (var i = 0; i < symbols.length; i++) {
  //   var symbol = symbols[i];
  //   descriptors[$traceurRuntime.toProperty(symbol)] = $getOwnPropertyDescriptor(object, $traceurRuntime.toProperty(symbol));
  // }
  return descriptors;
}
function superDescriptor(homeObject, name)  { console.log(arguments);
  var proto = $getPrototypeOf(homeObject);
  do {
    var result = $getOwnPropertyDescriptor(proto, name);
    if (result)
      return result;
    proto = $getPrototypeOf(proto);
  } while (proto);
  return undefined;
}
function superCall(self, homeObject, name, args)  { console.log(arguments);
  return superGet(self, homeObject, name).apply(self, args);
}
function superGet(self, homeObject, name)  { console.log(arguments);
  var descriptor = superDescriptor(homeObject, name);
  if (descriptor) {
    if (!descriptor.get)
      return descriptor.value;
    return descriptor.get.call(self);
  }
  return undefined;
}

"use strict";
var RouteRecognizer = (function()  { console.log(arguments);
    var map = (function()  { console.log(arguments);
      function Target(path, matcher, delegate)  { console.log(arguments);
        this.path = path;
        this.matcher = matcher;
        this.delegate = delegate;
      }
      Target.prototype = {to: function(target, callback)  { console.log(arguments);
          var delegate = this.delegate;
          if (delegate && delegate.willAddRoute) {
            target = delegate.willAddRoute(this.matcher.target, target);
          }
          this.matcher.add(this.path, target);
          if (callback) {
            if (callback.length === 0) {
              throw new Error("You must have an argument in the function passed to `to`");
            }
            this.matcher.addChild(this.path, target, callback, this.delegate);
          }
          return this;
        }};
      function Matcher(target)  { console.log(arguments);
        this.routes = {};
        this.children = {};
        this.target = target;
      }
      Matcher.prototype = {
        add: function(path, handler)  { console.log(arguments);
          this.routes[path] = handler;
        },
        addChild: function(path, target, callback, delegate)  { console.log(arguments);
          var matcher = new Matcher(target);
          this.children[path] = matcher;
          var match = generateMatch(path, matcher, delegate);
          if (delegate && delegate.contextEntered) {
            delegate.contextEntered(target, match);
          }
          callback(match);
        }
      };
      function generateMatch(startingPath, matcher, delegate)  { console.log(arguments);
        return function(path, nestedCallback)  { console.log(arguments);
          var fullPath = startingPath + path;
          if (nestedCallback) {
            nestedCallback(generateMatch(fullPath, matcher, delegate));
          } else {
            return new Target(startingPath + path, matcher, delegate);
          }
        };
      }
      function addRoute(routeArray, path, handler)  { console.log(arguments);
        var len = 0;
        for (var i = 0,
            l = routeArray.length; i < l; i++) {
          len += routeArray[i].path.length;
        }
        path = path.substr(len);
        var route = {
          path: path,
          handler: handler
        };
        routeArray.push(route);
      }
      function eachRoute(baseRoute, matcher, callback, binding)  { console.log(arguments);
        var routes = matcher.routes;
        for (var path in routes) {
          if (routes.hasOwnProperty(path)) {
            var routeArray = baseRoute.slice();
            addRoute(routeArray, path, routes[path]);
            if (matcher.children[path]) {
              eachRoute(routeArray, matcher.children[path], callback, binding);
            } else {
              callback.call(binding, routeArray);
            }
          }
        }
      }
      return function(callback, addRouteCallback)  { console.log(arguments);
        var matcher = new Matcher();
        callback(generateMatch("", matcher, this.delegate));
        eachRoute([], matcher, function(route)  { console.log(arguments);
          if (addRouteCallback) {
            addRouteCallback(this, route);
          } else {
            this.add(route);
          }
        }, this);
      };
    }());
    var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
    var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    function isArray(test)  { console.log(arguments);
      return Object.prototype.toString.call(test) === "[object Array]";
    }
    function StaticSegment(string)  { console.log(arguments);
      this.string = string;
    }
    StaticSegment.prototype = {
      eachChar: function(callback)  { console.log(arguments);
        var string = this.string,
            ch;
        for (var i = 0,
            l = string.length; i < l; i++) {
          ch = string.charAt(i);
          callback({validChars: ch});
        }
      },
      regex: function()  { console.log(arguments);
        return this.string.replace(escapeRegex, '\\$1');
      },
      generate: function()  { console.log(arguments);
        return this.string;
      }
    };
    function DynamicSegment(name)  { console.log(arguments);
      this.name = name;
    }
    DynamicSegment.prototype = {
      eachChar: function(callback)  { console.log(arguments);
        callback({
          invalidChars: "/",
          repeat: true
        });
      },
      regex: function()  { console.log(arguments);
        return "([^/]+)";
      },
      generate: function(params)  { console.log(arguments);
        return params[this.name];
      }
    };
    function StarSegment(name)  { console.log(arguments);
      this.name = name;
    }
    StarSegment.prototype = {
      eachChar: function(callback)  { console.log(arguments);
        callback({
          invalidChars: "",
          repeat: true
        });
      },
      regex: function()  { console.log(arguments);
        return "(.+)";
      },
      generate: function(params)  { console.log(arguments);
        return params[this.name];
      }
    };
    function EpsilonSegment()  { console.log(arguments);}
    EpsilonSegment.prototype = {
      eachChar: function()  { console.log(arguments);},
      regex: function()  { console.log(arguments);
        return "";
      },
      generate: function()  { console.log(arguments);
        return "";
      }
    };
    function parse(route, names, types)  { console.log(arguments);
      if (route.charAt(0) === "/") {
        route = route.substr(1);
      }
      var segments = route.split("/"),
          results = [];
      for (var i = 0,
          l = segments.length; i < l; i++) {
        var segment = segments[i],
            match;
        if (match = segment.match(/^:([^\/]+)$/)) {
          results.push(new DynamicSegment(match[1]));
          names.push(match[1]);
          types.dynamics++;
        } else if (match = segment.match(/^\*([^\/]+)$/)) {
          results.push(new StarSegment(match[1]));
          names.push(match[1]);
          types.stars++;
        } else if (segment === "") {
          results.push(new EpsilonSegment());
        } else {
          results.push(new StaticSegment(segment));
          types.statics++;
        }
      }
      return results;
    }
    function State(charSpec)  { console.log(arguments);
      this.charSpec = charSpec;
      this.nextStates = [];
    }
    State.prototype = {
      get: function(charSpec)  { console.log(arguments);
        var nextStates = this.nextStates;
        for (var i = 0,
            l = nextStates.length; i < l; i++) {
          var child = nextStates[i];
          var isEqual = child.charSpec.validChars === charSpec.validChars;
          isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;
          if (isEqual) {
            return child;
          }
        }
      },
      put: function(charSpec)  { console.log(arguments);
        var state;
        if (state = this.get(charSpec)) {
          return state;
        }
        state = new State(charSpec);
        this.nextStates.push(state);
        if (charSpec.repeat) {
          state.nextStates.push(state);
        }
        return state;
      },
      match: function(ch)  { console.log(arguments);
        var nextStates = this.nextStates,
            child,
            charSpec,
            chars;
        var returned = [];
        for (var i = 0,
            l = nextStates.length; i < l; i++) {
          child = nextStates[i];
          charSpec = child.charSpec;
          if (typeof(chars = charSpec.validChars) !== 'undefined') {
            if (chars.indexOf(ch) !== -1) {
              returned.push(child);
            }
          } else if (typeof(chars = charSpec.invalidChars) !== 'undefined') {
            if (chars.indexOf(ch) === -1) {
              returned.push(child);
            }
          }
        }
        return returned;
      }
    };
    function sortSolutions(states)  { console.log(arguments);
      return states.sort(function(a, b)  { console.log(arguments);
        if (a.types.stars !== b.types.stars) {
          return a.types.stars - b.types.stars;
        }
        if (a.types.stars) {
          if (a.types.statics !== b.types.statics) {
            return b.types.statics - a.types.statics;
          }
          if (a.types.dynamics !== b.types.dynamics) {
            return b.types.dynamics - a.types.dynamics;
          }
        }
        if (a.types.dynamics !== b.types.dynamics) {
          return a.types.dynamics - b.types.dynamics;
        }
        if (a.types.statics !== b.types.statics) {
          return b.types.statics - a.types.statics;
        }
        return 0;
      });
    }
    function recognizeChar(states, ch)  { console.log(arguments);
      var nextStates = [];
      for (var i = 0,
          l = states.length; i < l; i++) {
        var state = states[i];
        nextStates = nextStates.concat(state.match(ch));
      }
      return nextStates;
    }
    var oCreate = Object.create || function(proto)  { console.log(arguments);
      function F()  { console.log(arguments);}
      F.prototype = proto;
      return new F();
    };
    function RecognizeResults(queryParams)  { console.log(arguments);
      this.queryParams = queryParams || {};
    }
    RecognizeResults.prototype = oCreate({
      splice: Array.prototype.splice,
      slice: Array.prototype.slice,
      push: Array.prototype.push,
      length: 0,
      queryParams: null
    });
    function findHandler(state, path, queryParams)  { console.log(arguments);
      var handlers = state.handlers,
          regex = state.regex;
      var captures = path.match(regex),
          currentCapture = 1;
      var result = new RecognizeResults(queryParams);
      for (var i = 0,
          l = handlers.length; i < l; i++) {
        var handler = handlers[i],
            names = handler.names,
            params = {};
        for (var j = 0,
            m = names.length; j < m; j++) {
          params[names[j]] = captures[currentCapture++];
        }
        result.push({
          handler: handler.handler,
          params: params,
          isDynamic: !!names.length
        });
      }
      return result;
    }
    function addSegment(currentState, segment)  { console.log(arguments);
      segment.eachChar(function(ch)  { console.log(arguments);
        var state;
        currentState = currentState.put(ch);
      });
      return currentState;
    }
    var RouteRecognizer = function()  { console.log(arguments);
      this.rootState = new State();
      this.names = {};
    };
    RouteRecognizer.prototype = {
      add: function(routes, options)  { console.log(arguments);
        var currentState = this.rootState,
            regex = "^",
            types = {
              statics: 0,
              dynamics: 0,
              stars: 0
            },
            handlers = [],
            allSegments = [],
            name;
        var isEmpty = true;
        for (var i = 0,
            l = routes.length; i < l; i++) {
          var route = routes[i],
              names = [];
          var segments = parse(route.path, names, types);
          allSegments = allSegments.concat(segments);
          for (var j = 0,
              m = segments.length; j < m; j++) {
            var segment = segments[j];
            if (segment instanceof EpsilonSegment) {
              continue;
            }
            isEmpty = false;
            currentState = currentState.put({validChars: "/"});
            regex += "/";
            currentState = addSegment(currentState, segment);
            regex += segment.regex();
          }
          var handler = {
            handler: route.handler,
            names: names
          };
          handlers.push(handler);
        }
        if (isEmpty) {
          currentState = currentState.put({validChars: "/"});
          regex += "/";
        }
        currentState.handlers = handlers;
        currentState.regex = new RegExp(regex + "$");
        currentState.types = types;
        if (name = options && options.as) {
          this.names[name] = {
            segments: allSegments,
            handlers: handlers
          };
        }
      },
      handlersFor: function(name)  { console.log(arguments);
        var route = this.names[name],
            result = [];
        if (!route) {
          throw new Error("There is no route named " + name);
        }
        for (var i = 0,
            l = route.handlers.length; i < l; i++) {
          result.push(route.handlers[i]);
        }
        return result;
      },
      hasRoute: function(name)  { console.log(arguments);
        return !!this.names[name];
      },
      generate: function(name, params)  { console.log(arguments);
        var route = this.names[name],
            output = "";
        if (!route) {
          throw new Error("There is no route named " + name);
        }
        var segments = route.segments;
        for (var i = 0,
            l = segments.length; i < l; i++) {
          var segment = segments[i];
          if (segment instanceof EpsilonSegment) {
            continue;
          }
          output += "/";
          output += segment.generate(params);
        }
        if (output.charAt(0) !== '/') {
          output = '/' + output;
        }
        if (params && params.queryParams) {
          output += this.generateQueryString(params.queryParams, route.handlers);
        }
        return output;
      },
      generateQueryString: function(params, handlers)  { console.log(arguments);
        var pairs = [];
        var keys = [];
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
        keys.sort();
        for (var i = 0,
            len = keys.length; i < len; i++) {
          key = keys[i];
          var value = params[key];
          if (value == null) {
            continue;
          }
          var pair = encodeURIComponent(key);
          if (isArray(value)) {
            for (var j = 0,
                l = value.length; j < l; j++) {
              var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
              pairs.push(arrayPair);
            }
          } else {
            pair += "=" + encodeURIComponent(value);
            pairs.push(pair);
          }
        }
        if (pairs.length === 0) {
          return '';
        }
        return "?" + pairs.join("&");
      },
      parseQueryString: function(queryString)  { console.log(arguments);
        var pairs = queryString.split("&"),
            queryParams = {};
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('='),
              key = decodeURIComponent(pair[0]),
              keyLength = key.length,
              isArray = false,
              value;
          if (pair.length === 1) {
            value = 'true';
          } else {
            if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
              isArray = true;
              key = key.slice(0, keyLength - 2);
              if (!queryParams[key]) {
                queryParams[key] = [];
              }
            }
            value = pair[1] ? decodeURIComponent(pair[1]) : '';
          }
          if (isArray) {
            queryParams[key].push(value);
          } else {
            queryParams[key] = value;
          }
        }
        return queryParams;
      },
      recognize: function(path)  { console.log(arguments);
        var states = [this.rootState],
            pathLen,
            i,
            l,
            queryStart,
            queryParams = {},
            isSlashDropped = false;
        queryStart = path.indexOf('?');
        if (queryStart !== -1) {
          var queryString = path.substr(queryStart + 1, path.length);
          path = path.substr(0, queryStart);
          queryParams = this.parseQueryString(queryString);
        }
        path = decodeURI(path);
        if (path.charAt(0) !== "/") {
          path = "/" + path;
        }
        pathLen = path.length;
        if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
          path = path.substr(0, pathLen - 1);
          isSlashDropped = true;
        }
        for (i = 0, l = path.length; i < l; i++) {
          states = recognizeChar(states, path.charAt(i));
          if (!states.length) {
            break;
          }
        }
        var solutions = [];
        for (i = 0, l = states.length; i < l; i++) {
          if (states[i].handlers) {
            solutions.push(states[i]);
          }
        }
        states = sortSolutions(solutions);
        var state = solutions[0];
        if (state && state.handlers) {
          if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
            path = path + "/";
          }
          return findHandler(state, path, queryParams);
        }
      }
    };
    RouteRecognizer.prototype.map = map;
    RouteRecognizer.VERSION = 'VERSION_STRING_PLACEHOLDER';
    return RouteRecognizer;
  }());
var CHILD_ROUTE_SUFFIX = '/*childRoute';
var Grammar = function Grammar()  { console.log(arguments);
    this.rules = {};
  };
(createClass)(Grammar, {
    config: function(name, config)  { console.log(arguments);
      if (name === 'app') {
        name = '/';
      }
      if (!this.rules[name]) {
        this.rules[name] = new CanonicalRecognizer(name);
      }
      this.rules[name].config(config);
    },
    recognize: function(url)  { console.log(arguments);
      var componentName = arguments[1] !== (void 0) ? arguments[1] : '/';
      var $__0 = this;
      if (typeof url === 'undefined') {
        return;
      }
      var componentRecognizer = this.rules[componentName];
      if (!componentRecognizer) {
        return;
      }
      var context = componentRecognizer.recognize(url);
      if (!context) {
        return;
      }
      var lastContextChunk = context[context.length - 1];
      var lastHandler = lastContextChunk.handler;
      var lastParams = lastContextChunk.params;
      var instruction = {
        viewports: {},
        params: lastParams
      };
      if (lastParams && lastParams.childRoute) {
        var childUrl = '/' + lastParams.childRoute;
        instruction.canonicalUrl = lastHandler.rewroteUrl.substr(0, lastHandler.rewroteUrl.length - (lastParams.childRoute.length + 1));
        forEach(lastHandler.components, (function(componentName, viewportName)  { console.log(arguments);
          instruction.viewports[viewportName] = $__0.recognize(childUrl, componentName);
        }));
        instruction.canonicalUrl += instruction.viewports[Object.keys(instruction.viewports)[0]].canonicalUrl;
      } else {
        instruction.canonicalUrl = lastHandler.rewroteUrl;
        forEach(lastHandler.components, (function(componentName, viewportName)  { console.log(arguments);
          instruction.viewports[viewportName] = {viewports: {}};
        }));
      }
      forEach(instruction.viewports, (function(instruction, componentName)  { console.log(arguments);
        instruction.component = lastHandler.components[componentName];
        instruction.params = lastParams;
      }));
      return instruction;
    },
    generate: function(name, params)  { console.log(arguments);
      var path = '';
      var solution;
      do {
        solution = null;
        forEach(this.rules, (function(recognizer)  { console.log(arguments);
          if (recognizer.hasRoute(name)) {
            path = recognizer.generate(name, params) + path;
            solution = recognizer;
          }
        }));
        if (!solution) {
          return '';
        }
        name = solution.name;
      } while (solution.name !== '/');
      return path;
    }
  }, {});
Object.defineProperty(Grammar.prototype.recognize, "parameters", {get: function()  { console.log(arguments);
      return [[$traceurRuntime.type.string], []];
    }});
var CanonicalRecognizer = function CanonicalRecognizer(name)  { console.log(arguments);
    this.name = name;
    this.rewrites = {};
    this.recognizer = new RouteRecognizer();
  };
(createClass)(CanonicalRecognizer, {
    config: function(mapping)  { console.log(arguments);
      var $__0 = this;
      if (mapping instanceof Array) {
        mapping.forEach((function(nav)  { console.log(arguments);
          return $__0.configOne(nav);
        }));
      } else {
        this.configOne(mapping);
      }
    },
    getCanonicalUrl: function(url)  { console.log(arguments);
      if (url[0] === '.') {
        url = url.substr(1);
      }
      if (url === '' || url[0] !== '/') {
        url = '/' + url;
      }
      forEach(this.rewrites, function(toUrl, fromUrl)  { console.log(arguments);
        if (fromUrl === '/') {
          if (url === '/') {
            url = toUrl;
          }
        } else if (url.indexOf(fromUrl) === 0) {
          url = url.replace(fromUrl, toUrl);
        }
      });
      return url;
    },
    configOne: function(mapping)  { console.log(arguments);
      var $__0 = this;
      if (mapping.redirectTo) {
        if (this.rewrites[mapping.path]) {
          throw new Error('"' + mapping.path + '" already maps to "' + this.rewrites[mapping.path] + '"');
        }
        this.rewrites[mapping.path] = mapping.redirectTo;
        return;
      }
      if (mapping.component) {
        if (mapping.components) {
          throw new Error('A route config should have either a "component" or "components" property, but not both.');
        }
        mapping.components = mapping.component;
        delete mapping.component;
      }
      if (typeof mapping.components === 'string') {
        mapping.components = {default: mapping.components};
      }
      var aliases;
      if (mapping.as) {
        aliases = [mapping.as];
      } else {
        aliases = mapObj(mapping.components, (function(componentName, viewportName)  { console.log(arguments);
          return viewportName + ':' + componentName;
        }));
        if (mapping.components.default) {
          aliases.push(mapping.components.default);
        }
      }
      aliases.forEach((function(alias)  { console.log(arguments);
        return $__0.recognizer.add([{
          path: mapping.path,
          handler: mapping
        }], {as: alias});
      }));
      var withChild = copy(mapping);
      withChild.path += CHILD_ROUTE_SUFFIX;
      this.recognizer.add([{
        path: withChild.path,
        handler: withChild
      }]);
    },
    recognize: function(url)  { console.log(arguments);
      var canonicalUrl = this.getCanonicalUrl(url);
      var context = this.recognizer.recognize(canonicalUrl);
      if (context) {
        context[0].handler.rewroteUrl = canonicalUrl;
      }
      return context;
    },
    generate: function(name, params)  { console.log(arguments);
      return this.recognizer.generate(name, params);
    },
    hasRoute: function(name)  { console.log(arguments);
      return this.recognizer.hasRoute(name);
    }
  }, {});
function copy(obj)  { console.log(arguments);
    return JSON.parse(JSON.stringify(obj));
  }
function forEach(obj, fn)  { console.log(arguments);
    Object.keys(obj).forEach((function(key)  { console.log(arguments);
      return fn(obj[key], key);
    }));
  }
function mapObj(obj, fn)  { console.log(arguments);
    var result = [];
    Object.keys(obj).forEach((function(key)  { console.log(arguments);
      return result.push(fn(obj[key], key));
    }));
    return result;
  }
return new Grammar();
}]);
