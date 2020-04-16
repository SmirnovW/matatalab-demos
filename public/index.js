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

var app = new Vue({
    el: '#app',
    data: {
        blueToothPrimaryService: null,
        colors: COLORS,
        currentColor: 'black',
    },
    methods: {
        setColor(colorValue, colorName) {
            console.log(colorName);
            this.currentColor = colorName;
            eyes(this.blueToothPrimaryService, colorValue);
        },
        init() {
            this.blueToothPrimaryService = connect();
        }
    },
    mounted() {
        console.log('qweqw')
    }
});


const COMMANDS = {
    WHEEl: 100,
    EYE: 100,
};


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
    console.log(conn);
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

function move(connection) {
    console.log(connection);
    connection
    .then(service => service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'))
    .then(characteristic => {
        return characteristic.writeValue(
            getWheelCommand(7, 7)
        );
    })
    .then(result => {
        console.log('result', result);
    })
    .catch(error => { console.log(error); });
}

function stop(connection) {
    connection
    .then(service => service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'))
    .then(characteristic => {
        return characteristic.writeValue(
            getStopCommand()
        );
    })
    .then(result => {
        console.log('result', result);
    })
    .catch(error => { console.log(error); });
}


// left 1
// right 2

// int n = 1;

// m = 1
// i = 1
// k = 2


// 100 98 11