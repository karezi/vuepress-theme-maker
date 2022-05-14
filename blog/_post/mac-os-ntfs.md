---
date: 2020-11-20
title: MAC支持NTFS，实测可用
author: karezi
category: 
    - tutorial
tags:
    - macos
---
## STEP1：读取待识别硬盘的UUID
确定硬盘名称：例如Untitled

```
$ diskutil info /Volumes/Untitled | grep UUID
Volume UUID:               123F456C-E7E8-9FF0-A123-E45CF6789FD0
```
## STEP2：修改模式
OS X默认是只识别NTFS并且如果显示在桌面上的时候无法激活rw即读写功能，所以我们在系统文件/etc/fstab中加入了判断，让这个硬盘连接的时候判断为NTFS读写模式。
```
$ echo "UUID=123F456C-E7E8-9FF0-A123-E45CF6789FD0 none ntfs rw,auto,nobrowse" | sudo tee -a /etc/fstab
Password: （输入密码）
```
## STEP3：创建快捷方式
```
$ sudo ln -s /Volumes/Untitled ~/Desktop/Volumes/Untitled
```
或者 打开访达，Cmd+Shift+G，输入/Volumes/，找到该磁盘 

## 参考
[打开macOS原生的NTFS功能](https://www.waitsun.com/mac-osx-ntfs.html)
[Mac怎么读写NTFS格式](https://jingyan.baidu.com/article/ed2a5d1f53dbb709f6be172e.html)