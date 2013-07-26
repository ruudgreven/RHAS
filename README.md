# Ruud's Home Automation System
Ruud's Home Automation System (short RHAS) is meant to run on my raspberry PI and uses my Homewizard (check http://www.homewizard.nl) to read sensordata. In the future it should function as some sort of home automation hub in my house.

## Why bother us with it?
Because I try to build it as general as possible, so other people can use it for their own purposes

## Configuration
Download the source. Create config.inc.php from the example and you can go.

## Configuration map
I've created some sort of ubercool heat map. To update it for your house, do the following steps:
- Create a map of your house, 700px wide, height doesn't matter
- Give every single room, which contains a thermometer, a specific color.
- Edit mapconfig.json to match your configuration. Specify the colors for every room (based on thermometer sensor id) and specify the position where to put a label.

## Current status
At this point RHAS uses the Homewizard to thermometer data and put it on the frontpage. In the future it will be far more than that
