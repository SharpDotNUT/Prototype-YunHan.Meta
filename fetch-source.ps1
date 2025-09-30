
git clone --depth=1 https://github.com/DGP-Studio/Snap.Metadata.git ./source/Snap.Metadata.temp

Move-Item -Force -Path ./source/Snap.Metadata.temp/Genshin -Destination ./source/Snap.MetaData
Remove-Item -Recurse -Path ./source/Snap.Metadata.temp

curl.exe https://gitlab.com/Dimbreath/AnimeGameData/-/archive/master/AnimeGameData-master.zip?path=TextMap -o ./source/TextMap.zip
curl.exe https://gitlab.com/Dimbreath/AnimeGameData/-/archive/master/AnimeGameData-master.zip?path=ExcelBinOutput -o ./source/ExcelBinOutput.zip

Expand-Archive -Path ./source/TextMap.zip -DestinationPath ./source/_TextMap
Expand-Archive -Path ./source/ExcelBinOutput.zip -DestinationPath ./source/_ExcelBinOutput

Move-Item -Path ./source/_TextMap/AnimeGameData-master-TextMap -Destination ./source/TextMap
Move-Item -Path ./source/_ExcelBinOutput/AnimeGameData-master-ExcelBinOutput -Destination ./source/ExcelBinOutput

Remove-Item -Path ./source/TextMap.zip
Remove-Item -Path ./source/ExcelBinOutput.zip
Remove-Item -Path ./source/_TextMap
Remove-Item -Path ./source/_ExcelBinOutput