# Versioning

The Eduba protocol is versioned as 2 numbers separated by a period. e.g. Major.Minor
If the protocol makes a change that would break existing clients, it must be a major version bump.
A major version of 0 is used until the protocol can evolve into a release candidate

This Eduba client is versioned as 3 numbers separated by a period. The first 2 numbers correspond to the latest version of the protocol supported by the client. The last number increments as the software is released for a constant protocol version. Once the client supports a newer protocol version, the last number of the client version resets to 0.
