# Prototype.Meta

> Readme 已滞后，待更新

这是 [试作·云翰](https://github.com/SharpDotNUT/Prototype-YunHan) 的元数据生成器。
This is the metadata generator for [Prototype-YunHan](https://github.com/SharpDotNUT/Prototype-YunHan).

目前代码结构还很混乱，后续会规范。
The code structure is still very messy, and will be standardized later.

要开始生成元数据，请先
To start generating metadata, please first

1. 获取元数据

```bash
powershell fetch-source.ps1
```

2. 运行生成脚本

```
deno run --allow-all .\script\Achievement\index.ts
```
