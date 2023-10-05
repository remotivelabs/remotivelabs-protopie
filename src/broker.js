const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATHS = [
    __dirname + "/protos/system_api.proto",
    __dirname + "/protos/network_api.proto",
    __dirname + "/protos/common.proto"
]

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

// Get url without protocol
function grpcUrl(brokerUrl) {
    const url = new URL(brokerUrl)
    if (url.protocol === "https:") {
        return `${url.host}:${url.port ? url.port : 443}`
    } else {
        return `${url.host}:${url.port ? url.port : 50051}`
    }
}

// Secure or insecure
function context(brokerUrl) {
    const url = new URL(brokerUrl)
    if (url.protocol === "https:") {
        return grpc.credentials.createFromSecureContext()
    } else {
        return grpc.credentials.createInsecure()
    }
}

function useBrokerApi(brokerUrl, apiKey, clientId) {


    const grpcBrokerUrl = grpcUrl(brokerUrl)
    console.log("[BROKER_CLIENT] Connecting to " + grpcBrokerUrl)
    const grpcObj = protoLoader.loadSync(PROTO_PATHS, options);

    const SystemService = grpc.loadPackageDefinition(grpcObj).base.SystemService;
    const systemService = new SystemService(grpcBrokerUrl, context(brokerUrl));

    const NetworkService = grpc.loadPackageDefinition(grpcObj).base.NetworkService;
    const networkService = new NetworkService(grpcBrokerUrl, context(brokerUrl));

    const metadata = new grpc.Metadata();
    if (apiKey) {
        metadata.add('x-api-key', apiKey)
    }

    function getLicense() {

        return new Promise((resolve, reject) => {
            systemService.GetLicenseInfo({}, metadata, function (error, license) {
                if (error) {
                    reject(error)
                } else {
                    resolve(license)
                }
            })
        })
    }

    /**
     * Lists all signals
     * [
     *   {
     *       "name" : "signalName",
     *       "namespace": "namespace_name"
     *   }
     * ]
     */
    function listAllSignals() {

        return new Promise((resolve, reject) => {
            systemService.GetConfiguration({}, metadata, async function (error, config) {
                if (error) {
                    reject(error)
                } else {
                    var signalNames = []
                    for (const networkInfo of config.networkInfo) {
                        const signals = await listSignals(networkInfo.namespace.name)
                        signalNames = signalNames.concat(signals)
                    }
                    resolve(signalNames)
                }
            })
        })
    }

    function listSignals(namespace) {
        return new Promise((resolve, reject) => {
            systemService.ListSignals({name: namespace}, metadata, (error, res) => {
                if (error) {
                    reject(error)
                } else {
                    const signalNames = res.frame.map(f => {
                            //console.log(f.signalInfo)
                            return {namespace: namespace, name: f.signalInfo.id.name}
                        }
                    )
                    resolve(signalNames)
                }
            })
        })
    }

    function subscribe(signals, onlyOnChange = false) {

        const signalIds = signals.map(signal => {
            return {
                name: signal.signal,
                namespace: {
                    name: signal.namespace
                }
            }
        })

        const subscriberConfig = {
            clientId: {id: clientId},
            signals: {signalId: signalIds},
            onChange: onlyOnChange
        }

        return networkService.SubscribeToSignals(subscriberConfig, metadata)

    }


    return {
        getLicense, listAllSignals, listSignals, subscribe
    }

}

module.exports = useBrokerApi
