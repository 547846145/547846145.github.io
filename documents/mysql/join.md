1. NLJ Index Nested-Loop Join
```
t1 行数为N
t2 行数为M
```
```
step1: 对驱动表做全表扫描
step2: 对每一行R，根据某一字段去被驱动表查找，走树搜索，匹配上然后取出
整个过程中时间复杂度 t1.rows + t1.rows✖2log2M  t1代表驱动表，驱动表对性能影响大
sum1: 使用join语句，性能比强行拆成多个单表执行SQL语句的性能要好;
sum2: 如果使用join语句的话，需要让小表做驱动表
以上结论前提是能够使用被驱动表的索引,如果不能将是N✖M
```

2. Simple Nested-Loop Join 不能走被驱动表索引

```
step1: 对驱动表做全表扫描
step2: 对被驱动表做全表扫描
```   

3. BNL Block Nested-Loop Join
```
step1: 把表t1的数据读入线程内存join_buffer中，根据查询内容，选择读入，*代表表中所有数据。 
step2: 扫描表t2，把表t2的数据每一行取出来，跟join_buffer中的数据做对比，满足join条件的，作为结果集的一部分返回。
sum1: 两个表都做一个全表扫描，扫描行数是M+N 
sum2: 内存中的判断次数是M*N
join_buffer的大小是由join_buffer_size设定的，默认值是256K。
当joint_buffer无法一次放入整张表的时候，有如下流程变化
step1: 扫描表t1，顺序读入join_buffer，还有部分数据未读入
step2: 扫描表t2，每行取出来，跟join_buffer中的数据做对比，满足作为结果集返回
step3: 清空join_buffer
step4: 继续扫描表t1，读入join_buffer，取出t2中数据做对比，循环
sum1:  扫描行数计算逻辑(每次读入x条）,以t1为驱动表 N+ (N/x)*M,t2作为驱动表 M+N*(M/x)
sum2:  判断次数依然是N*M
sum3:  以小表作为驱动表性能更好
```

4 Summary
```
问题1: 能不能使用join语句？
sum1: 如果可以使用NLJ(Index Nested-Loop Join)算法，能使用被驱动表的索引，性能不错。
sum2: 如果使用BNL(Block Nested-Loop Join)算法，扫描行数会过多，尤其是达标，占用资源会过多。
参考标准 explain中 Extra字段里面有没有出现BNL字样。
问题2: 如果要使用join,应该选择哪个表做驱动表(大小表）
sum1: 如果是Index Nested-Loop Join,应该选择小表做驱动表
sum2: 如果是Block Nested-Loop Join算法
    sum2.1: 在join_buffer_size足够大的时候是一样的
    sum2.2: 在join_buffer_size不够大的时候(这种情况更常见),应该选择小表做驱动表。
    sum2.3: 在添加join_buffer的时候，要考虑查询内容，会把查询内容(字段)放进buffer里面。
finalSum: 在决定哪个表做驱动表的时候，应该是两个表按照各自的条件过滤，过滤完成之后，计算参与 join 的各个字段的总数据量，数据量小的那个表，就是“小表”，应该作为驱动表。
```