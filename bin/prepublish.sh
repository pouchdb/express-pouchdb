#!/usr/bin/env bash

#
# The main goal of this script is to customize Fauxton to our liking.
# We alter it, rebuild it, and then move the built assets into /fauxton
#

# unfortunately there is no nicer way to replace the brand color
./node_modules/.bin/replace \
  "@brandPrimary: @red" \
  "@brandPrimary: darken(#6ccb99, 5%)" \
  node_modules/fauxton/assets/less/variables.less
./node_modules/.bin/replace \
  "@brandPrimaryDark: @darkRed;" \
  "@brandPrimaryDark: darken(@pouchBrandPrimary, 10%)" \
  node_modules/fauxton/assets/less/variables.less

# ditto for favicon and title
./node_modules/.bin/replace \
  "Project Fauxton" "PouchDB Server" \
  node_modules/fauxton/assets/index.underscore
./node_modules/.bin/replace \
  "dashboard.assets/img/couchdb-logo.png" \
  "dashboard.assets/img/pouchdb-favicon.ico" \
  node_modules/fauxton/assets/index.underscore

# merge fauxton-merge with node_modules/fauxton
for filename in `find fauxton-merge -type d | sed 's/fauxton-merge\///'g`; do
  mkdir -p "node_modules/fauxton/$filename"
done

for filename in `find fauxton-merge -type f | sed 's/fauxton-merge\///'g`; do
  cp "fauxton-merge/$filename" "node_modules/fauxton/$filename"
done

# rebuild fauxton
cd node_modules/fauxton
npm install
npm run preversion
cd ../..

rm -fr fauxton
cp -r node_modules/fauxton/dist fauxton