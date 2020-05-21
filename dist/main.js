/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/badShip.js":
/*!************************!*\
  !*** ./src/badShip.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ \"./src/ship.js\");\n\n\nclass BadShip extends _ship__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(game, settings) {\n    super(game, settings);\n    this.shapes = [\n      {\n        x: 20,\n        y: 32,\n        width: 60,\n        height: 8,\n        color: \"white\",\n      },\n      {\n        x: 40,\n        y: 28,\n        width: 20,\n        height: 20,\n        color: \"white\",\n      },\n      {\n        x: 20,\n        y: 20,\n        width: 12,\n        height: 20,\n        color: \"white\",\n      },\n      {\n        x: 68,\n        y: 20,\n        width: 12,\n        height: 20,\n        color: \"white\",\n      },\n    ];\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (BadShip);\n\n//# sourceURL=webpack:///./src/badShip.js?");

/***/ }),

/***/ "./src/bullet.js":
/*!***********************!*\
  !*** ./src/bullet.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _moveable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moveable */ \"./src/moveable.js\");\n\n\nclass Bullet extends _moveable__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(owner, settings) {\n    super(settings);\n    this.shapes = [\n      {\n        x: 20,\n        y: 10,\n        width: 5,\n        height: 20,\n      },\n    ];\n    this.owner = owner;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Bullet);\n\n//# sourceURL=webpack:///./src/bullet.js?");

/***/ }),

/***/ "./src/canvas/index.js":
/*!*****************************!*\
  !*** ./src/canvas/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Canvas {\n  constructor(id) {\n    // #id of html canvas the game will be drawn onto\n    this.id = id;\n  }\n\n  getWidth() {\n    return this.htmlCanvas.width;\n  }\n\n  getHeight() {\n    return this.htmlCanvas.height;\n  }\n\n  init() {\n    this.htmlCanvas = document.getElementById(this.id);\n    // The context that will be used ot drawn to the canvas\n    this.context = this.htmlCanvas.getContext(\"2d\");\n  }\n\n  getContext() {\n    if (!this.context) {\n      this.init();\n    }\n    return this.context;\n  }\n\n  clearShape(shape) {\n    const context = this.getContext();\n    context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);\n    context.clearRect(shape.x, shape.y, shape.width, shape.height);\n}\n\n  fillShape(shape) {\n    const context = this.getContext();\n    context.fillStyle = shape.color ? shape.color : \"green\";\n    context.fillRect(shape.x, shape.y, shape.width, shape.height);\n  }\n\n  remove(shapes) {\n    for (let shape of shapes) {\n      this.clearShape(shape);\n    }\n  }\n\n  draw(shapes) {\n    // Remove from canvas\n    for (let shape of shapes) {\n      this.clearShape(shape);\n    }\n    // Draw in new position\n    for (let shape of shapes) {\n      this.fillShape(shape);\n    }\n  }\n\n  isAtExtremity(direction, shapes) {\n    switch (direction) {\n      case \"left\":\n        const leftMostXValue = Math.floor(...shapes.map((shape) => shape.x));\n        return leftMostXValue <= 0;\n\n      case \"right\":\n        const rightMostXValue = Math.max(\n          ...shapes.map((shape) => shape.x + shape.width)\n        );\n        return rightMostXValue >= this.getWidth();\n\n      case \"top\":\n        const topMostYValue = Math.max(...shapes.map((shape) => shape.y));\n        return topMostYValue <= 0;\n\n      case \"bottom\":\n        const bottomMostYValue = Math.max(\n          ...shapes.map((shape) => shape.y + shape.height)\n        );\n        return bottomMostYValue >= this.getHeight();\n\n      default:\n        break;\n    }\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Canvas);\n\n\n//# sourceURL=webpack:///./src/canvas/index.js?");

/***/ }),

/***/ "./src/game/animation.js":
/*!*******************************!*\
  !*** ./src/game/animation.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass GameAnimation {\n  constructor() {\n    this.lastActionFrame = {};\n  }\n\n  runFrame(frameStartTime, actions, shouldCancelAnimation) {\n    // Request the next frame\n    const animation = window.requestAnimationFrame((newFrameStartTime) =>\n      this.runFrame(newFrameStartTime, actions, shouldCancelAnimation)\n    );\n\n    // Test if milliseconds between time last frame for this action ran and now is greater than how often\n    // this action should run. If yes, run the action.\n    actions.forEach((def) => {\n      // If there is no last run time set it and run, it must be the beginning of the game\n      if (!this.lastActionFrame[def.id]) {\n        this.lastActionFrame[def.id] = frameStartTime;\n        def.action();\n      } else if (frameStartTime - this.lastActionFrame[def.id] > def.ms) {\n        this.lastActionFrame[def.id] = frameStartTime;\n        def.action();\n      }\n    });\n\n    // Check game state - Check at start and end of frame?\n    // Possible cancel next animation frame if game has ended\n    if (shouldCancelAnimation()) {\n      window.cancelAnimationFrame(animation);\n    }\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (GameAnimation);\n\n\n//# sourceURL=webpack:///./src/game/animation.js?");

/***/ }),

/***/ "./src/game/getSetting.js":
/*!********************************!*\
  !*** ./src/game/getSetting.js ***!
  \********************************/
/*! exports provided: getSettingFor, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getSettingFor\", function() { return getSettingFor; });\nconst getSetting = (setting, data) => {\n  switch (setting) {\n    case \"numRocks\":\n    case \"rockWidth\":\n    case \"rockWhiteSpace\":\n    case \"badShipRows\":\n    case \"badShipsPerRow\":\n    case \"badShipsBulletsPerSecond\":\n    case \"badShipFramerate\":\n    case \"goodBulletFramerate\":\n    case \"badBulletFramerate\":\n      return data[\"game\"][setting];\n\n    case \"continuousFire\":\n      return getSettingFor(\"goodShip\", data)[setting];\n\n    case \"rockHeight\":\n    case \"rockWidth\":\n    case \"rockParticleWidth\":\n    case \"rockParticleHeight\":\n      return getSettingFor(\"rock\", data)[setting];\n  }\n};\n\nconst getSettingFor = (type, data) => {\n    return data[type];\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (getSetting);\n\n\n//# sourceURL=webpack:///./src/game/getSetting.js?");

/***/ }),

/***/ "./src/game/helpers.js":
/*!*****************************!*\
  !*** ./src/game/helpers.js ***!
  \*****************************/
/*! exports provided: isBadShipBullet, isGoodShipBullet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isBadShipBullet\", function() { return isBadShipBullet; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isGoodShipBullet\", function() { return isGoodShipBullet; });\n/* harmony import */ var _badShip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../badShip */ \"./src/badShip.js\");\n/* harmony import */ var _goodShip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../goodShip */ \"./src/goodShip.js\");\n\n\n\nconst isBadShipBullet = bullet => bullet.owner instanceof _badShip__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n\nconst isGoodShipBullet = bullet => bullet.owner instanceof _goodShip__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\n\n\n//# sourceURL=webpack:///./src/game/helpers.js?");

/***/ }),

/***/ "./src/game/index.js":
/*!***************************!*\
  !*** ./src/game/index.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SpaceInvadersGame; });\n/* harmony import */ var _badShip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../badShip */ \"./src/badShip.js\");\n/* harmony import */ var _bullet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../bullet */ \"./src/bullet.js\");\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../canvas */ \"./src/canvas/index.js\");\n/* harmony import */ var _goodShip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../goodShip */ \"./src/goodShip.js\");\n/* harmony import */ var _levels__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../levels */ \"./src/levels/index.js\");\n/* harmony import */ var _rock__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../rock */ \"./src/rock.js\");\n/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./animation */ \"./src/game/animation.js\");\n/* harmony import */ var _getSetting__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getSetting */ \"./src/game/getSetting.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers */ \"./src/game/helpers.js\");\n\n\n\n\n\n\n\n\n\n\nclass SpaceInvadersGame {\n  constructor(canvasId) {\n    // The canvas take is responsible for drawing the game\n    this.canvas = new _canvas__WEBPACK_IMPORTED_MODULE_2__[\"default\"](canvasId);\n    // TOOD: Document\n    this.gameIntervals = [];\n    // The bad ships that are in play\n    this.badShips = [];\n    // The good ships (or players) that in play\n    this.players = [];\n    // The bullets that in play\n    this.bullets = [];\n    // The rocks that are in play\n    this.rocks = [];\n    // The game level being played\n    this.currentLevel = 0;\n    // The current game mode - what is game mode?\n    this.currentLevelMode = \"standard\";\n    // Configuration for game levels\n    this.levelData = [..._levels__WEBPACK_IMPORTED_MODULE_4__[\"default\"]];\n\n    this.frameActions = [\n      {\n        id: Symbol(\"moveGoodBullets\"),\n        ms: 1000 / this.getSetting(\"goodBulletFramerate\"),\n        action: () => this.moveBullets(\"goodShip\"),\n      },\n      {\n        id: Symbol(\"shootBadBullets\"),\n        ms: 1000,\n        action: () => this.shootBadBullets(),\n      },\n      {\n        id: Symbol(\"moveBadBullets\"),\n        ms: 1000 / this.getSetting(\"badBulletFramerate\"),\n        action: () => this.moveBullets(\"badShip\"),\n      },\n      {\n        id: Symbol(\"moveBadShips\"),\n        ms: 1000 / this.getSetting(\"badShipFramerate\"),\n        action: () => this.moveBadShips(),\n      },\n      {\n        id: Symbol(\"checkForCollisions\"),\n        // Run on every frame\n        ms: 0,\n        action: () => this.checkForCollisions(),\n      },\n    ];\n\n    // METHODS\n    // this.newGame = newGame.bind(this);\n  }\n\n  getSetting(setting) {\n    return Object(_getSetting__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(\n      setting,\n      this.levelData[this.currentLevel][this.currentLevelMode]\n    );\n  }\n\n  getSettingsFor(objectType) {\n    return Object(_getSetting__WEBPACK_IMPORTED_MODULE_7__[\"getSettingFor\"])(\n      objectType,\n      this.levelData[this.currentLevel][this.currentLevelMode]\n    );\n  }\n\n  newGame() {\n    this.endGame();\n    this.gameState = \"NEW_GAME\";\n    this.players.push(new _goodShip__WEBPACK_IMPORTED_MODULE_3__[\"default\"](this, this.getSettingsFor(\"goodShip\")));\n    this.startGame();\n  }\n\n  endGame() {\n    // this.clearGameIntervals();\n    this.destroyGoodShips();\n    this.destroyRocks();\n    this.destroyBullets();\n    this.destroyBadShips();\n  }\n\n  startGame() {\n    this.gameState = \"START_GAME\";\n    this.initialiseBadShips();\n    for (let goodShip of this.players) {\n      this.initialiseGoodShip(goodShip);\n    }\n    this.initialiseRocks();\n    this.runGame();\n  }\n\n  gameWon() {\n    // this.clearGameIntervals();\n    this.destroyBullets();\n    this.setGameMessage();\n  }\n\n  // TODO: How to handle the movement of the good ship.\n  // Run a counter of moves for the good ship and move them, all at once? Need a framerate?\n  //   - Max moves for goodship per frame = 1 so just need bool for key press -> move\n  startAnimation() {\n    // Pass in a callback to the game to check game state on each frame\n    // The frame can you use this to know when to stop animating\n    // The game can use this to know when the animation is stopped and game status needs to be managed\n    const animation = new _animation__WEBPACK_IMPORTED_MODULE_6__[\"default\"]();\n    window.requestAnimationFrame((frameStartTime) =>\n      animation.runFrame(frameStartTime, this.frameActions, () =>\n        this.checkGameState()\n      )\n    );\n  }\n\n  checkGameState() {\n    switch (this.gameState) {\n      case \"LEVEL_WON\":\n        if (this.currentLevel === this.levelData.length - 1) {\n          this.gameState = \"GAME_WON\";\n          this.gameWon();\n          // Should cancel animation\n          return true;\n          // Check highscore status\n        } else {\n          this.nextLevel();\n          // Should cancel animation\n          return true;\n        }\n\n      case \"PLAYER_DEAD\":\n        break;\n\n      default:\n        break;\n    }\n  }\n\n  runGame() {\n    this.gameState = \"GAME_RUNNING\";\n    this.startAnimation();\n  }\n\n  nextLevel() {\n    this.gameState = \"NEXT_LEVEL\";\n    this.currentLevel++;\n    this.setGameMessage();\n    this.endGame();\n    setTimeout(() => {\n      this.clearGameMessage();\n      this.startGame();\n    }, 5000);\n  }\n\n  clearGameIntervals() {\n    for (let interval of this.gameIntervals) {\n      clearInterval(interval);\n    }\n  }\n\n  setGameMessage() {\n    switch (this.gameState) {\n      case \"GAME_WON\":\n        gameMessage.textContent = \"Well done, you have won!\";\n        break;\n\n      case \"NEXT_LEVEL\":\n        gameMessage.textContent = `Level ${this.currentLevel + 1}`;\n        break;\n    }\n  }\n\n  clearGameMessage() {\n    gameMessage.textContent = \"\";\n  }\n\n  updateScore(player, delta) {\n    player.updateScore(delta);\n    score.textContent = player.score;\n  }\n\n  moveObject(object, deltaX, deltaY) {\n    object.move(deltaX, deltaY);\n  }\n\n  drawObject(object) {\n    let shapes = object.shapes;\n    if (object instanceof _rock__WEBPACK_IMPORTED_MODULE_5__[\"default\"]) {\n      object.getShapes();\n    }\n    this.canvas.draw(shapes);\n  }\n\n  destroyObject(object) {\n    switch (true) {\n      // Rocks damage themselves - this will remove an entire rock from the game\n      case object instanceof _rock__WEBPACK_IMPORTED_MODULE_5__[\"default\"]:\n        this.canvas.remove(object.shapes);\n\n        if (this.gameState == \"GAME_RUNNING\") {\n          let rockIndex = this.rocks.indexOf(object);\n          this.rocks.splice(rockIndex, 1);\n        }\n        break;\n\n      case object instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__[\"default\"]:\n        this.canvas.remove(object.shapes);\n        object.owner.bulletInPlay = false;\n        object.owner.bullet = \"\";\n\n        if (this.gameState === \"GAME_RUNNING\") {\n          let bulletIndex = this.bullets.indexOf(object);\n          this.bullets.splice(bulletIndex, 1);\n        }\n        break;\n\n      case object instanceof _badShip__WEBPACK_IMPORTED_MODULE_0__[\"default\"]:\n        this.canvas.remove(object.shapes);\n        // Find badShip in this.badShips and remove\n        for (let i = 0; i < this.badShips.length; i++) {\n          if (this.badShips[i].indexOf(object) >= 0) {\n            if (this.gameState === \"GAME_RUNNING\") {\n              let badShipIndex = this.badShips[i].indexOf(object);\n              this.badShips[i].splice(badShipIndex, 1);\n            }\n            break;\n          }\n        }\n        break;\n\n      case object instanceof _goodShip__WEBPACK_IMPORTED_MODULE_3__[\"default\"]:\n        switch (this.gameState) {\n          case \"GAME_WON\":\n            break;\n\n          case \"LEVEL_WON\":\n            break;\n\n          case \"GAME_RUNNING\":\n            this.canvas.remove(object.shapes);\n            object.destroy();\n            let goodShipIndex = this.players.indexOf(object);\n            this.players.splice(goodShipIndex, 1);\n            break;\n\n          default:\n            break;\n        }\n    }\n  }\n\n  testCollision() {\n    let testShip = new _goodShip__WEBPACK_IMPORTED_MODULE_3__[\"default\"](this, this.getSettingsFor(\"goodShip\"));\n    this.moveObject(testShip, 0, 125);\n    this.drawObject(testShip);\n    this.isColliding(testShip, this.players[0]);\n  }\n\n  isColliding(object1, object2) {\n    let colliding = false;\n\n    for (let i = 0; i < object1.shapes.length; i++) {\n      for (let j = 0; j < object2.shapes.length; j++) {\n        if (\n          !(\n            object1.shapes[i].x >\n              object2.shapes[j].x + object2.shapes[j].width ||\n            object1.shapes[i].x + object1.shapes[i].width <\n              object2.shapes[j].x ||\n            object1.shapes[i].y >\n              object2.shapes[j].y + object2.shapes[j].height ||\n            object1.shapes[i].y + object1.shapes[i].height < object2.shapes[j].y\n          )\n        ) {\n          colliding = true;\n          break;\n        }\n      }\n      if (colliding) {\n        break;\n      }\n    }\n\n    return colliding;\n  }\n\n  checkForCollisions() {\n    for (let bullet of this.bullets) {\n      let collision = false;\n\n      // TODO: Rocks only (visibly) take damage after 5 hits - why?????\n      for (let rock of this.rocks) {\n        if (!this.isColliding(bullet, rock)) {\n          continue;\n        }\n        // bullet + rock colliding\n        let shape = rock.findDamageFrom(bullet);\n        if (!shape) {\n          throw new Error(\"something has gone wrong, check the logging\");\n        }\n        this.destroyObject(bullet);\n        this.canvas.remove([shape]);\n        collision = true;\n        break;\n      }\n      if (collision) {\n        continue;\n      }\n\n      for (let row of this.badShips) {\n        for (let badShip of row) {\n          if (this.isColliding(bullet, badShip)) {\n            if (bullet.owner instanceof _badShip__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) {\n              this.drawObject(badShip);\n              continue;\n            } else if (bullet.owner instanceof _goodShip__WEBPACK_IMPORTED_MODULE_3__[\"default\"]) {\n              // goodShip bullet + badShip colliding\n              this.destroyObject(badShip);\n              this.destroyObject(bullet);\n              this.updateScore(bullet.owner, 100);\n\n              let badShipCount = 0;\n              for (row of this.badShips) {\n                badShipCount += row.length;\n              }\n\n              this.gameState =\n                badShipCount === 0 ? \"LEVEL_WON\" : this.gameState;\n            }\n            collision = true;\n            break;\n          } else {\n            continue;\n          }\n        }\n        if (collision) {\n          break;\n        }\n      }\n\n      if (collision) {\n        continue;\n      }\n\n      for (let goodShip of this.players) {\n        if (this.isColliding(bullet, goodShip)) {\n          if (bullet.owner instanceof _badShip__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) {\n            // badShip bullet + goodShip colliding\n            this.destroyObject(goodShip);\n            this.destroyObject(bullet);\n\n            goodShip.loseLife();\n\n            if (!goodShip.isDead()) {\n              this.initialiseGoodShip(goodship);\n            } else {\n              this.gameState = \"PLAYER_DEAD\";\n            }\n          } else if (bullet.owner instanceof _goodShip__WEBPACK_IMPORTED_MODULE_3__[\"default\"]) {\n            // do nothing - this shouldnt be possible\n            this.drawObject(goodShip);\n            continue;\n          }\n          collision = true;\n          break;\n        } else {\n          continue;\n        }\n      }\n\n      if (collision) {\n        continue;\n      }\n\n      if (\n        this.canvas.isAtExtremity(\"top\", bullet.shapes) ||\n        this.canvas.isAtExtremity(\"bottom\", bullet.shapes)\n      ) {\n        this.destroyObject(bullet);\n      }\n    }\n\n    for (let row of this.badShips) {\n      for (let badShip of row) {\n        for (let rock of this.rocks) {\n          if (this.isColliding(badShip, rock)) {\n            // badShip + rock colliding\n            // damage rock precisely where positions intersect\n          } else {\n            continue;\n          }\n        }\n      }\n    }\n  }\n\n  // Draw a grid of badShips\n  initialiseBadShips() {\n    for (let i = 0; i < this.getSetting(\"badShipRows\"); i++) {\n      // Loop for number of rows required\n      this.badShips[i] = []; // Initialise row in array\n      for (let j = 0; j < this.getSetting(\"badShipsPerRow\"); j++) {\n        // Loop for ships required on each row\n        let newShip = new _badShip__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this, this.getSettingsFor(\"badShip\"));\n        this.moveObject(\n          newShip,\n          newShip.width * j + 5,\n          newShip.height * i + 150\n        ); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter\n        this.drawObject(newShip);\n        this.badShips[i].push(newShip);\n      }\n    }\n  }\n\n  destroyBadShips() {\n    for (let row of this.badShips) {\n      for (let ship of row) {\n        this.destroyObject(ship);\n      }\n    }\n\n    this.badShips = [];\n  }\n\n  initialiseGoodShip(goodShip) {\n    goodShip.addEventListeners();\n    // Draw in centre of canvas\n    this.moveObject(\n      goodShip,\n      this.canvas.getWidth() / 2 - goodShip.width / 2,\n      this.canvas.getHeight() - (goodShip.height + 10)\n    );\n    this.drawObject(goodShip);\n  }\n\n  destroyGoodShips() {\n    for (let ship of this.players) {\n      this.destroyObject(ship);\n    }\n\n    this.players = [];\n  }\n\n  // Lower levels will have a central rock protecting goodPlayer spawn point\n  // Higher levels will not have a central\n  // 1. Draw rock in the middle\n  // 2. Draw rock to left offset n\n  // 3. Draw rock to right offset -n\n  // 4. Draw rock to left offset n+1\n  // 5. Draw rock to right offset -n+1\n  // Repeat 2-5\n  initialiseRocks() {\n    const canvasCentre = this.canvas.getWidth() / 2;\n    const xValueOfMiddleRock = canvasCentre - this.getSetting(\"rockWidth\") / 2;\n    let rockPair = 1;\n\n    for (let i = 0; i < this.getSetting(\"numRocks\"); i++) {\n      let rock = new _rock__WEBPACK_IMPORTED_MODULE_5__[\"default\"](\n        this.getSetting(\"rockWidth\"),\n        this.getSettingsFor(\"rock\")\n      );\n\n      // First rock is in the middle\n      if (i === 0) {\n        rock.move(xValueOfMiddleRock, 0);\n      } else {\n        // All other rocks are drawn in pairs with an equal offset but alternatig\n        // between positive and negative.\n        const offSet = i % 2 === 0 ? rockPair : -rockPair;\n\n        // This works but I cannot remember why\n        const deltaX =\n          xValueOfMiddleRock +\n          (offSet * this.getSetting(\"rockWidth\") +\n            offSet *\n              this.getSetting(\"rockWidth\") *\n              this.getSetting(\"rockWhiteSpace\"));\n        rock.move(deltaX, 0);\n        console.log(\"drawing non middle rock\", offSet, rock);\n        rockPair = i % 2 === 0 ? rockPair + 1 : rockPair;\n      }\n\n      this.rocks.push(rock);\n      this.drawObject(rock);\n    }\n  }\n\n  destroyRocks() {\n    for (let rock of this.rocks) {\n      this.destroyObject(rock);\n    }\n\n    this.rocks = [];\n  }\n\n  createBullet(ship) {\n    let bullet = new _bullet__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.getSettingsFor(\"bullet\"));\n    bullet.owner = ship;\n    ship.bulletInPlay = true;\n    this.bullets.push(bullet);\n    return bullet;\n  }\n\n  destroyBullets() {\n    for (let bullet of this.bullets) {\n      this.destroyObject(bullet);\n    }\n\n    this.bullets = [];\n  }\n\n  moveBadShips() {\n    for (let row of this.badShips) {\n      // As badShips are destroyed rows become empty.\n      if (row.length > 0) {\n        let firstShip = row[0];\n        let lastShip = row[row.length - 1];\n        let maxShipHeight = 40; //Math.max(row.map(ship => ship.height));\n        let deltaX = 0;\n        let deltaY = 0;\n\n        // Ships have hit left edge of canvas, deltaX needs to be +1\n        if (this.canvas.isAtExtremity(\"left\", firstShip.shapes)) {\n          this.badShipDirection = \"right\";\n          deltaY = 10;\n          // Ships have hit right side of canvas, deltaX needs to be -1\n        } else if (this.canvas.isAtExtremity(\"right\", lastShip.shapes)) {\n          this.badShipDirection = \"left\";\n          deltaY = 10;\n        }\n\n        deltaX = this.badShipDirection === \"right\" ? 1 : -1;\n\n        for (let ship of row) {\n          this.moveObject(ship, deltaX, deltaY);\n          this.drawObject(ship);\n        }\n      }\n    }\n  }\n\n  moveBullets(ownerType) {\n    switch (ownerType) {\n      case \"badShip\":\n        this.bullets\n          .filter((x) => Object(_helpers__WEBPACK_IMPORTED_MODULE_8__[\"isBadShipBullet\"])(x))\n          .forEach((y) => {\n            // Move the bullet down the screen\n            this.moveObject(y, 0, 5);\n            this.drawObject(y);\n          });\n        break;\n\n      case \"goodShip\":\n        this.bullets\n          .filter((x) => Object(_helpers__WEBPACK_IMPORTED_MODULE_8__[\"isGoodShipBullet\"])(x))\n          .forEach((y) => {\n            // Move the bullet up the screen\n            this.moveObject(y, 0, -5);\n            this.drawObject(y);\n          });\n        break;\n\n      default:\n        break;\n    }\n  }\n\n  // shoot bullets from X random bad ships\n  shootBadBullets() {\n    for (let i = 1; i <= this.getSetting(\"badShipsBulletsPerSecond\"); i++) {\n      let rowIndex = Math.floor(Math.random() * this.badShips.length);\n      let shipIndex = Math.floor(\n        Math.random() * this.badShips[rowIndex].length\n      );\n      let ship = this.badShips[rowIndex][shipIndex];\n      // badShip may have already been destroyed\n      if (ship) {\n        ship.fireBullet();\n      }\n    }\n  }\n}\n\n\n//# sourceURL=webpack:///./src/game/index.js?");

/***/ }),

/***/ "./src/goodShip.js":
/*!*************************!*\
  !*** ./src/goodShip.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ \"./src/ship.js\");\n\n\nclass GoodShip extends _ship__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(game, settings) {\n    super(game, settings);\n    this.shapes = [\n      {\n        x: 20,\n        y: 40,\n        width: 60,\n        height: 20,\n        color: \"#21c521\",\n      },\n      {\n        x: 40,\n        y: 20,\n        width: 20,\n        height: 20,\n        color: \"#21c521\",\n      },\n      {\n        x: 20,\n        y: 55,\n        width: 20,\n        height: 20,\n        color: \"#21c521\",\n      },\n      {\n        x: 60,\n        y: 55,\n        width: 20,\n        height: 20,\n        color: \"#21c521\",\n      },\n    ];\n    this.score = 0;\n    this.lives = 3;\n    this.shootTrigger = \"Space\";\n    this.handleKeyDown = this.handleKeyDown.bind(this);\n    this.handleKeyUp = this.handleKeyUp.bind(this);\n  }\n\n  destroy() {\n    for (let interval of this.intervals) {\n      clearInterval(interval);\n      removeEventListener(\"keydown\", this.handleKeyDown);\n      removeEventListener(\"keyup\", this.handleKeyUp);\n    }\n  }\n\n  updateScore(delta) {\n    this.score += delta;\n  }\n\n  loseLife() {\n    this.lives -= 1;\n  }\n\n  gainLife() {\n    this.lives += 1;\n  }\n\n  isDead() {\n    return this.lives > 0;\n  }\n\n  addEventListeners() {\n    this.intervals = [];\n    window.addEventListener(\"keydown\", this.handleKeyDown);\n    window.addEventListener(\"keyup\", this.handleKeyUp);\n  }\n\n  handleKeyDown(event) {\n    event.preventDefault();\n    if (event.code === this.shootTrigger) {\n      this.fireBullet();\n      if (!this.intervals[event.keyCode]) {\n        this.intervals[event.keyCode] = setInterval(\n          () => this.fireBullet(),\n          100\n        );\n      }\n    } else if (event.code === \"ArrowLeft\") {\n      if (!this.intervals[event.keyCode]) {\n        this.intervals[event.keyCode] = setInterval(() => {\n          this.game.moveObject(this, -1, 0);\n          this.game.drawObject(this);\n        }, 1000 / 300);\n      }\n    } else if (event.code === \"ArrowRight\") {\n      if (!this.intervals[event.keyCode]) {\n        this.intervals[event.keyCode] = setInterval(() => {\n          this.game.moveObject(this, 1, 0);\n          this.game.drawObject(this);\n        }, 1000 / 300);\n      }\n    }\n  }\n\n  handleKeyUp(event) {\n    event.preventDefault();\n    clearInterval(this.intervals[event.keyCode]);\n    this.intervals[event.keyCode] = false;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (GoodShip);\n\n//# sourceURL=webpack:///./src/goodShip.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game/index.js\");\n\n\nlet game = new _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('game-canvas');\nlet newGameButton = document.getElementById('new-game');\nlet gameMessage = document.querySelector('.game-message');\nlet score = document.querySelector('.score');\n\nnewGameButton.addEventListener('click', () => {\n    game.newGame();\n})\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/levels/index.js":
/*!*****************************!*\
  !*** ./src/levels/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _levelOne__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./levelOne */ \"./src/levels/levelOne.js\");\n/* harmony import */ var _levelTwo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./levelTwo */ \"./src/levels/levelTwo.js\");\n\n\n\nconst levels = [_levelOne__WEBPACK_IMPORTED_MODULE_0__[\"default\"],  _levelTwo__WEBPACK_IMPORTED_MODULE_1__[\"default\"]];\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (levels);\n\n//# sourceURL=webpack:///./src/levels/index.js?");

/***/ }),

/***/ "./src/levels/levelOne.js":
/*!********************************!*\
  !*** ./src/levels/levelOne.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst levelOne = {\n  standard: {\n    game: {\n      numRocks: 3,\n      rockWidth: 100,\n      rocKheight: 1,\n      rockWhiteSpace: 1,\n      badShipScale: 0.5,\n      badShipRows: 7,\n      badShipsPerRow: 5,\n      badShipsBulletsPerSecond: 1,\n      badShipFramerate: 200,\n      goodBulletFramerate: 800,\n      badBulletFramerate: 100,\n    },\n    goodShip: {\n      continuousFire: true,\n    },\n    badShip: {\n      continuousFire: true,\n    },\n    rock: {\n      rockParticleWidth: 1,\n      rockParticleHeight: 45,\n    },\n  },\n  special: {\n    goodShip: {\n      continuousFire: true,\n    },\n    game: {\n      badShipsBulletsPerSecond: 10,\n    },\n  },\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (levelOne);\n\n//# sourceURL=webpack:///./src/levels/levelOne.js?");

/***/ }),

/***/ "./src/levels/levelTwo.js":
/*!********************************!*\
  !*** ./src/levels/levelTwo.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst levelTwo = {\n  standard: {\n    game: {\n      numRocks: 3,\n      rockWidth: 50,\n      rocKheight: 1,\n      rockWhiteSpace: 2,\n      badShipScale: 0.5,\n      badShipRows: 1,\n      badShipsPerRow: 1,\n      badShipsBulletsPerSecond: 25,\n      badShipFramerate: 200,\n      goodBulletFramerate: 800,\n      badBulletFramerate: 100,\n    },\n    goodShip: {\n      continuousFire: true,\n    },\n    badShip: {\n      continuousFire: true,\n    },\n    rock: {\n      rockParticleWidth: 20,\n      rockParticleHeight: 45,\n    },\n  },\n  special: {\n    goodShip: {\n      continuousFire: true,\n    },\n    game: {\n      badShipsBulletsPerSecond: 10,\n    },\n  },\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (levelTwo);\n\n//# sourceURL=webpack:///./src/levels/levelTwo.js?");

/***/ }),

/***/ "./src/moveable.js":
/*!*************************!*\
  !*** ./src/moveable.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Moveable {\n  constructor(settings) {\n    this.shapes = [];\n    this.settings = settings;\n  }\n\n  // Update internal x y values\n  move(deltaX, deltaY) {\n    for (let shape of this.shapes) {\n      shape.oldX = shape.x;\n      shape.oldY = shape.y;\n      shape.x += deltaX;\n      shape.y += deltaY;\n    }\n  }\n\n  kill(context) {\n    // Clear existing draw of object\n    for (let shape of this.shapes) {\n      context.clearRect(shape.x, shape.y, shape.width, shape.height);\n      context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);\n    }\n    // No need to explicity destroy instance but ensure no references to it exist if it needs to be destroyed - garbage collection\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Moveable);\n\n//# sourceURL=webpack:///./src/moveable.js?");

/***/ }),

/***/ "./src/rock.js":
/*!*********************!*\
  !*** ./src/rock.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _bullet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bullet */ \"./src/bullet.js\");\n/* harmony import */ var _moveable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./moveable */ \"./src/moveable.js\");\n\n\n\nclass Rock extends _moveable__WEBPACK_IMPORTED_MODULE_1__[\"default\"] {\n  constructor(width, settings) {\n    super(settings);\n    this.shapes = false;\n    this.rockParticleWidth = 50;\n    this.particleHeight = 45;\n    this.width = width;\n    //this.height = ;\n  }\n\n  getShapes() {\n    if (!this.shapes) {\n      let shapes = new Array();\n      for (\n        let i = 0;\n        i < this.width / ((this.settings.rockParticleWidth / 100) * this.width);\n        i++\n      ) {\n        shapes.push({\n          x: i * this.settings.rockParticleWidth,\n          y: 800,\n          width: this.settings.rockParticleWidth,\n          height: this.settings.rockParticleHeight,\n        });\n      }\n      this.shapes = shapes;\n    }\n  }\n\n  draw(context) {\n    this.getShapes();\n    // Draw in new position\n    for (let shape of this.shapes) {\n      context.fillStyle = \"#21c521\";\n      context.fillRect(shape.x, shape.y, shape.width, shape.height);\n    }\n  }\n\n  move(deltaX, deltaY) {\n    this.getShapes();\n    super.move(deltaX, deltaY);\n  }\n\n  findDamageFrom(object) {\n    if (object instanceof _bullet__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) {\n      for (let shape of this.shapes) {\n        if (this.isColliding(shape, object)) {\n          // Remove the shape from the rock, the game will clear it from the canvas\n          this.shapes.splice(this.shapes.indexOf(shape), 1);\n          return shape;\n        }\n      }\n      console.log(\"something has gone wrong, the game thought the rock has collided with the bullet but the rock thinks  otherwise!!\")\n      return;\n    }\n  }\n\n  isColliding(shape, object2) {\n    let colliding = false;\n\n    for (let j = 0; j < object2.shapes.length; j++) {\n      if (\n        !(\n          shape.x > object2.shapes[j].x + object2.shapes[j].width ||\n          shape.x + shape.width < object2.shapes[j].x ||\n          shape.y > object2.shapes[j].y + object2.shapes[j].height ||\n          shape.y + shape.height < object2.shapes[j].y\n        )\n      ) {\n        colliding = true;\n        break;\n      }\n    }\n\n    return colliding;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Rock);\n\n\n//# sourceURL=webpack:///./src/rock.js?");

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _moveable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moveable */ \"./src/moveable.js\");\n\n\nclass Ship extends _moveable__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(game, settings) {\n    super(settings);\n    this.game = game;\n    this.bullet = \"\";\n    this.bulletInPlay = false;\n    this.width = 80;\n    this.height = 80;\n  }\n\n  fireBullet() {\n    if (!this.bulletInPlay || this.settings.continuousFire) {\n      let bullet = this.game.createBullet(this);\n      // This does not exactly identify bullet exit point and also needs to be more readable\n      this.game.moveObject(\n        bullet,\n        Math.floor(...this.shapes.map((shape) => shape.x)),\n        Math.floor(...this.shapes.map((shape) => shape.y))\n      );\n      this.game.drawObject(bullet);\n    }\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Ship);\n\n//# sourceURL=webpack:///./src/ship.js?");

/***/ })

/******/ });