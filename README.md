# 异世界百科 磁贴
用法：
## 磁贴容器
用来把多个磁贴拼成一块的

```html
<tilegroup>
    <tile></tile>
</tilegroup>
```

参数

| 参数名 | 参数值 | 介绍 |
| ------ | ----- | ---- |
| size | xs-12 sm-12 md-12 lg-12 xl-12 xxl-12 | 控制不同屏幕上的显示宽度，和bootstrap的col差不多，最宽为12 |
| title | * | 这一组磁贴的标题 |

## 磁贴
显示一个矩形的磁贴

```html
<tile>title</tile>
```

参数

| 参数名 | 参数值 | 介绍 |
| ------ | ----- | ---- |
| size | app,small,medium,wide,large | 控制磁贴大小 |
| icon | fa fa-fw fa-map | 磁贴的图标，可以是文件路径或者css类 |
| 内容 | title | 磁贴的标题 |
| badge | 1 | 磁贴左上角显示的数字（未读消息） |
| color | #ccc | 磁贴的颜色 |
| href | [[首页]] | 指向链接，支持使用 ```[[]]``` 表示文章链接 |
| grid | 1 2 | grid位置，格式为 ```<colum> <row>``` |