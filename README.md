# RemotivelLabs and Protopie

RemotiveBroker integration using Protopie connect

![alt text](screenshot.png "Screenshot")


```

```


## Test it out

### Start cloud broker and recording

<iframe src="https://drive.google.com/file/d/1m8pfbSK_9-iaI2JSssdcok8O8nYs0mIM/preview" width="640" height="480" allow="autoplay"></iframe>

Go to https://demo.remotivelabs.com

* Follow instructions on how to start a broker and play the recording.
* Open (or copy) sample-config.json and update broker url+apiKey according to the broker you just started.
* Use "Explore" to open RemotiveBrokerApp and start the recording under Playback using the play button.

### Start connect bridge
```
npm install
npm start sample-config.json
```
## Run Pie

* You should now see signals showing up in Protopie connect.
* Add car-integration_v5_just_speed.pie to ProtoPie connect and start it in web-browser.
* That should be it!


## Config

```
{
  "broker": {
    "url": "https://protopie-demo-uo7acw3qiq-ez.a.run.app",
    "apiKey": "protopie-demo-key"
  },
  "subscription": {
    "VehicleSpeed": {            <- Name in vehicle bus
      "namespace": "custom_can",
      "mapTo": "Speed"           <- Name in protopie connect
    }
  }
}
```
