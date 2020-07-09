#!/bin/sh

echo '' > ./en_new.po

# mac path (dev!) /usr/local/Cellar/gettext/0.19.8.1/bin/xgettext , msgmerge

find ../packages -type f \( -name '*.js' \)  -print > list
xgettext --files-from=list --from-code=UTF-8 --output=./en_new.po --language=JavaScript --no-wrap
rm list
find ../src -type f \( -name '*.js' \)  -print > list
xgettext --files-from=list --from-code=UTF-8 --output=./en_new.po --join-existing --language=JavaScript --no-wrap
rm list

for file in ./locale/*.po
do
  msgmerge -U "$file" ./en_new.po --no-wrap
done

rm ./en_new.po

cd ../src/
./build.sh -lo web
./build.sh -lo ess
