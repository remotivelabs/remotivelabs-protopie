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

### Start connect bridge
```
npm start brokerUrl apiKey
```

### Subscribe

Currently only speed is supported.

Send a message with name SUBSCRIBE to get current speed in connect.

