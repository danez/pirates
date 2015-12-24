# Fixture
These files are here for the most infuriating reason. Node uses the internal fs binding to check if files exist 
before loading them, but uses fs to actually read them, which means that the actual content can be mocked. So, none 
of these files are actually loaded, but they need to be here so that they exist.

See [nodejs/node#4190](https://github.com/nodejs/node/issues/4190).