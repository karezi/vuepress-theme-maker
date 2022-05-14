---
date: 2022-01-12
title: Java的亿点点知识简版
author: karezi
category: 
    - java
tags:
    - java
cover: https://i.loli.net/2021/01/28/WJQC2wNIrFkovxT.jpg
---
本文整理了Java技术栈相关的知识点，Java技术浩如烟海，这里仅抛砖引玉。

<!-- more -->

> TIPS：目前自用为主，借鉴了很多别的博主的图，可能在参考文献中没有注明全，侵删。

## JVM

### JVM内存结构/区域/运行时数据区

<img src="https://i.loli.net/2021/01/28/lyn57tPkbXV19IU.png" width="50%" />

- 线程共享（堆、非堆（方法区（运行时常量池））=>元空间【1.8】）

- 线程私有（n进程（虚拟机栈（n栈帧（局部变量表bbcsilfdr、操作栈、动态链接、方法出口））、本地方法栈、程序计数器））

- 直接内存（元空间）

### GC算法

- 分代：新生代（Eden、From/S0、To/S1）Minor GC、老年代 Major GC=Full GC、永久代/元空间

	<img src="https://i.loli.net/2021/01/28/WJQC2wNIrFkovxT.jpg" alt="img" style="zoom:80%;" />

- 存活性判断：
  - 引用计数法（循环引用）
  - 可达性分析（GCRoots：寄存器/活跃线程、虚拟机栈[栈帧的本地变量表]、全局变量空间[方法区类静态属性、方法区常量变量]、本地方法栈中JNI[Native方法]）

- Java使用的GC机制
  - 标记清除（效率、空间）：对象存活多、老年代；提前GC、碎片空间、扫描两次
  - 标记复制：对象存活少、扫描整个空间、年轻代；需要空闲空间、需要复制移动对象
  - 标记整理
  
- 强软弱虚

- Full GC发生的时机：老年代写满、system.gc()、持久代空间不够

- Hotspot垃圾回收器
  - 新生代：Serial、ParNew、Parallel Scaveage
  - 老年代：CMS（CPU敏感、浮动垃圾、空间碎片）、Serial Old(MSC)、Parallel Old
  - 跨新老：G1（弱化分代、标记整理、预设停顿、利用多核减少STW；young gc、mixed gc；-XX:G1HeapRegionSize）、ZGC

### Java对象创建过程和结构

- 类加载检查-分配内存-初始化零值-设置对象头-执行init方法

- 分配内存方法：指针碰撞（内存规整）、空闲列表（内存不规整）

- 内存分配并发问题：CAS+失败重试、TLAB

- 对象=对象头（Mark Word+KClass Pointer+数组长度（数组对象独有））+实例数据+对齐填充

- Mark Word

  ![img](https://i.loli.net/2021/01/28/O3VpdHgJriuvMIn.jpg)

### Java类文件结构

- 魔术字（CAFEBABE）+低高版本号+常量池（数+信息）+访问标志+类索引+父类索引+接口interface（数+信息）+成员变量（字段field）（数+信息）+方法method（数+信息）+属性attribute（数+信息）

### Java类加载机制

- 生命周期

  1. 加载：生成一个class对象
  2. 连接

  ​	2.1. 验证：文件格式、元数据、字节码、符号引用

  ​	2.2. 准备：默认值、static会分配内存

  ​	2.3. 解析：具体类的信息，引用等

  3. 初始化：父类没初始化先初始化父类

  4. 使用

  5. 卸载

- 加载方式：main()、class.forName、ClassLoader.loadClass
- 类加载器：BootstrapClassLoader、ExtensionClassLoader、ApplicationClassLoader、User Defined ClassLoader
- 双亲委派原则（父类加载，避免重复加载、安全）

### JVM调优情况

- 问题现象分类->根据分类猜想原因->通过工具/实验验证猜想->问题方案
- StackOverflow
  - 无限递归->添加返回条件
  - 栈过深->是否可以修改成非递归，改栈的大小
- OOM几种情况
  - 内存泄漏（GC后不能回到原来水平）
  - 大对象不断产生且生命周期过长
- OOM解决方案
  - help dump、生产机dump、mat、jmap、-helpdump
  - 优化代码
  - JVM调优
  - 加内存
- CPU过高的几种情况
  - 线程死锁
  - 锁争用/活锁
  - 死循环
- CPU过高解决方案
  - 查看是否是Java导致的
  - 看日志是否有报错
  - Java进程消耗CPU过高（topc -c、top -Hp pid、jstack进制转换、cat）
- 卡顿
  - 锁争用
  - 垃圾回收频繁（调整JVM参数Ratio等）
  - 服务器网络磁盘硬件性能
  - 其他框架（数据库、中间件）
- 卡顿解决方案
  - 查看CPU、内存、网络带宽占用等参数状态，猜想问题在哪里
  - 系统层面优化，比如加大fd
  - 从前端->后端->数据库查找性能瓶颈在哪里

### 逃逸分析

- 栈上分配对象
- 标量替代
- 锁粗化、锁消除

### JVM调优技巧

- 设置堆：-xms、-xmx
- 调整老年代和新生代比例：-XX:newSize设置绝对大小
- 是否存在很多持久对象和临时对象
- 峰值老年代情况，不影响GC就加大年轻代
- 配置好的机器可以用并发收集算法
- 每个线程默认会开启1M的堆栈存放栈帧 调用参数 局部变量太大了 500k够了
- 原则：减少gc和stw

### JVM性能检测工具

- 常用：dump、自动dump、dump分析
- [jps](https://www.cnblogs.com/wxisme/p/9878494.html#_label1)、[jinfo](https://www.cnblogs.com/wxisme/p/9878494.html#_label2)、[jstat](https://www.cnblogs.com/wxisme/p/9878494.html#_label3)、[jstack](https://www.cnblogs.com/wxisme/p/9878494.html#_label4)、[jmap](https://www.cnblogs.com/wxisme/p/9878494.html#_label5)、[jhat](https://www.cnblogs.com/wxisme/p/9878494.html#_label6)
- [jconsole,jvisualvm](https://www.cnblogs.com/wxisme/p/9878494.html#_label7)、jprofiler、MAT
- 阿里Arthas

## JUC

> java.util.concurrent

### 线程生命周期

<img src="https://i.loli.net/2021/01/28/HmOVA3taTQM4cFB.png" alt="Java 线程状态变迁 " style="zoom:67%;" />

### 死锁条件和破除

- 死锁条件与避免：互斥（×）
- 请求与保持（一次性申请）
- 不可剥夺（主动释放）
- 循环等待（按序申请）

### 并发三性

| 特性   | volatile     | synchronized | Lock     | Atomic   |
| :----- | :----------- | :----------- | :------- | :------- |
| 原子性 | 无法保障     | 可以保障     | 可以保障 | 可以保障 |
| 可见性 | 可以保障     | 可以保障     | 可以保障 | 可以保障 |
| 有序性 | 一定程度保障 | 可以保障     | 可以保障 | 无法保障 |

### sleep & wait

- sleep带锁睡觉【暂停执行-自动苏醒】
- wait释放锁【线程交互/通讯-无参不主动醒】

### Synchronized

- Monitor：EntryList、Owner、WaitSet
- 修饰：实例对象（对象头）、静态方法（ACC_SYNCHRONIZED）、代码块（monitorenter、monitorexit、count）
- 锁膨胀：无锁-偏向锁（Mark Word线程信息cas比较）-轻量锁（复制Mark Word为Lock Record，cas尝试改变指针）-自旋-重量锁（用户态内核态切换）
- 1.6之后新技术：自旋锁、适应性自旋锁、锁消除、锁粗化、偏向锁、轻量级锁
- 双重检验锁方式实现单例模式
- 特性：有序性（as-if-serial、happens-before）、可见性（内存强制刷新）、原子性（单一线程持有）、可重入（计数）、非公平
- 与Lock的区别（层面、释放、中断、拿锁情况、锁住什么、Lock有读锁、公平）

### Volatile

- 缓存一致性协议MESI（缓存行、锁bus、总线风暴）

- JMM内存模型

![数据不一致](https://i.loli.net/2021/01/28/nBvHeA6LqjOkhPI.jpg)

- 可见性：嗅探机制（处理器嗅探总线），强制失效

- 有序性：禁止指令重排序（lock前缀指令 内存屏障，as-if-serial，happens-before）
- 跳出死循环

### ThreadLocal

- 解决什么问题：减少临界区范围、线程切换、使用读写锁或copyonwrite机制
- 源码：ThreadLocalMap（内存泄露）
- session

### Atomic原子类

- 包含Integer[Array]、Long[Array]、Boolean、Reference[Array]、StampedReference（解决ABA）、MarkableReference等等
- 线程安全原理：CAS+Volatile+Native（unsafe）

### Lock

#### ReentrantLock

- NonfairSync（tryAcquire、acquireQueued、CAS）
- FairSync（hasQueuedPredecessors、可重入）
- 公平可选、可重入
- Condition选择性通知

#### ReentrantReadWriteLock

- ReadLock
- WriteLock

#### StampedLock

#### AQS（AbstractQueuedSynchronizer）

- 原理：CLH、state、独占与共享、模板方法
- 头节点设计
- 自定义AQS：重写isHeldExclusively、tryAcquire、tryRelease、tryAcquireShared、tryReleaseShared
- CAS（实际应用、存在的问题（CPU/一个共享变量原子操作/ABA）和解决（-/AtomicReference/时间戳 标志位））
- CountDownLatch：倒计时器（A等待BCD都完成后开始工作）只有一个构造方法、只会被赋值一次、没有别的方法可以修改count
- CyclicBarrier：循环栅栏（ABCD都到达后再继续运行）

### 线程池

- 好处：降低资源消耗、提高响应速度、提高线程可管理性

- Exercutors弊端：**FixedThreadPool 和 SingleThreadExecutor**允许请求的队列长度为 Integer.MAX_VALUE ，可能堆积大量的请求，从而导致OOM；**CachedThreadPool 和 ScheduledThreadPool**允许创建的线程数量为 Integer.MAX_VALUE ，可能会创建大量线程，从而导致OOM

- ThreadPoolExecutor七大参数：

  int corePoolSize：核心线程数

  int maximumPoolSize：最大线程数

  long keepAliveTime：空闲时间，等待的时间超过了 `keepAliveTime`才会被回收销毁，allowCoreThreadTimeOut

  TimeUnit unit： `keepAliveTime`时间单位

  BlockingQueue<Runnable> workQueue：等待队列（LinkedBlockingQueue无界当心OOM、ArrayBlockingQueue有界/加锁/死循环阻塞队列不满时唤醒/入队、Synchronous）

  ThreadFactory threadFactory：创建新线程的时候会用到

  RejectedExecutionHandler handler：饱和策略（AbortPolicy：默认拒绝，直接抛出异常【直接异常】；CallerRunsPolicy：调用当前线程池的所在的线程去执行被拒绝的任务【直接执行】；DiscardPolicy：什么也不干【直接抛弃】；DiscardOldestPolicy：抛弃任务队列中最旧的任务也就是最先加入队列的，再把这个新任务添加进去【去旧纳新】；自定义）

- 使用Has表维护线程的引用

- submit：使用Future获取任务执行结果

- 工作流程

  ![图解线程池实现原理](https://i.loli.net/2021/01/28/mHx7NJupZUXYWge.png)
  
- 运行状态：Volatile的状态码running/shutdown/stop/terminated

- largestPoolSize

- 实际应用（商品详情界面、批处理）

- 故障

### 创建线程的方法

- 无返回值（Thread、Runnable）
- 返回值（Callable（Executors可以转化）、FutureTask；execute()、submit()（返回Future））

### 线程通讯方法

- wait/notify
- 共享变量sync
- Lock同步机制
- volatile
- CountDownLatch/CyclicBarrier

### 进程通讯方法

- 管道
- 信号量
- 信号
- 消息队列
- 共享内存
- Socket

### 实现生产者消费者模型

- 锁
- 信号量
- 线程通讯
- 阻塞队列（双端队列工作密取）

## Collection

- 快速失败 (fail-fast) 和安全失败 (fail-safe) 

### List

- ArrayList（数组、优缺点）
- LinkedList（双向链表、优缺点）
- Vector, Stack
- ArrayList扩容机制

### Queue

- Deque, LinkedList
- [PriorityQueue底层原理](https://www.cnblogs.com/CarpenterLee/p/5488070.html)
- [BlockingQueue](https://www.cnblogs.com/WangHaiMing/p/8798709.html)
- 常用方法

| 操作类型                 | 抛出异常  | 返回特殊值               | 阻塞等待 |
| ------------------------ | --------- | ------------------------ | -------- |
| Insert（“尾部”添加）     | add(e)    | offer(e[,timeout, unit]) | put(e)   |
| Delete（删除并返回头部） | remove()  | poll([,timeout, unit])   | take()   |
| Examine（获取但不删除）  | element() | peek()                   |          |

### Set

- HashSet, TreeSet
- equals和==和hashCode

### Map

- HashMap（数据结构、头尾插、扩容机制、2的幂次技巧、equals重写）
- ConcurrentHashMap（fail-first、数据结构、锁、如何保障并发）
- LinkedHashMap-LRU

### Tree

- BTree（B、B+、B*）
- 红黑树
- 前缀树
- [二叉树、平衡二叉树、红黑树、B树、B+树与B*树](https://www.jianshu.com/p/b597aa97c9de)

### 图

- 单源最短路

## MySQL 

> 应用最广的关系型数据库

### 逻辑架构

- 系统架构图

![img](https://i.loli.net/2021/01/28/rXT9njypogDlbWi.png)

- 查询过程

  <img src="https://i.loli.net/2021/01/28/dpcifT79y1xvRFO.jpg" alt="img" style="zoom:50%;" />

- 逻辑存储结构

  段(segment)、区(extent)、页(page)、行(row)

  <img src="https://i.loli.net/2021/01/28/VXNFxGcT98zlyhW.jpg" alt="img" style="zoom:50%;" />

- 驱动表：JOIN

### 索引

- MySQL B+树
- Hash：等值查询
- 聚簇索引和非聚簇索引（多扫描一次减少回表）
- 覆盖索引：减少IO
- 联合索引与最左原则
- 索引下推：减少回表
- 索引维护：页满了 页分裂 页利用率下降、数据删除 页合并、自增 只追加可以不考虑 也分页、索引长度
- 索引选择：
  - 普通索引：找到第一个之后，直到碰到不满足的
  - 唯一索引：找到第一个不满足就停止了
  - 覆盖索引：包含主键索引值
  - 最左前缀原则：安排字段顺序
  - 索引空间问题：hash
  - 5.6之后索引下推：不需要多个回表，一边遍历，一边判断
  - 页的概念
  - 更新：change buffer、更新操作来了 如果数据页不在内存 就缓存下来 下次来了 更新 在就直接更新、唯一索引 需要判断 所以用不到change buffer、innodb处理流程（记录在页内存（唯一索引 判断没冲突插入、普通索引 插入）、记录不在页（数据页读入内存 插入、change buffer）、数据读是随机IO成本高、机械硬盘change buffer收益大 写多都少 marge）

### 事务

- 四大特性：ACID——原子性、一致性、隔离性、持久性
- 并发事务问题：脏读（别人写没提交）、丢失修改（覆盖了别人写）、不可重复读（别人修改在两次读之间提交）、幻读（别人插入/删除在两次读之间提交）
- SQL隔离级别：读取未提交【没视图概念都是返回最新的】、读取已提交【阻止脏读/不同的read view】、可重复读（MySQL默认-Next-key Lock）【阻止脏+不可重复/用一个read view】、可串行化【都阻止了】
- 回滚日志：没更早的read view删除，5.5之前回滚段删了文件也不会变小

### 锁

- MVCC
  - 版本链：在聚簇索引中，有两个隐藏列trx_id roll_pointer
  - 读未提交：直接读取最新版本
  - 序列化：加锁
  - Read View：读已提交 每次读取前生成一个、可重复读 每一次生成一个
  - count 1* mvcc影响
- 全局锁：全库逻辑备份
- 表锁：
  - lock table read/write
  - MDL(metadata lock)：5.5引入自动添加 读锁不互斥 写锁互斥、多个事务之前操作 如果查询的时候修改字段容易让线程池跑满（MySQL的information_scheme库的innodb_trx 表 找到对应长事务kill掉、alter table里面设定等待时间）
  - MyISAM是不支持表锁的
- 行锁
  - 需要的时候才加上，并不是马上释放，等事务结束才释放，两阶段锁协议
  - 死锁：超时时间 innodb_lock_wait_timeout 默认是50s太久 但是如果设置太短会误判 一般采用死锁监测、死锁机制 事务回滚 innodb_deadlock_detect=on
  - 热点行：死锁消耗CPU 临时关闭 关掉死锁会出现大量重试、控制并发度 更多的机器 开启比较少的线程 消耗就少了、分治
- 间隙锁
- 读写锁
  - 读：lock in share mode、for update、行锁
  - 写
- innodb如何加锁
  - Record lock：对索引项加锁
  - Gap lock：对索引之间的间隙，第一条记录前最后一条记录后的间隙加锁
  - Next-key：前两种组合，对记录及前面的间隙加锁

### 日志

- undo log：回滚MVCC
- redo log：物理日志 内存操作记录 sync_binlog可以优化日志写入时机
- binlog：组提交机制，可以大幅度降低磁盘的IOPS消耗
- 2pc：redo准备 binlog提交

### 优化

- 选取最合适的的字段属性

- 选取合适的引擎

- 索引优化流程

  - 预先跑sql explain
  - 排除缓存sql nocache
  - 看一下行数对不对，不对可以用analyze table t 纠正
  - 添加索引，索引不一定是最优的，force index强制走索引，不建议用
  - 存在回表的情况吗？
  - 覆盖索引避免回表，不要*，主键索引
  - 联合索引不能无限建，高频场景
  - 最左前缀原则，按照索引定义的字段顺序写sql
  - 合理安排联合索引的顺序
  - 5.6之后，索引下推，减少回表次数
  - 给字符串加索引：前缀索引、倒序存储、Hash
  - 数据库的flush时机：redo log满了 修改checkpoint flush到磁盘，系统内存不足淘汰数据页 buffer pool（要知道磁盘io能力 设置innodb_io_capacity设置为磁盘的IOPS fio测试、innodb_io_capacity设置低了 会让innoDB错误估计系统能力 导致脏页累积），系统空闲的时候找间隙刷脏页，MySQL正常关闭 会把内存脏页flush到磁盘
  - innoDB刷盘速度：脏页比例，redolog写盘速度，innodb_flush_neighbors 0（机械硬盘的随机io不太行 减少随机io性能大幅提升 设置为1最好、现在都是ssd了 设置为0就够了 8.0之后默认是0）
  - 索引字段不要做函数操作，会破坏索引值的有序性，优化器会放弃走树结构：如果触发隐式转换，那也会走cast函数，会放弃走索引
  - 字符集不同可能走不上索引：convert也是函数所以走不上

- 缓存、生成视图

- 读写分离

- 大表：分库、分表、分区

- [SQL优化](https://www.changchenghao.cn/n/174426.html)

  - SQL语句中IN包含的值不应过多
  - SELECT语句务必指明字段名称
  - 当只需要一条数据的时候，使用limit 1
  - 如果排序字段没有用到索引，就尽量少排序
  - 如果限制条件中其他字段没有索引，尽量少用or
  - 尽量用union all代替union
  - 不使用ORDER BY RAND()
  - 区分in和exists、not in和not exists
  - 使用合理的分页方式以提高分页的效率
  - 分段查询
  - 避免在where子句中对字段进行null值判断
  - 不建议使用%前缀模糊查询
  - 避免在where子句中对字段进行表达式操作
  - 避免隐式类型转换
  - 对于联合索引来说，要遵守最左前缀法则
  - 注意范围查询语句
  - 关于JOIN优化

- Explain**必要时可以使用force index来强制查询走某个索引**

  ![img](https://i.loli.net/2021/01/28/xymiMFwKjuZgQ2h.jpg)

  - **type列，**连接类型。一个好的SQL语句至少要达到range级别。杜绝出现all级别。
  - **key列，**使用到的索引名。如果没有选择索引，值是NULL。可以采取强制索引方式。
  - **key_len列，**索引长度。
  - **rows列，**扫描行数。该值是个预估值。
  - **extra列，**详细说明。注意，常见的不太友好的值，如下：Using filesort，Using temporary。

- 增加服务器内存、CPU及网络带宽

- id用完了：bigint、row_id没设置主键的时候、thread_id

- IO性能瓶颈：设置 binlog_group_commit_sync_delay 和 binlog_group_commit_sync_no_delay_count参数，减少binlog的写盘次数。这个方法是基于“额外的故意等待”来实现的，因此可能会增加语句的响应时间，但没有丢失数据的风险。将sync_binlog 设置为大于1的值（比较常见是100~1000）。这样做的风险是，主机掉电时会丢binlog日志。将innodb_flush_log_at_trx_commit设置为2。这样做的风险是，主机掉电的时候会丢数据。

- 常用命令：

  - show_processlist：查看空闲忙碌链接，wait_timeout 客户端空闲时间（定时断开链接、mysql_reset_connection恢复链接状态）
  - innodb_flush_log_at_trx_commit：redolog事务持久化
  - sync_binlog：binlog事务持久化

- 故障实战：数据库挂了  show processlist 一千个查询在等待 有个超长sql kill 但是不会引起flush table 周末 优化脚本 analyze 会导致 MySQL 监测到对应的table 做了修改 必须flush close reopen 就不会释放表的占用了

### 高可用

- 主备延迟：强制走主，sleep

- 分库分表：唯一主键

## Redis

> 内存数据库，缓存利器

### 优势

- 高并发
- 持久化
- 丰富的数据结构
- 高可用
- 事务

### 线程模型：多路复用IO

- read到很多才返回，为0会卡在那里，直到新数据来或者链接关闭
- 写不会阻塞除非缓冲区满了
- 非阻塞的IO提供了一个选项no_blocking读写都不会阻塞，读多少写多少，取决于内核的套接字字节分配
- 非阻塞IO也有问题，线程要读数据，读了一点就返回，线程什么时候知道继续读？写一样
- 一般都是select解决，但是性能低，现在都用epoll

<img src="https://i.loli.net/2021/01/28/iH9XVwlWj526Ups.jpg" alt="img" style="zoom:50%;" />

### 内存模型

- 简单动态字符串SDS：键值的底层、AOF缓冲区、记录本身长度 C需要遍历、修改字符减少内存重新分配（空间预支配、惰性空间释放）、二进制安全（C只能保存文本数据，无法保存图片等二进制数据；SDS是使用长度去判断）、杜绝缓冲区溢出、兼容部分C字符串函数
- 链表（保存多个客户端的状态信息、列表订阅发布、慢查询、监视器）
- 字典（数据库、哈希键、Hash表节点、Hash冲突用单向链表解决、渐进式rehash-逐渐rehash新的键值对全部放到新hash表、每个字典带两个hash表-一个平时用，一个rehash时用）
- 压缩列表
- 整数集合
- 跳跃表
- 令牌
- 漏桶

![ redis 内部的存储结构如图示](https://i.loli.net/2021/01/28/scWbi643C5AJpda.jpg)

### 数据结构

- String：Binary-safe strings
- Hash
- Set
- ZSet/Sorted set：score、随即层数（只需要调整前后节点指针）、不止比较score还会比较value
- List：分页的坑
- Bitmap/Bit array
- HyperLogLog
- Stream
- Geo
- Pub/Sub

### [常用场景](https://cloud.tencent.com/developer/article/1415674)

- 热点缓存（set、hset）
- 限时业务（expire，验证码）
- 成绩、积分、排行榜（zzet：zadd、zrangebyscore）
- 分页/模糊搜索（zrangebylex）
- 计数器（incrby）
- 分布式会话（hset存储session）
- 分布式锁（setnx+expire）
- 社交网络（sismember）
- 最新列表（ltrim）
- 延时队列（时间做score，zrangebyscore）
- 消息队列（lpush、pub/sub）
- 位操作（setbit、getbit、bitcount）

### 过期策略

- 定时删除：消耗内存-创建一个定时器
- 惰性删除：可能存在大量key
- 定期删除：检查、删除，但是是随机的

### 内存淘汰策略/机制

- volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰
- volatile-ttl：从已设置过期时间的数据集中挑选将要过期的数据淘汰。这种策略使得我们可以向Redis提示哪些key更适合被eviction。
- volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰
- allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰。如果我们的应用对缓存的访问符合幂律分布（也就是存在相对热点数据），或者我们不太清楚我们应用的缓存访问分布状况，我们可以选择allkeys-lru策略。
- allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰。如果我们的应用对于缓存key的访问概率相等，则可以使用这个策略。
- noeviction：禁止驱逐数据，当内存使用达到阈值的时候，所有引起申请内存的命令会报错

### 高可用

#### 持久化

- RDB：5分钟一次、冷备、恢复快、快照文件生成久耗CPU

- AOF：appendOnly、数据齐全、回复慢文件大

- 数据初始化：从节点发送命令，主节点做bgsave，同时开启buffer

  <img src="https://i.loli.net/2021/01/28/IY6UokTF7hmBGZA.jpg" alt="img" style="zoom:67%;" />

#### 数据同步机制

- 主从同步：指令流、offset
- 快照同步：RDB、缓冲区

#### 哨兵

- 集群监控（Monitoring）：Sentinel不断的去检查你的主从实例是否按照预期在工作。
- 消息通知（Notification）：Sentinel可以通过一个api来通知系统管理员或者另外的应用程序，被监控的Redis实例有一些问题。
- 自动故障转移（Automatic failover）：如果一个主节点没有按照预期工作，Sentinel会开始故障转移过程，把一个从节点提升为主节点，并重新配置其他的从节点使用新的主节点，使用Redis服务的应用程序在连接的时候也被通知新的地址。
- 配置提供者/配置中心（Configuration provider）：Sentinel给客户端的服务发现提供来源：对于一个给定的服务，客户端连接到Sentinels来寻找当前主节点的地址。当故障转移发生的时候，Sentinels将报告新的地址。
- 脑裂

#### 集群

- 链表
- 多主：横向扩容
- 分片

### 事务

- 命令：MULTI-EXEC-DISCARD
- 不支持回滚：因为Redis命令只在语法、类型等编程错误的时候才出错，这个应该在上层解决

### 常见问题

- 缓存雪崩：加随机值、集群部署
- 缓存穿透：互斥锁、热点不失效
- 缓存击穿：BloomFilter
- 双写一致性：延时双删
- 并发竞争：分布式锁
- 大Key：bigkey命令，找到干掉；Redis4.0引入memory usage命令和lazyfree机制
- 热点Key：不失效、多级缓存、BloomFilter、读写分离、备份热key走不同机器
- 如何保证10w都是热点：最大内存（maxmemory）、淘汰策略、判断场景是加ttl还是淘汰时间

### 备用方案

- 主从+哨兵+cluster
- ecache+Hystix+降级+熔断+隔离
- 持久化

### 限流

- setnx ex
- zset：窗口滑动、zset会越来越大
- 令牌：定时push、然后leftpop、问题[空轮询、blpop、空连接异常、重试]
- 漏桶funnel：make_space灌水之前调用漏水，腾出空间，解决于流水速率，Hash，原子性有问题
- Redis-Cell

### [常用命令/Jedis](https://www.cnblogs.com/jxxblogs/p/12238552.html)

- Keys
- setnx
- expire
- scan

## ElasticSearch

> 非关系型数据库，搜索利器

### 术语

```
索引(Index)   ⇒ 类型(type)  ⇒ 文档(Docments)  ⇒ 字段(Fields)  
```

### 存储结构和算法

- Term Dictionary -> Term Index -> FST
- posting list -> Frame Of Reference
- Roaring bitmaps
- 多field：Skip List

### 分布式

## Spring

> 使用最广泛的Web应用框架

### 模块

![img](https://i.loli.net/2021/01/28/x1V59OP2ksQfDqR.png)

### IoC

### AOP

- 静态代理：实现类

- 动态代理：

  - JDK：实现接口，java反射机制生成一个代理接口的匿名类，调用具体方法的时候调用invokeHandler
  - CGLib：ASM字节码编辑技术动态创建类，基于ClassLoad装载，修改字节码生成子类去处理
  
  ![img](https://i.loli.net/2021/01/28/dLh9vZ3wMkJR2fe.png)

### Bean

- 注解
- 生命周期（扫描类invokeBeanFactoryPostProcessors、封装beanDefinition对象各种信息、放到map、遍历map、验证能否实例化/是否单例/是否factory bean/单例池ConcorrentHashMap/正在创建的容器）、得到class、推断构造方法[根据注入模型/默认]、得到构造方法、反射实例化对象、后置处理器合并beanDefinition、判断是否允许循环依赖、提前暴露bean工厂对象、填充属性自动注入、执行部分aware接口、继续执行部分aware接口生命周期回调方法、完成代理AOP、beanPostprocessor的前置方法、实例化为bean、放到单例池、销毁）
- 作用域（单例singleton、多例prototype、Request、Session）

### 循环依赖

- 情况：属性注入可以破解、构造器不行（三级缓存没自己，因为二级之后去加载B了）
- 三级缓存：去单例池拿、判断是不是正在被创建的、判断是否支持循环依赖、二级缓存放到三级缓存、干掉二级缓存gc、下次直接从三级拿
- 缓存存放：一级-单例bean、二级-工厂产生bean、三级-半成品

### 父子容器

### 事务实现原理

- 采用不同的连接器
- 用AOP新建立了一个链接（共享链接）
- ThreadLocal当前事务
- 前提是关闭AutoCommit

### 设计模式

- 单例
- 工厂
- 适配器：根据不同商家适配
- 责任链：继承process链路执行

### SpringMVC工作原理

### SpringBoot工作原理

## MyBatis

> 常用的数据库持久化（ORM）框架

### 时序图

<img src="https://i.loli.net/2021/01/28/r7RG2MhQ9DcWtwk.png" style="zoom:50%;" />

### XML中标签

### Dao的工作原理

### 分页原理

### 关联查询

### 延迟加载

### JPA

## Tomcat

### 核心组件和流程

- Connector连接器-对外交流
  - ProtocolHandler：封装通讯和I/O模型（EndPoint底层Socket通讯+Processor应用层协议解析）
  - Adapter：调用容器，生成ServletRequest和接受ServletResponse

- Container容器-对内处理
  - 继承LifeCycle生命周期（一键式启停）：init、start、stop、destroy
  - Mapper组件负责路由

<img src="https://i.loli.net/2021/01/28/ad9xDJRfMjEZ6AN.png" alt="图片" style="zoom:50%;" />

### 设计模式

- 核心原则：高内聚低耦合，找到子模块的变化点和不变点
- 组合模式：管理容器
- 观察者模式：发布启动事件达到解耦，满足开闭原则
- 骨架抽象类/模板方法：满足变与不变，代码复用，灵活扩展
- 责任链（Pipeline-Valve）：处理请求，记录日志等，满足开闭原则

### 打破双亲委派

- 目的：隔离Web应用

<img src="https://i.loli.net/2021/01/28/ZeIroAQaEz68WBd.png" alt="图片" style="zoom:40%;" />

## NginX



## Netty

> 高效网络（NIO）客户端/服务器（C/S）框架

### 核心组件

- NIO
  - NIO的类库和API还是有点复杂，比如Buffer的使用
  - Selector编写复杂，如果对某个事件注册后，业务代码过于耦合
  - 需要了解很多多线程的知识，熟悉网络编程
  - 面对断连重连、保丢失、粘包等，处理复杂
  - NIO存在BUG，根据网上言论说是selector空轮训导致CPU飙升，具体有兴趣的可以看看JDK的官网
- Bootstrap：netty的组件容器，用于把其他各个部分连接起来；如果是TCP的Server端，则为ServerBootstrap.
- Channel：代表一个Socket的连接
- EventLoopGroup：一个Group包含多个EventLoop，可以理解为线程池
- EventLoop：处理具体的Channel，一个EventLoop可以处理多个Channel
- ChannelPipeline：每个Channel绑定一个pipeline，在上面注册处理逻辑handler
- Handler：具体的对消息或连接的处理，有两种类型，Inbound和Outbound。分别代表消息接收的处理和消息发送的处理。
- ChannelFuture：注解回调方法

### 运行过程/执行链路

- 初始化Channel
- 注册Channel到Selector 任务队列
- 轮询Accept事件，处理建立channel的链接
- 注册Channel到Selector接收方
- 轮询写事件，开线程去处理，任务队列

![Figure%206](https://i.loli.net/2021/01/28/lYcZi76W8nfS5zj.jpg)

### 线程模型

### 线程组

- boss：监听端口所有准备就绪的时间
- work：监听准备工作

### TCP粘包拆包

### 零拷贝

![img](https://i.loli.net/2021/01/28/uSJBMYbNHvwrFCD.jpg)

## ZooKeeper

> 分布式应用程序协调服务

### 选举机制

### 过半机制

### 预提交

- ack
- 2pc

### ZAB协议

### zk节点宕机如何处理

### 如何实现分布式一致性

## [RocketMQ](https://github.com/apache/rocketmq/tree/master/docs/cn)

> 消息中间件

### 基础组成

- NameServer：无状态模式、broker向发心跳顺便带上所有的Topic信息、早期是zk后来改了
- Broker：中转消息，消息持久化、底层通讯基于Netty
- Producer：同步、异步、单向
- Consumer：pull、push

### 集群模式

- 多master
- 多master多slave异步复制
- 多master多slave双写

### 消费保证

- 发送成功后返回consume_success
- 回溯消费

### 高可用

- 集群：NameServer集群、Broker主从 双主 双从、Consumer自动切换、Producer链接两个Broker
- 刷盘：同步超时会返回错误、异步不返回
- 消息的主从复制：同步复制、异步复制
- 主从同步、异步刷盘

### 顺序消息

- Hash取模：MessageQueueSelector队列选择机制，消息发送 消息顺序由消费者保证，消费者是多线程

### 消息去重

- 幂等
- 去重：消息表主键冲突

### 分布式事务

- 最大努力：消息表、不断轮询、人工干预
- 半消息：发送半消息，发送成功，本地事务，觉得是否提交还是回滚，服务端没收到回查，检查本地事务，根据本地事务决定，提交
- 2/3pc
- 最终一致：预发，持久化，返回状态，发送处理结果，判断是否干掉持久化的发送

### 调用链路

- Producer和NameServer节点建立一个长连接
- 定期从NameServer获取Topic信息
- 并向Broker Master建立链接，发送心跳
- 发送消息给Broker Master
- Consumer从Master和Slave一起订阅消息

### 消息重试

- 顺序消息重试：不断重试16次 4小时46分钟 可以修改尝试次数，对一个消费者设置 组内都会设置，可以获取消息重试次数
- 无序消息重试

### 死信队列

- 不再被正常消费
- 保存3天
- 面向消费者组
- 控制台 重发 重写消费者 单独消费

### 事务消息

### 消息丢失

### 消息积压

- 决定是否丢弃
- 判断吞吐量
- 停止消费 加机器 加topic

## Dubbo

> 远程过程调用（RPC）框架

### 调用链路

<img src="https://i.loli.net/2021/02/27/18IOYmJ3b6vhaP2.png" alt="Architecture" style="zoom:50%;" />

### 服务暴露过程

- IoC启动加载Dubbo配置的标签
- 解析标签ServiceBean会生成一个Bean
- 实现了InitializingBean：afterpropertiesSet（get provider、set provider、各种信息保存在ServiceBean）
- IoC完成，还实现了一个ApplicationListener监听器：回调onapplicationEvent，是否暴露 不是延迟暴露
- 暴露：信息校验doexport（检查、doexportUrl暴露URL（加载注册中心、循环协议 端口（代理工厂获取invoke封装（暴露invoke（根据spi来、本地暴露、打开服务器exchangeServer、启动服务器netty监听端口、注册中心注册服务 注册表 执行器、暴露p和s两个invoke的map保存了地址）、spi）））

### 服务引用

- factorybean->getObject->get：init
- 信息检查：创建代理对象createProxy
- 远程引用，获取到zk，获取到信息，订阅：dubbo执行远程引用
- 创建Netty客户端：返回invoke，注册到注册表中去
- 成功

### SPI

- Java SPI：Java没IoC、AOP
- 具体的SPI kv形式：静态代理

### 容错机制

- failover：直接切换
- failfast：快速失败
- failsafe
- failback
- forking cluster
- broadcast cluster
- 整合hystrix：失败回调、返回默认

### 降级

- return null
- 失败返回空

### 负载均衡

- 随机加权
- 轮询
- 最少活跃数
- hash一致

### 选举算法

### 注册中心

### 协议

- dubbo：默认NIO单一长连接、二进制序列化 小数据量 100k、数据量中等 不适合文件传输
- memcached
- redis
- WebService
- http

## Docker

> 容器化必备神器

## Web基础

### TCP

- 三次握手：为了防止已失效的连接请求报文段突然又传送到了服务端，产生错误。

![img](https://i.loli.net/2021/01/28/wegiNIWlzQaVTxU.jpg)

- 四次挥手

![img](https://i.loli.net/2021/01/28/4qFtWe1boLVhmcD.jpg)

### 安全

- HTTPS（非对称握手+对称加密，SSL/TLS，RSA，CA证书和证书链）

### 网络模型

- BIO：阻塞等待连接/数据，读写都阻塞、耗带宽和资源，每个请求过来开一个线程阻塞
- NIO：非阻塞IO，可能等的时间太久响应延迟大会重试-多路复用，通道buffer多路复用、监听事件
- NIO多路复用：便捷的通知机制，程序注册一组socket文件描述符给OS，表示“我要监视这些fd是否有IO事件发生，有了就告诉程序处理”
  - select：遍历判断事件是否可达然后继续
  - poll：做了优化，水平触发问题
  - epoll：有状态，会创建文件描述符指向的表，监听增删改查，无并发限制、非轮询、内存拷贝，支持水平和边缘触发
- 粘包/拆包（换行符、消息头声明长度、固定报文长度补齐空位）
- AIO/NIO2（异步IO）
- 序列化

### 认证授权

- JWT

  - header

    ```bash
    {
      'typ': 'JWT', // 声明类型
      'alg': 'HS256' // 加密算法
    }
    ```

  - payload

  - signature

- SSO

  <img src="https://i.loli.net/2021/01/28/rx63qXES48e2aCb.png" alt="img" style="zoom:33%;" />

## 分布式

### 分布式理论

- CAP

   CAP：C ：Consistency（一致性）A：（Availability）可用性P：（Partition Tolerance）分区容错性

- BASE

  - （Basically Available）基本可用
  - （Soft State）软状态
  - （Eventually Consistent）最终一致性

- Paxos

- [Raft](http://thesecretlivesofdata.com/raft/)

  - Follower、Candidate 和 Leader

### 分布式ID

<img src="https://i.loli.net/2021/01/28/M3btw9XZ4rzEnsO.png" alt="img" style="zoom: 50%;" />

- 雪花算法

  <img src="https://i.loli.net/2021/01/28/z8AfHkKX6CYUnyg.jpg" alt="img" style="zoom:50%;" />



### 分布式事务 

- 2PC、3PC

- TCC-Try、Confirm、Cancel

- 本地消息表（异步确保）

  <img src="https://i.loli.net/2021/01/28/cmFKtIWp8GDE6Lh.png" alt="img" style="zoom:67%;" />

- MQ

  <img src="https://i.loli.net/2021/01/28/ksmt7CQabNhnpzU.png" alt="img" style="zoom:67%;" />

- 最大努力通知

### 分布式锁

- Zookeeper：死锁、羊群效应、临时节点顺序、性能没redis高
- Redis：jedis.set(String key, String value, String nxxx, String expx, int time)、性能比较高
- 数据库：死锁（设置一个失效时间用定时任务去跑、数据库集群主备同步、搞个死循环排队、可重入设计一个字段累加）、排他锁（用数据库自身的锁就可以 行锁 索引、select xx for update、记得提交、宕机数据库也会自动释放锁）、缺点（比其他的更消耗资源、复杂）
- 特点：互斥、安全性、死锁、容错

## 微服务

<img src="https://i.loli.net/2021/01/28/AGVYQMDLk9K6oie.png" alt="微服务" style="zoom:80%;" />

- Feign
- Skywalking
- Hystrix
- Sentinel
- Dubbo
- Seata
- nacos
- Spring Cloud Bus
- API gateway
- Spring Cloud Stream（MQ）

## 高并发

- 消息队列

  - rabbitmq

    ![img](https://i.loli.net/2021/01/28/QdLmqo2bW8kxV4A.jpg)

- 读写分离

- 分库分表

- 负载均衡

## 高可用

- 限流
- 降级
- 熔断
- 排队
- 集群
- 超时与重试

## 算法

- dfs、bfs、贪心、分治（二分查找）、dp、快排、堆排、跳楼梯

## 数据结构

- 二叉树、链表反转、成环、环节点

## 扩展知识

- 内存屏障
- 指令乱序
- 分支预测
- NUMA
- CPU求和性

## 大数据

### 基础知识

- 谷歌三驾马车（分布式处理技术MapReduce、列式存储BigTable、分布式文件系统GFS）
- 数据采集与预处理A、数据存储B、数据清洗C、数据查询分析D、数据可视化E

<img src="https://i.loli.net/2021/01/28/fbhjaYtr72QlVDZ.png" alt="å¾ç" style="zoom:50%;" />

A: Sqoop、Cannel、Flume

B: HDFS、Kafka

CD: MapReduce、Flink、Spark、Hadoop ---> HBase、Redis、RDBMS

<img src="https://i.loli.net/2021/01/28/WtvT5BDeaJRVLZ3.png" alt="å¾ç" style="zoom:50%;" />

### ODPS离线分析

### Hive

### Spark

### Hadoop

### Hbase

### HDFS

### 大数据体系

## 大型网站架构

- 阿里云实操训练：[https://start.aliyun.com/handson-lab/#%21category=arthas](https://start.aliyun.com/handson-lab/#!category=arthas)

- 秒杀场景设计/高并发下单/订单生成

  https://www.jianshu.com/p/2707559bdc04

  https://bbs.huaweicloud.com/blogs/221143

  <img src="https://i.loli.net/2021/01/28/mCHfDOLzq8N3lTA.jpg" alt="preview" style="zoom:50%;" />

  <img src="https://i.loli.net/2021/01/28/OogLRBG5nlthPTN.png" alt="img" style="zoom:50%;" />

- 设计一个数据库系统

- 实现一个文件管理器

- 设计一个数据库连接池

  - 连接池连接设计遵守 LRU 策略，性能的关键点是连接是否 LRU 方式重用。
  - 通过 Hash 去连接，实现串行化
  - 可以自动扩容连接数
  - 连接数过多，可以自动关闭连接，释放资源

- 设计一个im系统包括群聊和单聊

  <img src="https://i.loli.net/2021/01/28/ipyGCBbsZWMLUJA.jpg" alt="preview" style="zoom:67%;" />

- 设计一个三高电商系统

  <img src="https://i.loli.net/2021/01/28/uThotDO4SLcGIgq.png" alt="img" style="zoom:50%;" />

- 设计一个抢红包系统

  <img src="https://i.loli.net/2021/01/28/GLYTyeM36K8iwAg.jpg" alt="img" style="zoom:50%;" />

# 参考文献

- [JVM监控和调优](https://www.cnblogs.com/wxisme/p/9878494.html#_label0)
- [MySQL InnoDB 索引原理](https://www.cnblogs.com/163yun/p/8892324.html)
- [Redis原理(一) redis的内存模型](https://blog.csdn.net/canot/article/details/85235338?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-3.not_use_machine_learn_pai&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-3.not_use_machine_learn_pai)
- [彻底搞懂Redis的线程模型](https://blog.csdn.net/y277an/article/details/98342442?utm_medium=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecas)
- [漫谈Java IO之 Netty与NIO服务器](https://www.cnblogs.com/xing901022/p/8678869.html)
- [spring的15个经典面试题](https://www.cnblogs.com/yanggb/p/11004887.html)
- [分布式事务的四种解决方案](https://www.cnblogs.com/mayundalao/p/11798502.html)
- [面试必问：分布式事务六种解决方案](https://zhuanlan.zhihu.com/p/183753774)
- [Java NIO浅析](https://tech.meituan.com/2016/11/04/nio.html)
- [终于有人把“TCC分布式事务”实现原理讲明白了！](https://www.cnblogs.com/jajian/p/10014145.html)