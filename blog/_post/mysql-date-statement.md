---
date: 2022-01-21
title: MySQL统计日期语句大全
author: karezi
category: 
    - cheatsheet
tags:
    - mysql
---
### 今天
```SQL
SELECT * FROM 表名 WHERE TO_DAYS(时间字段名) = TO_DAYS(NOW());
SELECT * FROM 表名 WHERE DATE(时间字段名) = CURDATE();
```
### 昨天
```SQL
SELECT * FROM 表名 WHERE DATE_SUB(CURDATE(), INTERVAL 1 DAY) <= DATE(时间字段名)
SELECT * FROM 表名 WHERE TO_DAYS(NOW()) - TO_DAYS(时间字段名) <= 1
```
### 近7天/1周
```SQL
SELECT * FROM 表名 WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= DATE(时间字段名)
SELECT * FROM 表名 WHERE TO_DAYS(NOW()) - TO_DAYS(时间字段名) <= 7
```
### 近30天
```SQL
SELECT * FROM 表名 WHERE DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= DATE(时间字段名)
SELECT * FROM 表名 WHERE TO_DAYS(NOW()) - TO_DAYS(时间字段名) <= 30
```
### 查询近6个月/半年的数据
```SQL
SELECT * FROM 表名 WHERE 时间字段名 BETWEEN DATE_SUB(NOW(),INTERVAL 6 MONTH) AND NOW()
```
### 本周
```SQL
SELECT * FROM 表名 WHERE YEARWEEK(DATE_FORMAT(时间字段名, '%Y-%m-%d'))=YEARWEEK(NOW())
```
### 上周
```SQL
SELECT * FROM 表名 WHERE YEARWEEK(DATE_FORMAT(时间字段名, '%Y-%m-%d'))=YEARWEEK(NOW())-1
```
### 本自然月
```SQL
SELECT * FROM 表名 WHERE DATE_FORMAT(时间字段名, '%Y%m') = DATE_FORMAT( CURDATE(), '%Y%m')
SELECT * FROM 表名 WHERE DATE_FORMAT(时间字段名, '%Y-%m')=DATE_FORMAT(NOW(), '%Y-%m')
```
### 上一自然月
```SQL
SELECT * FROM 表名 WHERE PERIOD_DIFF(DATE_FORMAT(NOW() , '%Y%m'), DATE_FORMAT(时间字段名, '%Y%m'))=1
SELECT * FROM 表名 WHERE DATE_SUB(CURDATE(), INTERVAL 1 MONTH) <= DATE(时间字段名);
SELECT * FROM 表名 WHERE DATE_FORMAT(时间字段名, '%Y-%m')=DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')
```
### 本季度
```SQL
SELECT * FROM 表名 WHERE QUARTER(时间字段名)=QUARTER(NOW())
```
### 上季度
```SQL
SELECT * FROM 表名 WHERE QUARTER(时间字段名)=QUARTER(DATE_SUB(NOW(),INTERVAL 1 QUARTER))
```
### 今年
```SQL
SELECT * FROM 表名 WHERE YEAR(时间字段名)=YEAR(NOW())
```
### 去年
```SQL
SELECT * FROM 表名 WHERE YEAR(时间字段名)=YEAR(DATE_SUB(NOW(),INTERVAL 1 YEAR))
```