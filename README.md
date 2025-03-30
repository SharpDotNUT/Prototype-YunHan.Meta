# Prototype.Meta

这是 [Prototype](https://github.com/SharpDotNUT/Prototype) 的元数据生成器。
This is the metadata generator for [Prototype](https://github.com/SharpDotNUT/Prototype).

目前代码结构还很混乱，后续会规范。
The code structure is still very messy, and will be standardized later.

要开始生成元数据，请先
To start generating metadata, please first

1. 获取 `Snap.Metadata` | Get `Snap.Metadata`

```bash
git clone https://github.com/DGP-Studio/Snap.Metadata
```

1. 安装 Deno 为运行生成器代码 | Install Deno to run the generator code

```bash
# MacOS/Linux
curl -fsSL https://deno.land/install.sh | sh

# Windows PowerShell
deno install -A --unstable https://deno.land/x/snap/install.sh
```
