---
date: 2022-01-20
title: MySQL日期格式化参数大全
author: karezi
category: 
    - cheatsheet
tags:
    - mysql
---
```sql
DATE_FORMAT(date, format)

# format包括
%Y 年份【4位】
%y 年份【2位】
%X 年份【4位】，星期日是周第一天，与%V使用
%x 年份【2位】，星期一是周第一天，与%v使用

%M 月份名(January、February、March、April、May、June、July、August、September、October、November、December)
%b 月份名【缩写】(Jan、Feb、Mar、Apr、May、Jun、Jul、Aug、Sep、Oct、Nov、Dec)
%m 月份(00~12)
%c 月份(1~12)

%d 月中天数(00~31)
%e 月中天数(0~31)
%D 月中天数【带英语后缀】(1st、2nd、3rd、4th、5th等等）
%j 年中天数(001~366)
			   
%U 年中第几周(00~52), 星期日是周第一天
%u 年中第几周(00~52), 星期一是一周第一天
%V 年中第几周(01~53)，星期日是周第一天，与%X使用
%v 年中第几周(01~53)，星期一是周第一天，与%x使用
%W 星期名(Monday、Tuesday、Wednesday、Thursday、Friday、Saturday、Sunday)
%a 星期名【缩写】(Mon、Tue、Wed、Thu、Fri、Sat、Sun)
%w 星期编号(0=Sunday~6=Saturday）

%H 24小时制小时(00~23)
%h 12小时制小时(01~12)
%I 12小时制小时(01~12)
%k 24小时制小时(0~23)
%l 12小时制小时(1~12)
%i 分钟(00~59)
%S 秒(00~59)
%s 秒(00~59)
%f 微妙
%T 24小时制时间(HH:mm:ss)
%r 12小时制时间(hh:mm:ss [AM/PM])
%p AM或PM

%% 一个文字“%”

# 最常用：%Y-%m-%d %H:%i:%s
SELECT FROM_UNIXTIME(UNIX_TIMESTAMP(),'%Y-%m-%d %H:%i:%s')
# 2022-03-29 23:52:37
```