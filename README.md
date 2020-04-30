The repository has been archived in favour of https://github.com/medic/cht-core/blob/master/INSTALL.md

# medic-couch-setup

Instructions for quickly setting up CouchDB for a local medic installation

Adapted from https://github.com/medic/medic

1. Download and Install CouchDB for your OS
2. Install NodeJS for your OS
3. Install `horticulturalist` with `npm install -g horticulturalist`
4. Export the following variables on your shell

>export COUCH_NODE_NAME=couchdb@127.0.0.1 COUCH_URL=http://myAdminUser:myAdminPass@localhost:5984/medic

5. Clone this repository and run `npm install` in the repository directory and cd into the directory
6. Install `grunt-cli` globally: `npm install -g grunt-cli`
7. Execute `grunt secure-couchdb`
8. Lauch a medic installation (re-use the same command the next time you want to launch the setup)
> COUCH_NODE_NAME=couchdb@localhost COUCH_URL=http://admin:pass@localhost:5984/medic horti --local --bootstrap=medic-version-you-want-to-install

E.g.
> COUCH_NODE_NAME=couchdb@localhost COUCH_URL=http://admin:pass@localhost:5984/medic horti --local --bootstrap=3.2.1

9. Wait for the installation to be boostrapped. Access the installation from http://localhost:5988
10. You can access Fauxton via http://localhost:5988/_utils
