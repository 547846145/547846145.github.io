事务的隔离级别:
``` 
con1: 读未提交(read uncommited)
con2: 读提交(read commited)
con3: 可重复读(repeatable read)
con4: 串行化(serializable) 对同一行记录,读写都加锁

```


```
con1: 事务如果是可重复读,事务T启动的时候会创建一个视图read-view，
之后事务T执行期间，即使有其他事务修改了数据，事务T看到的任然和启动时一样。
con2: 

```

view
```
con1: view,它是一个用查询定义的虚拟表，用来生成结果。
con2: consistent read view 用于支持RC(read committed)和RR(repeatable read)实现
```
