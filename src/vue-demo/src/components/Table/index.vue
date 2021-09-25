<script>
import { Table, TableColumn, Pagination } from 'element-ui'
import pagination from '@/mixins/pagination'
export default {
  name: 'FcTable',

  components: {
    Table,
    TableColumn,
    Pagination
  },

  mixins: [pagination],

  model: {
    prop: 'table',
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

  render($h) {
    return (
      <div class='fc-table'>
        <div class='fc-table__list'>
          <Table
            stripe={true}
            data={this.data}
            style='width: 100%'
          >
            {
              this.columns.map((column, key) => {
                const { visible = true, ...props } = column
                if (visible) {
                  return $h(TableColumn,
                    {
                      props,
                      key
                    }
                  )
                }
              })
            }
          </Table>
        </div>
        {
          this.pagination.total > 0 && (
            <div class='fc-table__pagination'>
              {
                $h(Pagination, {
                  props: {
                    background: true,
                    layout: 'total,prev,pager,next',
                    ...this.pagination
                  },
                  on: {
                    'prev-click': this.onPrevClick,
                    'next-click': this.onNextClick,
                    'size-change': this.onSizeChange,
                    'current-change': this.onCurrentChange
                  }
                })
              }
            </div>
          )
        }
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
.fc-table {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  &__list {
    width: 100%;
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
