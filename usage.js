const {exit} = require("process");
const useBroker = require("./src/broker.js");

let url;
let optionalApiKey = undefined;

const args = process.argv.slice(2);
if (args.length === 0 || args.length > 2) {
    console.log("Use: node usage.js brokerUrl [apiKey]")
    exit(0)
}
url = args[0]

if (args.length === 2) {
    optionalApiKey = args[1]
}

const broker = useBroker(
    brokerUrl = url,
    apiKey = optionalApiKey,
    clientId = "protopie")

async function start() {

    await broker.getLicense()
        .then((license) => {
            console.log(license)
            console.log(license.json.toString("utf8"))
        })
        .catch((err) => console.error(err))


    await broker.listAllSignals()
        .then((signals) => console.log(signals))
        .catch((err) => console.error(err))


    console.log("Subscribing to signals")
    const subscription = broker.subscribe([{namespace: 'FlexrayBackbone', signal: 'PinionSteerAg1'}], true)

    console.log("Got subscription")
    subscription.on('data', function (response) {
        console.log(response.signal);
    });

    subscription.on('end', function () {
        console.log('Subscription stream closed');
    });

    subscription.on('error', (error) => {
        if (error.code === 1) {
            console.log("cancelled by user")
        } else {
            console.log(JSON.stringify(error))
        }
    })

// Wait 10 seconds and then cancel
    new Promise(resolve => setTimeout(resolve, 10000)).then(() => {
            console.log("Cancelling subscription")
            subscription.cancel()
        }
    )
}

start()
