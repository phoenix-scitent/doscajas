### bower
>> https://github.com/mquandalle/meteor-bower
>> https://atmospherejs.com/mquandalle/bower

- `lib/bower-load/load-order-force-level-*/bower/bower.json`
- `lib/bower-load/load-order-force-level-*/bower/.bowerrc`
- `.meteor/local/bower` (*install location* set in bowerrc as absolute path)
- `client/startup/default.js` (logs versions being used on the client)
- `server/startup/default.js` (logs versions being used on the server)

#### installing packages

>> be sure and specify client, server or both via overrides in `bower.json`
>> be sure and add version logging to client and/or server startup

1. `cd lib/bower-load/load-order-force-level-*/bower/`
2. `bower install --save <package_name>` (from project root)

#### using packages

>> load order will be before templates (see lib/bower-load/load-order-force-level-*/load-order-force.md)

- by default **meteor-bower** uses the `main` section of the library's `bower.json` file to determine which files should be loaded
- if the package you're adding doesn't use the main section: you can choose which files you want by adding an `override` field to your `bower.json` [as described](https://github.com/mquandalle/meteor-bower/pull/54)
- If you need to reference the raw files (eg Polymer components in html files), you can set a different directory, eg "public/bower", and include those files manually in your `<head>`.

### overrides

#### lodash

>> concidering [override](https://github.com/stevezhu/meteor-lodash/issues/3#issuecomment-85785322) due to Meteor internally bundling underscore

- bower lodash will load after underscore in meteor packages and take over the use of `_`
- this is true on client and server (bower lodash )

### meteor

#### starting the app

`meteor --port 4000` (from project root)

#### load order
 >> http://stackoverflow.com/questions/10693113/how-do-i-change-the-order-in-which-meteor-loads-javascript-files

#### misc

```
Inspinia - Meteor version 2015
version: 2.2

Meteor.js is an open-source platform built on Node and MongoDB
See documentation of Meteor to learn more: http://docs.meteor.com/#/full/
Install Meteor: https://www.meteor.com/install
Be sure that you have all setup - create the Meteor project and run the sample application: https://www.meteor.com/try

INSPINIA first run - just cd into Inspinia Meteor project and run the application with:

meteor

This will grab the necessary packages, bundle all the css and js and start your application
Go to http://localhost:3000 to see live version
```