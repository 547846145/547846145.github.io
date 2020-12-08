> 迭代法
```
java
public ListNode reverseList(ListNode: head) {
    ListNode newHead = null;
    while(head != null) {
        ListNode temp = head.next;
        head.next = newHead;
        newHead = head;
        head = temp;
    }
    return newHead;
}
```
``` 
kotlin
fun reverseList(head: ListNode): ListNode{
    val newHead = null
    while(head != null) {
        val temp = head.next
        head.next = newHead
        newHead = head
        head = head.next
    }
    return newHead
}

```

