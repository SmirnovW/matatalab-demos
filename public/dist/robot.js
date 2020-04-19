"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var COLORS = {
    BLACK: {
        name: 'black',
        value: 7
    },
    WHITE: {
        value: 1,
        name: 'white'
    },
    RED: {
        value: 2,
        name: 'red'
    },
    LIGHT_GREEN: {
        value: 3,
        name: 'light_green'
    },
    GREEN: {
        value: 4,
        name: 'green'
    },
    BLUE: {
        value: 5,
        name: 'blue'
    },
    VIOLET: {
        value: 6,
        name: 'violet'
    }
};
var currentPath = 0;

var delay = function delay(time) {
    return new Promise(function () {
        setTimeout(function () {}, time);
    });
};

var isFirstStep = true;
var app = new Vue({
    el: '#app',
    data: function data() {
        return {
            message: '',
            isRobotPathVisible: false,
            blueToothPrimaryService: null,
            colors: COLORS,
            currentColor: 'black'
        };
    },
    methods: {
        handleClick: function handleClick() {
            this.isRobotPathVisible = !this.isRobotPathVisible;
            isRobotPathVisible = this.isRobotPathVisible;
        },
        setColor: function setColor(colorValue, colorName) {
            console.log(colorName);
            this.currentColor = colorName;
            eyes(this.blueToothPrimaryService, colorValue);
        },
        init: function init() {
            this.blueToothPrimaryService = connect();
        },
        robotDraw: function () {
            var _robotDraw = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var v1, v2, angleBetween, distance, time, degree, direction;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(vectors[currentPath].length > 1)) {
                                    _context.next = 25;
                                    break;
                                }

                                v1 = createVector(robot.vector.x - robot.baseVector.x, robot.vector.y - robot.baseVector.y);
                                v2 = createVector(vectors[currentPath][1].x - vectors[currentPath][0].x, vectors[currentPath][1].y - vectors[currentPath][0].y);
                                angleBetween = v1.angleBetween(v2);
                                robot.vector.rotate(angleBetween);
                                robot.baseVector.set(vectors[currentPath][1].x, vectors[currentPath][1].y);
                                robot.vector = p5.Vector.mult(robot.vector, 2);
                                distance = vectors[currentPath][0].dist(vectors[currentPath][1]);
                                time = distance * (currentPath === 0 ? 5 : 10);
                                degree = degrees(angleBetween);
                                direction = COMMANDS.TURN_RIGHT;

                                if (degree < 0) {
                                    direction = COMMANDS.TURN_LEFT;
                                }

                                _context.next = 14;
                                return turn(this.blueToothPrimaryService, direction, Math.ceil(Math.abs(degree)));

                            case 14:
                                _context.next = 16;
                                return delay(degree * 5);

                            case 16:
                                _context.next = 18;
                                return move(this.blueToothPrimaryService);

                            case 18:
                                _context.next = 20;
                                return delay(time);

                            case 20:
                                _context.next = 22;
                                return stop(this.blueToothPrimaryService);

                            case 22:
                                currentPath += 1;
                                loop();

                                if (vectors[currentPath]) {
                                    this.robotDraw();
                                }

                            case 25:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function robotDraw() {
                return _robotDraw.apply(this, arguments);
            }

            return robotDraw;
        }(),
        clear: function (_clear) {
            function clear() {
                return _clear.apply(this, arguments);
            }

            clear.toString = function () {
                return _clear.toString();
            };

            return clear;
        }(function () {
            clear();
            background(240);
            vectors = [];
            baseVector = null;
            robot = {
                vector: null,
                baseVector: null
            };
            currentPath = 0;
        })
    },
    mounted: function mounted() {}
});
var COMMANDS = {
    WHEEl: 100,
    EYE: 100,
    TURN_LEFT: 33,
    TURN_RIGHT: 34
};

function getTurnCommand(direction, angle) {
    var data = [direction, angle];
    var buffer = new ArrayBuffer(2);
    var bufferView = new Int8Array(buffer);
    bufferView.set(data);
    return buffer;
}

function getWheelCommand(leftWheel, rightWheel) {
    var data = [COMMANDS.WHEEl, leftWheel * 16 + rightWheel, 1];
    var buffer = new ArrayBuffer(3);
    var bufferView = new Int8Array(buffer);
    bufferView.set(data);
    return buffer;
}

function getStopCommand() {
    return getWheelCommand(6, 6);
}

function getEyesCommand(color, saturation) {
    var data = [COMMANDS.EYE, (color - 1) * 16 + saturation, 11];
    var buffer = new ArrayBuffer(3);
    var bufferView = new Int8Array(buffer);
    bufferView.set(data);
    return buffer;
}

function connect() {
    return _connect.apply(this, arguments);
}

function _connect() {
    _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var conn;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return window.navigator.bluetooth.requestDevice({
                            filters: [{
                                services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
                            }]
                        }).then(function (device) {
                            return device.gatt.connect();
                        }).then(function (server) {
                            return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
                        }).catch(function (error) {
                            console.log(error);
                        });

                    case 2:
                        conn = _context2.sent;
                        return _context2.abrupt("return", conn);

                    case 4:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2);
    }));
    return _connect.apply(this, arguments);
}

function eyes(connection, color) {
    connection.then(function (service) {
        return service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
    }).then(function (characteristic) {
        return characteristic.writeValue(getEyesCommand(color, 5));
    }).then(function (result) {
        console.log('result', result);
    }).catch(function (error) {
        console.log(error);
    });
}

function move(_x) {
    return _move.apply(this, arguments);
}

function _move() {
    _move = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(connection) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        return _context3.abrupt("return", connection.then(function (service) {
                            return service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
                        }).then(function (characteristic) {
                            return characteristic.writeValue(getWheelCommand(8, 8));
                        }).then(function (result) {
                            console.log('move result', result);
                        }).catch(function (error) {
                            console.log('move', error);
                        }));

                    case 1:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3);
    }));
    return _move.apply(this, arguments);
}

function turn(_x2, _x3, _x4) {
    return _turn.apply(this, arguments);
}

function _turn() {
    _turn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(connection, direction, angle) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        return _context4.abrupt("return", connection.then(function (service) {
                            return service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
                        }).then(function (characteristic) {
                            return characteristic.writeValue(getTurnCommand(direction, angle));
                        }).then(function (result) {
                            console.log('turn result', result);
                        }).catch(function (error) {
                            console.log('turn', error);
                        }));

                    case 1:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4);
    }));
    return _turn.apply(this, arguments);
}

function stop(_x5) {
    return _stop.apply(this, arguments);
}

function _stop() {
    _stop = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(connection) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        return _context5.abrupt("return", connection.then(function (service) {
                            return service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
                        }).then(function (characteristic) {
                            return characteristic.writeValue(getStopCommand());
                        }).then(function (result) {
                            console.log('stop result', result);
                        }).catch(function (error) {
                            console.log('stop', error);
                        }));

                    case 1:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5);
    }));
    return _stop.apply(this, arguments);
}