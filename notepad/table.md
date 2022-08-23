## 组件说明文档

### pageTable 参数说明

| 参数                                   | 说明                                               | 类型                        | 可选值 | 默认值                                |
| -------------------------------------- | -------------------------------------------------- | --------------------------- | ------ | ------------------------------------- |
| [tableForm](###tableForm 参数说明)     | 表头以及表格操作方法                               | Array                       | -      | []                                    |
| [tableForm](###tableForm 参数说明)     | 表格个数据                                         | Object                      | -      | {}                                    |
| [pageData](###pageData 参数说明)       | 分页时间                                           | Object                      | -      | {  page: 1,  total: 0, pageSizes: 20} |
| [optBtns](###optBtns 表格操作参数说明) | 表格操作列设置                                     | Array                       | -      | []                                    |
| isPage                                 | 是否有分页                                         | Boolean                     |        | true                                  |
| showHeader                             | 是否显示表头                                       | Boolean                     |        | true                                  |
| indexNum                               | 时候显示行号                                       | Boolean                     |        | true                                  |
| summaryMethod                          | 自定义的合计计算方法 （参考elementUI table的用法） | Function({ columns, data }) |        | -                                     |
| showSummary                            | 是否在表尾显示合计行                               | Boolean                     |        | false                                 |
| empty                                  | 无数据展示，支出html字符串                         | String                      | -      | 暂无数据                              |
| isSelection                            | 是否显示多选框                                     | Boolean                     |        | false                                 |
| `isCount`                            | 是否有统计 （统计列数据一定要加 `countTxt`字段） | Boolean                     |        | false                                 |

### tableForm 参数说明

```javascript
const tableForm: [
  { label: '姓名', prop: 'name', width: '60px', align: 'center' },
  {
    label: '性别', //  表头名称
    prop: 'sex', // 字段key
    width: '50px',// 表格宽度
    sortable:true // 表头排序 暂时不支持前后端交互
    align: 'center' // 表格的对齐方式（left/center/right） （默认 left）
    color: (row, key) => { // 表格颜色 支持函数以及字符串
      const objStr = {
        1: '#13ce66',
        2: '#ff4949'
      }
      return objStr[row[key]]
    },
    style:{ // 给表格内容添加样式
      padding:'10px',
    },
    filter: (row, key) => { // 数据格式化方法
      const strObj = { 1: '男', 2: '女' }
      return strObj[row[key]]
    },
    fun: (row, key) => { // 表格点击事件
      alert(1)
    }
    children: [ // 子表头，{}内参数同父级一样
      {
        label: '性别', //  表头名称
        prop: 'sex', // 字段key
        ...
      }
    ]
  },
  { label: '年龄', prop: 'age', width: '50px', color: 'red', sortable: true }
]
```

### tableForm 参数说明

```javascript
  {
    name: 'owen',
    sex: '1',
    age: '30',
  }
```

### pageData 参数说明

```javascript
{
  page: 1, // 当前页
  total: 0,// 总条数
  pageSizes: 20// 每页展示多少条数据
}
```

### optBtns 表格操作参数说明

```javascript

{
  lable:'操作',
  width:'120',
  fixed:false, // 操作列是否固定在右侧 （默认值false）
  btnData:[{
    label: '查看', //按钮名称 支持 函数
    isShow: (row,opt) => { // 是否显示（支持函数和布尔值 默认为true）
      return true
    },
    isDisabled: (row, opt) => { // 是否禁用/支持函数和布尔值 默认为false
      return false
    },
    fun: (row,key) => { //点击事件 (row:行数据 ,key:行号)
      alert(JSON.stringify(row))
    }
  },
  {
    label: (row, index)=>{ //按钮名称 支持 函数 row:行数据，index：行号
      retun '编辑'
    },
    isShow: (row,opt) => { // 是否显示（支持函数和布尔值 默认为 true）
      return true
    },
    isDisabled: (row, opt) => { // 是否禁用/支持函数和布尔值 默认为 false
      return false
    },
    fun: (row,key) => { //点击事件 (row:行数据 ,key:行号)
      alert(JSON.stringify(row))
    }
  },{
    label: '删除', //按钮名称 支持 函数
    isOk:ture, // tips Popover 方式提醒 (这个参数优先 alert: ture)
    alert:false, //  Message Box 方式提醒 (当isOk:ture时，不起作用)
    tipsTxt:(row,index)=>{  // 提醒文字,（支持函数和字符串）
	return '此操作将永久删除该条数据,是否继续?'
    },
    isShow: (row,opt) => { // 是否显示（支持函数和布尔值 默认为true）
      return true
    },
    isDisabled: (row, opt) => { // 是否禁用/支持函数和布尔值 默认为false
      return false
    },
    fun: (row,key) => { //点击事件 (row:行数据 ,key:行号)
      alert(JSON.stringify(row))
    }
  }
  ]
}
```

## 方法说明

| 事件名                | 说明                                                                  | 参数           |
| --------------------- | --------------------------------------------------------------------- | -------------- |
| chanePage             | 页面page修改， 数据修改 参数（page:当前页，pageSize：一页展示多少条） | page，pageSize |
| handleSelectionChange | 当选择项发生变化时会触发该事件                                        | selection      |
|                       |                                                                       |                |
