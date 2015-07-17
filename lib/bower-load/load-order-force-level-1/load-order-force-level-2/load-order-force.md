>> we need to trick meteor's load order to allow bower packages to be loaded first

- this seems to be the [best solution](https://github.com/mquandalle/meteor-bower#usage) for this problem at the time:
  - have bower as the deepest child in the lib dir to work with [meteor load order](http://stackoverflow.com/a/14987487)
  - **NOTE**: if this breaks in the future due to other lib dirs with deeper children:
    - add more `load-order-force-level` dirs
    - update location config of the .bowerrc