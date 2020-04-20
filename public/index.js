function setup() {
    console.log(document.getElementById('demo1'));
    if (document.getElementById('demo1')) {
        const canvas = createCanvas(640, 480);
        canvas.parent('sketch-holder');
        background(240);
        noLoop();
    }
}

let vectors = [];
let robot = {
    vector: null,
    baseVector: null,
};

let isRobotPathVisible = false;

let baseVector = null;

function touchEnded(event) {
    if (event.target.id === 'defaultCanvas0') {
        if (!baseVector) {
            baseVector = createVector(mouseX, mouseY);
            vectors.push([createVector(0, 0)]);

            robot.vector = createVector(vectors[0].x, baseVector.y * -1);
            robot.baseVector = createVector(0, 0);
        } else {
            const lastVectorIndex = vectors.length - 1;
            const newVector = createVector(mouseX - baseVector.x, mouseY - baseVector.y);

            vectors[lastVectorIndex].push(newVector);
            vectors.push([newVector]);
        }
    }

    loop();
}

function draw() {

    strokeWeight(3);
    if (vectors.length) {
        push();
        translate(baseVector.x, baseVector.y);
        vectors.forEach(vector => {
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

