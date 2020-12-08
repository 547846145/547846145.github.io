> 一致性视图
```
启动方式1: start transaction with consistent snapshot
启动方式2: 实在执行第一个快照读语句时创建的
uses: 用于支持RC和RR隔离级别的实现,没有物理结构，作用是事务执行期间用来定义我能看到什么数据。
```

> 快照
```
con1: InnoDB里面每个事务有一个唯一的事务ID,叫做transaction id.
con2: 每次事务更新数据的时候，都会生成一个心的数据版本，并把transaction id赋值给这个数据版本的事务ID,记为row_trx_id.
      同时，就的数据版本要保留,并且在新的数据版本中,能够有信息可以直接拿到.
      数据表中的一行记录,有多个版本(row),每次版本都有自己的row_trx_id.
con3: 

```
``` 
InnoDB为诶个事务构造了一个数组,用来保存这个事务启动瞬间,当前正在活跃的所有事务ID(启动了但是未提交的事务)

```

