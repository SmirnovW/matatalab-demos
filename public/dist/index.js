"use strict";

function setup() {
    var canvas = createCanvas(displayWidth, displayHeight);
    canvas.parent('sketch-holder');
    background(240);
    noLoop();
}

var vectors = [];
var robot = {
    vector: null,
    baseVector: null
};
var isRobotPathVisible = false;
var baseVector = null;

function addPoint(id) {
    if (id === 'defaultCanvas0') {
        if (!baseVector) {
            baseVector = createVector(mouseX, mouseY);
            vectors.push([createVector(0, 0)]);
            robot.vector = createVector(vectors[0].x, baseVector.y * -1);
            robot.baseVector = createVector(0, 0);
        } else {
            var lastVectorIndex = vectors.length - 1;
            var newVector = createVector(mouseX - baseVector.x, mouseY - baseVector.y);
            vectors[lastVectorIndex].push(newVector);
            vectors.push([newVector]);
        }
    }
}

function touchEnded(event) {
    addPoint(event.target.id);
}

function mouseClicked(event) {
    addPoint(event.target.id);
    loop();
    return false;
}

function draw() {
    strokeWeight(3);

    if (vectors.length) {
        push();
        translate(baseVector.x, baseVector.y);
        vectors.forEach(function (vector) {
            if (vector.length === 1) {
                point(vector[0].x, vector[0].y);
            }

            if (vector.length === 2) {
                line(vector[0].x, vector[0].y, vector[1].x, vector[1].y);
            }
        });
        pop();

        if (isRobotPathVisible) {
            push();
            translate(baseVector.x, baseVector.y);
            fill('green');
            strokeWeight(3);
            stroke('green');
            line(robot.baseVector.x, robot.baseVector.y, robot.vector.x, robot.vector.y);
            pop();
        }
    }

    noLoop();
}