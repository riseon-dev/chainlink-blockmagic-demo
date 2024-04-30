#!/usr/bin/env bash

rm -rf src/__generated__
mkdir src/__generated__

PLUGIN_PATH=$(pwd)/node_modules/.bin/protoc-gen-ts_proto

protoc \
  --ts_proto_out src/__generated__ \
  --proto_path api \
  --ts_proto_opt=addGrpcMetadata=true ./api/orderbook.proto \
  --ts_proto_opt=nestJs=true \
  --ts_proto_opt=lowerCaseServiceMethods=true \
  --ts_proto_opt=snakeToCamel=true \
  --plugin=$PLUGIN_PATH \
  --experimental_allow_proto3_optional
