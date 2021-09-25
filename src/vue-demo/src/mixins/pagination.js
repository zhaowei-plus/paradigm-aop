export default {
  props: {
    url: {
      require: true,
      type: String
    },
    query: {
      type: Function
    }
  },

  data() {
    return {
      data: [],
      params: {},
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    }
  },

  created() {
    this.onEmitChange()
  },

  methods: {
    onEmitChange() {
      this.$emit('change', {
        url: this.url,
        data: this.data,
        params: this.params,
        loading: this.loading,
        pagination: this.pagination,
        onSearch: this.onSearch,
        onRefresh: this.onRefresh
      })
    },

    onSearch(params = {}) {
      return this.onRefresh(params, { ...this.pagination, currentPage: 1 })
    },

    async onRefresh(params = this.params, pagination = this.pagination) {
      const {
        currentPage,
        pageSize
      } = pagination
      this.loading = true

      if (this.query) {
        this.loading = true
        this.params = params
        this.pagination.pageSize = pageSize
        this.pagination.currentPage = currentPage

        // 提交数据
        this.onEmitChange()

        return this.query(this.url, {
          ...params,
          pageIndex: currentPage,
          pageSize
        }).then((res) => {
          const { list = [], total = 0, ...rest } = res
          this.data = list
          this.pagination.total = total
          return {
            list,
            total,
            ...rest
          }
        }).finally(() => {
          this.loading = false
          // 查询结束，再次提交数据
          this.onEmitChange()
        })
      }
    },

    /** 以下是针对分页器组件 Pagination 中用到的方法 **/
    onCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage
      return this.onRefresh()
    },

    onSizeChange(pageSize) {
      this.pagination.pageSize = pageSize
      return this.onRefresh()
    },

    onPrevClick(currentPage) {
      this.pagination.currentPage = currentPage
      return this.onRefresh()
    },

    onNextClick(currentPage) {
      this.pagination.currentPage = currentPage
      return this.onRefresh()
    }
  }
}
