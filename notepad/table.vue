<template>
  <div ref="refPageTable" v-loading="loading" class="page-table">
    <div class="table-header">
      <slot name="header" />
    </div>
    <div v-if="tableOpts?.left?.length || tableOpts?.right?.length" class="table-opts">
      <div v-for="(item, index) in tableOpts?.left" :key="index">
        <el-button
          :size="item.size || 'small'"
          :type="item.type || 'primary'"
          :icon="item.icon || ''"
          :disabled="item.disabled"
          @click="item.handleClick"
        >{{ item.name }}</el-button>
      </div>
      <div v-for="(item, index) in tableOpts?.right" :key="index">
        <el-button
          :size="item.size || 'small'"
          :type="item.type || 'primary'"
          :icon="item.icon || ''"
          :disabled="item.disabled"
          @click="item.handleClick"
        >{{ item.name }}</el-button>
      </div>
    </div>
    <!-- table 主体 -->
    <el-table
      ref="elPageTable"
      :key="'elPageTable_' + tableForm.length"
      :border="true"
      :show-header="showHeader"
      :data="tableData"
      :stripe="true"
      size="default"
      style="width: 100%"
      :summary-method="summaryMethod"
      :show-summary="showSummary"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="isSelection" fixed type="selection" width="40" :align="'center'" :selectable="selectable" />
      <el-table-column v-if="indexNum" fixed label="序号" type="index" width="60" :align="'center'">
        <template #default="{ scope }">
          <span v-if="isCount && scope.row.countTxt">
            {{ scope.row.countTxt }}
          </span>
          <span v-else>
            {{ (pageData.page - 1) * pageData.pageSizes + scope.$index + 1 }}
          </span>
        </template>
      </el-table-column>
      <!--  显示列 -->
      <el-table-column
        v-for="(item, index) in tableForm"
        :key="'pt_' + index"
        :label="item.label"
        :prop="item.prop"
        :sortable="item.sortable"
        :align="item.align || colAlign"
        :min-width="item.width"
        :fixed="item.fixed"
      >
        <!-- 多层表头 -->
        <template v-if="item.children && item.children.length > 0">
          <el-table-column
            v-for="(v, i) in item.children"
            :key="'ptc_' + i"
            :label="v.label"
            :prop="v.prop"
          >
            <template #default="scope">
              <div v-if="typeof v.fun === 'function'">
                <el-button
                  type="primary"
                  link
                  :style="{ ...styleColor(scope.row, v), ...v.style }"
                  @click="v.fun && v.fun(scope.row, v.prop)"
                  v-html="viewFun(scope.row, v)"
                />
              </div>
              <div v-else>
                <span
                  :style="{ ...styleColor(scope.row, v), ...v.style }"
                  @click="v.fun && v.fun(scope.row, v.prop)"
                  v-html="viewFun(scope.row, v)"
                />
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 单层表头 -->
        <template v-if="!item.children || item.children.length === 0" #default="scope">
          <span v-if="isCount && scope.row.countTxt" :style="{ ...styleColor(scope.row, item), ...item.style }">
            {{ scope.row[item.prop] }}
          </span>
          <span
            v-else
            :style="{ ...styleColor(scope.row, item), ...item.style }"
            @click="item.fun && item.fun(scope.row, item.prop)"
            v-html="viewFun(scope.row, item)"
          />
        </template>
      </el-table-column>
      <!--  /显示列 -->

      <!--  操作列 -->
      <el-table-column
        v-if="optBtns && optBtns.btnData && optBtns.btnData.length"
        :label="optBtns.label"
        :min-width="optBtns.width"
        :align="'center'"
        :fixed="optBtns.fixed ? 'right' : false"
      >
        <template #default="scope">
          <div v-if="isCount && scope.row.countTxt" />
          <div v-else>
            <template v-for="bnt in optBtns.btnData">
              <span v-if="bnt.isOk" v-show="optShow(scope.row, bnt)" :key="'popoverBnt_' + viewBtnLabel(scope.row, bnt)">
                <el-popconfirm :title="tipsBtnLabel(scope.row, bnt)" @confirm="btnClick(bnt, scope)">
                  <template #reference>
                    <el-button link type="primary" :disabled="optDisabled(scope.row, bnt)" style="margin-right: 5px; margin-left: 5px">
                      {{ viewBtnLabel(scope.row, bnt) }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </span>
              <span v-else v-show="optShow(scope.row, bnt)" :key="'bnts_' + viewBtnLabel(scope.row, bnt)">
                <el-button style="margin-right: 5px; margin-left: 5px" link type="primary" :disabled="optDisabled(scope.row, bnt)" @click="bnt.fun && btnClick(bnt, scope)">
                  {{ viewBtnLabel(scope.row, bnt) }}
                </el-button>
              </span>
            </template>
          </div>
        </template>
      </el-table-column>
      <!--  /操作列 -->

      <!-- 无数据处理 -->
      <template #empty>
        <div class="tableEmpty" v-html="empty" />
        <!--  /无数据处理 -->
      </template>
    </el-table>

    <!-- /table 主体 -->
    <div class="table-footer">
      <slot name="footer" />
    </div>
    <!-- 分页 -->
    <div v-if="isPage" class="pagination-page">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageData.page"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageData.pageSizes"
        :total="pageData.total || 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- /分页 -->
  </div>
</template>

<script setup>
//
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick, onUpdated, ref } from 'vue'
import { throttle } from '@/utils/throttle-debounce'
const props = defineProps({
  isCount: {
    type: Boolean,
    default: false,
  },
  isSelection: {
    type: Boolean,
    default: false,
  },
  isPage: {
    type: Boolean,
    default: true,
  },
  empty: {
    type: String,
    default: '暂无数据',
  },
  showHeader: {
    // 是否显示表头
    type: Boolean,
    default: true,
  },
  indexNum: {
    // 是否显示序号
    type: Boolean,
    default: false,
  },
  optBtns: {
    // 操作按钮设置
    type: Object,
    default: () => {
      return {
        btnData: [],
      }
    },
  },
  tableOpts: {
    type: Object,
    default: () => {
      return {
        left: [],
        right: [],
      }
    },
  },
  height: {
    // 为弹框时 必填
    type: [String, Number],
    default: 0,
  },
  summaryMethod: {
    type: Function,
    default: () => {
      return false
    },
  },
  showSummary: {
    type: Boolean,
    default: false,
  },
  tableData: {
    //  data 数据
    type: [Object, Array],
    default: () => {
      return []
    },
  },
  tableForm: {
    // 表头以及表格操作方法
    type: [Object, Array],
    default: () => {
      return []
    },
  },
  pageData: {
    type: Object,
    default: () => {
      return {
        page: 1,
        total: 0,
        pageSizes: 10,
      }
    },
  },
})

const emit = defineEmits(['selectionChange', 'chanePage'])

const refPageTable = ref(null)
const elPageTable = ref(null)
const loading = ref(false)
const colAlign = ref('0')
const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  // 比表格多选框change事件
  multipleSelection.value = val
  emit('selectionChange', val)
}

const styleColor = (row, opt) => {
  // 处理颜色
  let str = ''
  if (typeof opt.color === 'function') {
    str = opt.color(row, opt.prop)
  }
  if (typeof opt.color === 'string') {
    str = opt.color
  }
  return { color: str }
}

const viewFun = (row, opt) => {
  // 处理显示 filter
  let str = ''
  if (opt.filter) {
    str = opt.filter(row, opt.prop)
  } else {
    str = row[opt.prop]
  }
  return str
}
const viewBtnLabel = (row, opt) => {
  let str = ''
  if (typeof opt.label === 'string') {
    str = opt.label
  }
  if (typeof opt.label === 'function') {
    str = opt.label(row)
  }
  return str
}
const optShow = (row, opt) => {
  let str = true
  if (typeof opt.isShow === 'boolean') {
    str = opt.isShow
  }
  if (typeof opt.isShow === 'function') {
    str = opt.isShow(row, opt)
  }
  return str
}

const optDisabled = (row, opt) => {
  let str = false
  if (typeof opt.isDisabled === 'boolean') {
    str = opt.isDisabled
  }
  if (typeof opt.isDisabled === 'function') {
    str = opt.isDisabled(row, opt)
  }
  return str
}

const tipsBtnLabel = (
  row,
  opt,
  txt = '此操作将永久删除该条数据,是否继续?'
) => {
  let str = txt
  if (typeof opt.tipsTxt === 'string') {
    str = opt.tipsTxt
  }
  if (typeof opt.tipsTxt === 'function') {
    str = opt.tipsTxt(row)
  }
  return str
}

const btnClick = (opt, scope) => {
  if (opt.isOk) {
    opt.fun && opt.fun(scope.row, scope.$index)
    return
  }
  if (opt.alert) {
    ElMessageBox.confirm(tipsBtnLabel(), '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        opt.fun && opt.fun(scope.row, scope.$index)
      })
      .catch(() => {
        ElMessage.info({
          message: '已取消删除',
        })
      })
    return
  }
  opt.fun && opt.fun(scope.row, scope.$index)
}

const handleSizeChange = throttle((val) => {
  emit('chanePage', 1, val)
}, 500)
const handleCurrentChange = throttle((val) => {
  console.log('handleCurrentChange')
  emit('chanePage', val, props.pageData.pageSizes)
}, 500)
const selectable = (row, index) => {
  return !row.countTxt
}

onUpdated(() => {
  nextTick(() => {
    elPageTable.value.doLayout()
  })
})

</script>

<style lang="scss" scoped>
  .page-table {
    width: 100%;
    overflow: hidden;
    .table-opts{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .el-table {
      color: #000;
    }
    :deep(.el-table) {
      th {
        color: #000;
        // padding: 8px 0;
        height: 40px;
        background: #fafafa;
      }
      td {
        padding: 4px 0;
      }
      .el-button--text {
        padding: 8px 0px;
      }
    }

    .pagination-page {
      width: 100%;
      text-align: right;
      overflow: hidden;
      display: flex;
      justify-content: flex-end;

      :deep(.el-pagination) {
        padding: 8px 5px 0 5px;
        .el-icon {
          display: inline-block;
        }
        .el-pagination__total,
        .el-pagination__jump {
          color: #000;
        }
      }
    }
  }
</style>
