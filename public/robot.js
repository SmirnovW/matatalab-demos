const COLORS = {
    BLACK: {
        name: 'black',
        value: 7,
    },
    WHITE: {
        value: 1,
        name: 'white',
    },
    RED: {
        value: 2,
        name: 'red',
    },
    LIGHT_GREEN: {
        value: 3,
        name: 'light_green',
    },
    GREEN: {
        value: 4,
        name: 'green',
    },
    BLUE: {
        value: 5,
        name: 'blue',
    },
    VIOLET: {
        value: 6,
        name: 'violet',
    },
};

let currentPath = 0;

let delay = (time)=>{
    return new Promise(() =>{
        setTimeout(() => {}, time);
    });
};

let isFirstStep = true;

var app = new Vue({
    el: '#app',
    data() {
        return {
            message: '',
            isRobotPathVisible: false,
            blueToothPrimaryService: null,
            colors: COLORS,
            currentColor: 'black',
        };
    },
    methods: {
        handleClick() {
            this.isRobotPathVisible = !this.isRobotPathVisible;
            isRobotPathVisible = this.isRobotPathVisible;
        },
        setColor(colorValue, colorName) {
            console.log(colorName);
            this.currentColor = colorName;
            eyes(this.blueToothPrimaryService, colorValue);
        },
        init() {
            this.blueToothPrimaryService = connect();
        },
        async robotDraw() {
            if (vectors[currentPath].length > 1) {
                const v1 = createVector(robot.vector.x - robot.baseVector.x, robot.vector.y - robot.baseVector.y);
                const v2 = createVector(vectors[currentPath][1].x - vectors[currentPath][0].x, vectors[currentPath][1].y - vectors[currentPath][0].y);

                let angleBetween = v1.angleBetween(v2);

                robot.vector.rotate(angleBetween);
                robot.baseVector.set(vectors[currentPath][1].x, vectors[currentPath][1].y);
                robot.vector = p5.Vector.mult(robot.vector, 2);

                const distance = vectors[currentPath][0].dist(vectors[currentPath][1]);

                const time = distance * (currentPath === 0 ? 5 : 10);
                let degree = degrees(angleBetween);
                let direction = COMMANDS.TURN_RIGHT;

                if (degree < 0) {
                    direction = COMMANDS.TURN_LEFT;
                }

                await turn(this.blueToothPrimaryService, direction, Math.ceil(Math.abs(degree)));
                await delay(degree * 5);
                await move(this.blueToothPrimaryService);

                await delay(time);
                await stop(this.blueToothPrimaryService);

                currentPath += 1;

                loop();

                if (vectors[currentPath]) {
                    this.robotDraw()
                }
            }
        },
        clear() {
            clear();
            background(240);
            vectors = [];
            baseVector = null;
            robot = {
                vector: null,
                baseVector: null,
            };
            currentPath = 0;
        }
    },
    mounted() {
    }
});


const COMMANDS = {
    WHEEl: 100,
    EYE: 100,
    TURN_LEFT: 33,
    TURN_RIGHT: 34,
};



function getTurnCommand(direction, angle) {
    const data = [direction, angle];
    const buffer = new ArrayBuffer(2);
    const bufferView = new Int8Array(buffer);
    bufferView.set(data);

    return buffer;
}

function getWheelCommand(leftWheel, rightWheel) {
    const data = [COMMANDS.WHEEl, (leftWheel * 16 + rightWheel), 1];
    const buffer = new ArrayBuffer(3);
    const bufferView = new Int8Array(buffer);
    bufferView.set(data);

    return buffer;
}

function getStopCommand() {
    return getWheelCommand(6, 6);
}

function getEyesCommand(color, saturation) {
    const data = [COMMANDS.EYE, ((color - 1) * 16 + saturation), 11];
    const buffer = new ArrayBuffer(3);
    const bufferView = new Int8Array(buffer);
    bufferView.set(data);

    return buffer;
}

async function connect() {
    const conn = await window.navigator.bluetooth.requestDevice({
        filters: [{
            services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
        }]
    })
    .then(device => device.gatt.connect())
    .then(server => {
        return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e')
    })
    .catch(error => { console.log(error); });

    return conn;
}

function eyes(connection, color) {
    connection
    .then(service => service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'))
    .then(characteristic => {
        return characteristic.writeValue(
            getEyesCommand(color, 5)
        );
    })
    .then(result => {
        console.log('result', result);
    })
    .catch(error => { console.log(error); });
}

async function move(connection) {
    return connection
    .then(service => service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'))
    .then(characteristic => {
        return characteristic.writeValue(
            getWheelCommand(8, 8)
        );
    })
    .then(result => {
        console.log('move result', result);
    })
    .catch(error => { console.log('move', error); });
}

async function turn(connection, direction, angle) {
    return connection
    .then(service => service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'))
    .then(characteristic => {
        return characteristic.writeValue(
            getTurnCommand(direction, angle)
        );
    })
    .then(result => {
        console.log('turn result', result);
    })
    .catch(error => { console.log('turn', error); });
}

async function stop(connection) {
    return connection
    .then(service => service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'))
    .then(characteristic => {
        return characteristic.writeValue(
            getStopCommand()
        );
    })
    .then(result => {
        console.log('stop result', result);
    })
    .catch(error => { console.log('stop', error); });
}
