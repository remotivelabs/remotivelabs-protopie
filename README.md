# RemotivelLabs and Protopie

RemotiveBroker integration using Protopie connect

```
npm install
```


## Test it out

Go to https://demo.remotivelabs.com

* Follow instructions on how to start a broker and play the recording.
* Use "Explore" to open RemotiveBrokerApp and start the recording 
* From the final step, use the broker url and api-key as arguments when starting in the next step
* Open (or copy) sample-config.json and update broker url+apiKey

### Start connect bridge
```
npm start sample-config.json
```

You should now see signals showing up in Protopie connect

## Config



```
{
  "broker": {
    "url": "https://protopie-demo-uo7acw3qiq-ez.a.run.app",
    "apiKey": "my-api-key"
  },
  "subscription": {
    "VehicleSpeed": {            <- Name in vehicle bus
      "namespace": "custom_can",
      "mapTo": "Speed"           <- name in protopie connect (optional)
    }
  }
}
```