---
date: 2020-12-23
title: Flink数据类型映射大全
author: karezi
category: 
    - cheatsheet
tags:
    - flink
cover: https://flink.apache.org/img/flink-home-graphic.png
---
Flink 支持连接多种数据库，如MySQL、PostgresSQL、Derby。Derby通常用于测试。从关系数据库数据类型到Flink SQL数据类型的字段数据类型映射如下表所示，映射表可以帮助在Flink中轻松定义JDBC表。

<!-- more -->

|MySQL type|PostgreSQL type|Flink SQL type|
|-----|-----|-----|
|TINYINT||TINYINT|
|SMALLINT,<br>TINYINT UNSIGNED|SMALLINT,<br>INT2,<br>SMALLSERIAL,<br>SERIAL2|SMALLINT|
|INT,<br>MEDIUMINT,<br>SMALLINT UNSIGNED|INTEGER,<br>SERIAL|INT|
|BIGINT,<br>INT UNSIGNED|BIGINT,<br>BIGSERIAL|BIGINT|
|BIGINT UNSIGNED||DECIMAL(20,0)|
|BIGINT|BIGINT|BIGINT|
|FLOAT|REAL,<br>FLOAT4|FLOAT|
|DOUBLE,<br>DOUBLE PRECISION|FLOAT8,<br>DOUBLE PRECISION|DOUBLE|
|NUMERIC(p, s),<br>DECIMAL(p, s)|NUMERIC(p, s),<br>DECIMAL(p, s)|DECIMAL(p, s)|
|BOOLEAN,<br>TINYINT(1)|BOOLEAN|BOOLEAN|
|DATE|DATE|DATE|
|TIME [(p)]|TIME [(p)] [WITHOUT TIMEZONE]|TIME [(p)] [WITHOUT TIMEZONE]|
|DATETIME [(p)]|TIMESTAMP [(p)] [WITHOUT TIMEZONE]|TIMESTAMP [(p)] [WITHOUT TIMEZONE]|
|CHAR(n),<br>VARCHAR(n),<br>TEXT|CHAR(n),<br>CHARACTER(n),<br>VARCHAR(n),<br>CHARACTER VARYING(n),<br>TEXT|STRING|
|BINARY,<br>VARBINARY,<br>BLOB|BYTEA|BYTES|
||ARRAY|ARRAY|

在API中，Flink尝试使用反射从类信息中自动提取数据类型，以避免重复的手动模式工作。但是，反射性地提取数据类型并不总是成功的，因为可能会丢失逻辑信息。因此，可能需要在类或字段声明附近添加其他信息以支持提取逻辑。下表列出了无需进一步信息即可隐式映射到数据类型的类。
注意：如果您打算在 Scala 中实现类，建议使用包装类型（例如java.lang.Integer）而不是 Scala 的原语。Scala的原语（例如Intor Double）被编译为JVM 原语（例如 int/double）并产生NOT NULL如下表所示的语义。此外，在泛型中使用的Scala原语（例如java.util.Map[Int, Double]）在编译期间会被删除，并导致类信息类似于java.util.Map[java.lang.Object, java.lang.Object]。
|Java Class|Data Type|
|-----|-----|
|java.lang.String|STRING|
|java.lang.Boolean|BOOLEAN|
|boolean|BOOLEAN NOT NULL|
|java.lang.Byte|TINYINT|
|byte|TINYINT NOT NULL|
|java.lang.Short|SMALLINT|
|short|SMALLINT NOT NULL|
|java.lang.Integer|INT|
|int|INT NOT NULL|
|java.lang.Long|BIGINT|
|long|BIGINT NOT NULL|
|java.lang.Float|FLOAT|
|float|FLOAT NOT NULL|
|java.lang.Double|DOUBLE|
|double|DOUBLE NOT NULL|
|java.sql.Date|DATE|
|java.time.LocalDate|DATE|
|java.sql.Time|TIME(0)|
|java.time.LocalTime|TIME(9)|
|java.sql.Timestamp|TIMESTAMP(9)|
|java.time.LocalDateTime|TIMESTAMP(9)|
|java.time.OffsetDateTime|TIMESTAMP(9) WITH TIME ZONE|
|java.time.Instant|TIMESTAMP_LTZ(9)|
|java.time.Duration|INVERVAL SECOND(9)|
|java.time.Period|INTERVAL YEAR(4) TO MONTH|
|byte[]|BYTES|
|T[]|ARRAY&lt;T&gt;|
|java.util.Map&lt;K, V&gt;|MAP&lt;K, V&gt;|
|structured type T|anonymous structured type T|

> 参考
> https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/types/
> https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/table/jdbc/