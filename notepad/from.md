// formData必须是响应式的数据
const formData = ref({
  platform_id: "",
})

// formConfig如不依赖其他变量可以不是响应式，如果依赖了就必须是响应式的
const formConfig = ref({
  // 操作项
  btns: [
    {
      name: "查询",
      disabled: !formData.value.platform_id,
      handleClick: (val) => {
        console.log(val)
        getTableList()
      },
    },
    {
      name: "新增期数",
      icon: markRaw(Plus),
      handleClick: (val) => {
        console.log(val)
        formRef.value.show()
      },
    },
  ],
  // search 项
  list: [
    // 如果两个条件之间有联动，直接在change事件里do something（清空其他项，直接操作源数据即可，formData.value.xx = ''）
    {
      label: "所属平台",
      type: "select",
      prop: "platform_id",
      list: [
        {
          label: "11",
          value: 1,
        },
        {
          label: "22",
          value: 2,
        },
      ],
      change(val) {
        console.log(val)
      },
    },
    {
      label: "公告标题",
      type: "input",
      prop: "title",
      change(val) {
        console.log(val)
      },
    },
  ],
})
