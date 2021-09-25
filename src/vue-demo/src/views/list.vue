<template>
  <div class="list">
    <h1>自定义列表</h1>
    <Search
      v-if="true"
      :schema="searchSchema"
      @search="handleSearch"
    />
     <FcList
        v-model="fcList"
        :columns="columns"
        :query="fetchData"
        url="/mock/query/list"
      />
  </div>
</template>

<script>
import axios from 'axios'
import Search from '@/components/Search'
import List from '@/components/List'

const SEX_OPTIONS = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]

export default {
  name: 'List',

  components: {
    Search,
    FcList: List
  },

  data() {
    return {
      fcList: {}
    }
  },

  computed: {
    searchSchema() {
      return {
        saveTime: {
          required: true,
          type: 'DatePicker',
          title: '存入日期',
          props: {
            type: 'daterange',
            valueFormat: 'yyyy-MM-dd',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        createTime: {
          type: 'DatePicker',
          title: '下单日期',
          props: {
            type: 'daterange',
            valueFormat: 'yyyy-MM-dd',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        orderCompleteStatus: {
          type: 'Select',
          title: '订单是否完成',
          props: {
            placeholder: '请选择',
            options: [
              { label: '选项1', value: 1 },
              { label: '选项2', value: 2 },
              { label: '选项3', value: 3 },
            ]
          }
        },
        edCode: {
          type: 'Input',
          title: '柜机编码',
          props: {
            placeholder: '请输入'
          }
        }
      }
    },

    columns() {
      return [
        {
          prop: 'id',
          label: '订单号',
          align: 'center',
        },
        {
          prop: 'mobile',
          label: '手机号',
          align: 'center',
          formatter: (row, column, value) => {
            if (this.isRoot) {
              return value
            }
            return `${value.slice(0, 3)}****${value.slice(-4)}`
          }
        },
        {
          prop: 'name',
          label: '姓名',
          align: 'center'
        },
        {
          prop: 'sex',
          label: '性别',
          align: 'center',
          formatter: (row, column, value) => {
            const sexOption = SEX_OPTIONS.find(option => option.value === value)
            if (sexOption) {
              return sexOption.label
            }
          }
        },
      ]
    }
  },

  mounted() {
    this.fcList.onSearch()
  },

  methods: {
    handleSearch(params) {
      this.fcList.onSearch(params)
    },

    async fetchData(url, params) {
      const { data: { success, data } } = await axios.get(url, { params })
      if (success) {
        return data
      }
    }
  }
}
</script>