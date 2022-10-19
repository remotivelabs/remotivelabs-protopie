const { exit } = require("process");
const useBroker = require("./src/broker.js");

var brokerUrl = undefined
var apiKey = undefined

const args = process.argv.slice(2);
if (args.length == 0 || args.length > 2) {
    console.log("Use: node usage.js brokerUrl [apiKey]")
    exit(0)
}

brokerUrl = args[0]

if (args.length === 2) {
    apiKey = args[1]
}

const broker = useBroker(
    brokerUrl = brokerUrl,
    apiKey = apiKey,
    clientId = "protopie")

async function start() {
    

/**
{
  status: 'VALID',
  json: <Buffer>,
  expires: '2022-12-24T13:18:07Z',
  requestId: '',
  requestMachineId: <Buffer>
}
 */
await broker.getLicense()
    .then((license) => {
        console.log(license)
        console.log(license.json.toString("utf8"))
    })
    .catch((err) => console.error(err))


/**
 * Lists all signals
 * [
 *   {
 *       "name" : "signalName",
 *       "namespace": "namespace_name"
 *   }
 * ]
 */
await broker.listAllSignals()
    .then((signals) => console.log(signals))
    .catch((err) => console.error(err))


console.log("Suscribing to signals")
const subscription = broker.subscribe([ { namespace: 'FlexrayBackbone', signal: 'PinionSteerAg1' }], true)

console.log("Got subscription")
subscription.on('data',function(response){
    console.log(response.signal);
});

subscription.on('end',function(){
    console.log('Subscription stream closed');
});

subscription.on('error', (error) => {
    if(error.code === 1) {
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
