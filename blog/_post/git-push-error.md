---
date: 2020-11-12
title: Git push错误解决：You must verify your email address
author: karezi
category: 
    - bug
tags:
    - git
---
错误提示如下： 
```bash
remote: You must verify your email address.
remote: See https://github.com/settings/emails.
fatal: unable to access 'https://github.com/yourname/yourproject.git/': The requested URL returned error: 403
```
官网上邮箱上已经验证，SSH keys已经添加，百度上很多方法都尝试了都无效。最后用这个方法解决了：
直接用账号密码push
```bash
git push https://username:password@github.com/yourname/yourproject.git
```
将`username`和`password`替换成你github的账号和密码即可上传成功