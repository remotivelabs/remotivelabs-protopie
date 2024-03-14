# RemotiveLabs + Protopie

*NOTE - Our OLD nodejs bridge-app has been deprecated in favour of our CLI. You can
still use the old bridge-app if you want. Blogs and videos are using the old app
but are still very useful*

Use our RemotiveCloud together with Protopie and feed real vehicle signals 
into your prototype.

Read this blogpost for a good introduction https://www.protopie.io/blog/challenging-the-status-quo-in-automotive-prototyping

![alt text](screenshot.png "Screenshot")

## Try it out yourself

This solution requires [Protopie-Connect](https://www.protopie.io/learn/docs/connect/getting-started) which in turn requires a Protopie Pro or Enterprise [plan](https://www.protopie.io/plans).
<hr />

Here is a video that goes through each step in this README, its highly recommended
to watch this video to get a better understanding of how it works.
**[Show video with complete demo (6 min)](https://drive.google.com/file/d/1dG7x7oGb7BTTzivjrDZOmaoydUuraiGW/view?usp=sharing)**


## Prepare recording in RemotiveCloud

You can try this out in our demo at https://demo.remotivelabs.com but we recommend
creating a free (or use an existing) account at https://cloud.remotivelabs.com. 

When creating a free account you will get some example drivecycles automatically and
existing users can click the "import" button in the top right corner under "Recordings".

1. Follow instructions to start a broker and play the recording to the broker, make sure to use "configuration_vss" if you want to use VSS.
2. Finally press "Go to broker" to open our RemotiveBrokerApp from which you can control the recording being played.


## Start connect bridge

Our ProtoPie Connect bridge is started using RemotiveCLI, read about installation
https://docs.remotivelabs.com/docs/remotive-cli/installation and details about how to
use connect is found here https://docs.remotivelabs.com/docs/remotive-cli/cli_man_pages#remotive-connect-protopie

Once you are playing a recording you can find CLI snippets in our BrokerApp that you can simply
copy/paste and use directly.


In short, this is how it looks
```
remotive connect protopie \
  --signal vss:Vehicle.Speed \
  --signal vss:Vehicle.Chassis.SteeringWheel.Angle \
  --broker-url https://my_cloud_broker \
  --api-key xxx    
```

### Control the recording

Once the bridge-app is running you can "play" the recording from the RemotiveBrokerApp. 
Simply press the play icon and you should see the progressbar moving. There should also be 
message visible in protopie-connect and in the terminal where the bridge-app was started.
This means that the recording is being replayed properly. You can now control the recording
with Play, Pause & Stop and also drag the progressbar back and forth to seek to specific place in the recording.

<img src="remotive_broker_app_play.png"  width="90%" height="90%">

## Run Pies

There are two Pies under samples directory, AMG_GT_Cluster_Gauge.pie that you can use
when you start any of our drivecycles with "raw" signals and AMG_GT_Cluster_Gauge.pie that
you should use if you run a drivecycle with VSS transformations (configuration_vss) in our cloud.

Thats it, you should now see your cluster coming alive.

Please do not hesitate to use our discussion/community forum for questions regarding this.

https://github.com/remotivelabs/remotivelabs-community/discussions

