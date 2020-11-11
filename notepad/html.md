 异步导出

import vmsDataExport from '@/vms/components/vms-data-export'
    <vms-data-export
      @success="exportUrlFn"
      v-bind="dataReport"
      :visible.sync="dataReport.visible"
      :url="dataReport.url"
      :code="dataReport.code"
      :params="dataReport.params"
    ></vms-data-export>










维修申请 
  1 列表页优化  
    1) 统计信息优化，列表添加字段 - 1天  
    2) 操作栏-添加更多多按钮，以及管好车、配件费、配套配、维保费的迁移（包括通用查询、接口权限迁移）-  4天

  2 维修申请详情
    1) 排版优化，字段隐藏以及字段弹框交互 - 2天
    2) 详情页维修状态-步骤 - 2天
    3) 详情页工作明细、领料签收明细 列表优化 - 1天
  
  3 H5跨声提醒页面 车辆问题反馈 - 3天 （轻应用部署方案不确定，有变更时间暂时评3天）

  4 数据联调加自测  3天 

鲁班小程序，和鲁班系统 （暂时没有看到原型和文档，没评时间）

开发总计： 16个工作日/人



cat /Users/key/.ssh/id_rsa.pub