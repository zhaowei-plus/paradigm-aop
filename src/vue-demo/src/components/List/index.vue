<template>
  <div class="fc-list">
    <div class="fc-list__content">
      <div class="item" v-for="item in data" :key="item.id">
        <div class="item__name">
          {{item.name}}
        </div>
        <div class="item__age">
          {{item.age}} 岁
        </div>
      </div>
    </div>
    <div class="fc-list__pagination">
      <Pagination 
        background
        layout="total,prev,pager,next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.pageIndex"
        @prev-click="onPrevClick"
        @next-click="onNextClick"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { Pagination } from 'element-ui'
import pagination from '@/mixins/pagination'
export default {
  name: 'FcList',

  components: {
    Pagination
  },

  mixins: [pagination],

  model: {
    prop: 'list',
    event: 'change'
  },

  props: {
    columns: {
      type: Array,
      default: () => ([])
    },

    table: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      pagination: {
        pageSize: 20, // 自定义数量
      }
    }
  },
}
</script>
<style lang="less" scoped>
.fc-list {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  &__content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 24px;

    .item {
      width: 180px;
      height: 120px;
      border: 1px solid #1ec381;
      box-shadow: 0px 8px 16px 0px rgba(238, 239, 240, 0.39);
      margin: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__pagination {
    margin-top: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
