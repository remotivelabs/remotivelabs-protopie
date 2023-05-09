const io = require("socket.io-client");

const  {parseArgs} =  require("node:util");

const {
    values: { url, api_key,config },
} = parseArgs({
    options: {
        url: {
            type: "string",
            short: "b",
        },
        api_key: {
            type: "string",
            short: "k",
        },
        config: {
            type: "string",
            short: "c"
        }
    },
});

console.log("hello")
console.log(`${url} has ${api_key}`);


//------------- ProtoPie Connect configiration -------------

// Modify this with the name of your Bridge App.
// This is what will be displayed in ProtoPie connect
// as the source of any messages sent from this app.
const PP_CONNECT_APP_NAME = "RemotiveBridge";

// This should work fine if you have this app and ProtoPie
// Connect running on the same computer with the default settings.
// Only modify this if you have ProtoPie Connect running on a
// different server or port.
const PP_CONNECT_SERVER_ADDRESS = "http://127.0.0.1:9981";

const useBroker = require("./broker.js");
const fs = require('fs');

/*const args = process.argv.slice(2);
if (args.length !== 1) {
    console.log("Use: node usage.js <config-file.json>")
    exit(0)
}*/

let jsonConfig = JSON.parse( fs.readFileSync(config).toString("utf-8"));

const broker = useBroker(
    brokerUrl = url,
    apiKey = api_key,
    clientId = "protopie")


// This establishes the connection to ProtoPie Connect via Socket.io
console.log("[PP-CONNECT] Connecting to ProtoPie Connect on", PP_CONNECT_SERVER_ADDRESS);
const ppConnect = io(PP_CONNECT_SERVER_ADDRESS, {
    reconnectionAttempts: 5,
    timeout: 1000 * 10,
});

ppConnect
    .on("connect", async () => {
        console.log("[PP-CONNECT] Connected to ProtoPie Connect on", PP_CONNECT_SERVER_ADDRESS);
        ppConnect.emit("ppBridgeApp", {name: PP_CONNECT_APP_NAME});
        sendMessageToConnect("PLUGIN_STARTED", PP_CONNECT_APP_NAME);

        console.log("[PP-CONNECT] Verifying broker connection")

        try {
            const license = await broker.getLicense()
            console.log("[PP-CONNECT] Broker connection successfully verified")
        } catch (e) {
            console.error("Failed to connect to broker")
            console.error(e.message)
            process.exit(1)
        }

        sendMessageToConnect("BROKER_CONNECTED", "yes");
        const signalsToSubscribeOn = Object.keys(jsonConfig.subscription).map( signalName => {
            return {'namespace' : jsonConfig.subscription[signalName].namespace, 'signal' : signalName}
        })

        const subscription = broker.subscribe(signalsToSubscribeOn, true)

        subscription.on('data', function (response) {
            for (signal of response.signal) {
                console.log(signal)
                const name = jsonConfig.subscription[signal.id.name].mapTo ? jsonConfig.subscription[signal.id.name].mapTo : signal.id.name
                sendMessageToConnect(name, getSignalValue(signal))
            }
        }).on('end', function() {
            console.log('Subscription stream ended')
        }).on('error', function(err) {
            console.log('Subscription stream received error')
            console.log(err)
        });

// =========> Successful connection to ProtoPie Connect. do app stuff here

    })
    .on("ppMessage", (message) => {
        console.log('[PP-CONNECT] Received a message from ProtoPie Connect', message);

// =========> Handle incoming messages from ProtoPie Connect here


        switch (message.messageId) {
            case "FOO":
                console.log(message.value);
                break;
        }
    });

// Use this function to send messages to ProtoPie Connect
function sendMessageToConnect(messageId, value) {

    ppConnect.emit("ppMessage", {
        messageId,
        value
    });
}

function getSignalValue(signal) {
    if (signal.payload == 'double') {
        return signal.double
    } else if (signal.payload == 'integer') {
        return signal.integer
    } else if (signal.payload == 'arbitration') {
        return signal.arbitration
    }


}

//------------- ProtoPie Connect Socket.io connection error handling -------------

ppConnect
    .on("connect_error", (err) => {
        console.error("[PP-CONNECT] Connection error: ", err.toString());
    })
    .on("disconnect", (reason) => {
        console.log("[PP-CONNECT] Disconnected from ProtoPie Connect: ", reason);
    });

ppConnect.io
    .on("reconnect_attempt", (count) => {
        console.log("[PP-CONNECT] Retry connection attempt ", count);
    })
    .on("reconnect_failed", () => {
        console.error(`[PP-CONNECT] Connection to ProtoPie Connect failed. Is ProtoPie Connect running on ${PP_CONNECT_SERVER_ADDRESS} ?`);
    });

//------------- Handle exit -------------

function exit() {
    sendMessageToConnect("PLUGIN_STOPPED", PP_CONNECT_APP_NAME);
    ppConnect.disconnect();
    process.exit();
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);