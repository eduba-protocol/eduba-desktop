# Environment Variables

## .env examples

### .env
```
LOG_LEVEL="debug"
APP_DATA_DIRECTORY="/absolute/path/eduba/data/me"
DHT_BOOTSTRAP_NODES="127.0.0.1:49737"
PORT="3000"
LOGGER_PORT="9000"
```

### .env.peer
```
LOG_LEVEL="debug"
APP_DATA_DIRECTORY="/absolute/path/eduba/data/peer"
DHT_BOOTSTRAP_NODES="127.0.0.1:49737"
PORT="3001"
LOGGER_PORT="9001"
```

## Variables

### LOG_LEVEL

See [electron-log](https://github.com/megahertz/electron-log) package

### APP_DATA_DIRECTORY

- Default is the default data folder for applications on your OS
- This is the parent folder for all the files that the application will save.
- Must be an absolute path
- Must be unique for each peer
- A data folder in this repo is ignored by git.


### DHT_BOOTSTRAP_NODES

- Default is the bootstrap nodes for the default DHT of the Holepunch platform.
- During development, you can run a testnet and use that location.  Running the testnet script will print the location.

```
eduba$ node ./scripts/testnet.js
    export DHT_BOOTSTRAP_NODES="127.0.0.1:49737"
```

### PORT
- Default is "3000"
- Must be unique for each peer
- Optional if only running one peer

### LOGGER_PORT
- Default is "3000"
- Must be unique for each peer
- Optional if only running one peer


## Feature Flags

To enable a feature flag, set it to "true".

### FEATURE_BACKUP

Enable the signed in user to backup and restore data.