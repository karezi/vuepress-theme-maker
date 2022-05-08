---
date: 2020-10-10
title: Ubuntu上使用letsencrypt申请免费https
author: karezi
category: 
    - tutorial
tags:
    - ubuntu
    - https
---
## 安装
- 更新apt安装源
```
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-nginx（不一定奏效）
```

<!-- more -->

- 安装软件
```
$ sudo apt-get install letsencrypt
$ pip3 install -U letsencrypt-nginx（不一定奏效）
```
- 证书生成
standalone模式需要关闭nginx
```
$ /etc/init.d/nginx stop
$ letsencrypt certonly --standalone --preferred-challenges tls-sni -d x.wocourse.com（--preferred-challenges tls-sni为使用443端口）
```

## 检查/etc/letsencrypt/live/www.xxx.com 目录，已经生成证书文件
- cert.pem: 你不用关心 (这个实际上是服务器证书文件)
- chain.pem: 你不用关心 (这个实际上是… 自己看文档吧, 我没读懂. 貌似是个递归查找用的链式证书)
- fullchain.pem: cert.pem + chain.pem 的合体. 需要配置到 nginx 配置文件中的 `ssl_certificate` . 
- privkey.pem: 私钥. 需要配置到 nginx 配置文件中的 `ssl_certificate_key` .
修改nginx配置
```
$ nginx -t
$ /etc/init.d/nginx start
```

## 定时续约证书
- 增加定时器任务
```
$ crontab -e
```
- 编辑增加任务(要先关闭80端口的占用，然后更新证书，再启用80端口的服务)。每月1号夜里凌晨3:00续签（简单版）
```
0 3 1 * * service nginx stop & letsencrypt renew & service nginx start
???
```
## 更新ssl证书（复杂版）
```
0 5 3 * * echo `date -R` >> /var/log/lets.crontab.log; certbot renew --force-renewal >> /var/log/lets.crontab.log 2>&1 ; nginx -s reload
```
## 更新ssl证书（最终版）每月12日3:00运行
```
0 3 12 * * echo `date -R` >> /var/log/lets.crontab.log; (/etc/init.d/nginx stop; letsencrypt renew; /etc/init.d/nginx start) >> /var/log/lets.crontab.log 2>&1
0 3 12 * * echo `date -R` >> /var/log/lets.crontab.log; (/etc/init.d/nginx stop; /opt/eff.org/certbot/venv/bin/letsencrypt renew; /etc/init.d/nginx start) >> /var/log/lets.crontab.log 2>&1
```
[crontab命令](https://www.cnblogs.com/peida/archive/2013/01/08/2850483.html)

## 参考资料
[Ubuntu上使用letsencrypt获得免费的HTTPS证书](https://zhuanlan.zhihu.com/p/29708546)
[ubuntu 14.04 Let's Encrypt永久免费SSL证书安装教程](https://blog.csdn.net/tianjiewang/article/details/79627941)
[Let's Encrypt，免费好用的 HTTPS 证书](https://imququ.com/post/letsencrypt-certificate.html)
[ubuntu 生成https证书 for let's encrypt](https://www.cnblogs.com/gabin/p/6844481.html)
[Install Let's Encrypt to Create SSL Certificates](https://www.linode.com/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates/)
[https 证书工具 Letsencrypt 简单教程](https://blog.csdn.net/Dancen/article/details/81311688)
[Ubuntu 16.04 上获取Let's Encrypt免费证书](https://blog.csdn.net/kangear/article/details/80546945)
[(Let’s Encrypt) certbot 删除证书的方法](https://www.liuhaolin.com/note/295.html)