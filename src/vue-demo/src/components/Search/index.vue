<script>
import { Form, FormItem, Button, Input, Select, Option, Cascader, DatePicker } from 'element-ui'

/**
 * 清理对象参数值，过滤不合法参数
 * @params {object} params - 待清理的对象
 * @params {array} filters - 清理的值信息，默认当值为[null, undefined, NaN, '']中的任意值时，该字段被清理掉
 * @returns {object} 清理之后的独显
 */
export const clearObject = (
  params,
  filters = [null, undefined, NaN, '']
) => {
  if (filters.includes(params)) {
    return params
  }

  // 继续优化，针对数组的处理
  const backupParams = {}
  Object.keys(params).forEach(key => {
    if (!filters.includes(params[key])) {
      if (Object.prototype.toString.call(params[key]) === '[object Object]') {
        backupParams[key] = clearObject(params[key])
      } else if (Object.prototype.toString.call(params[key]) === '[object Array]') {
        backupParams[key] = params[key].map(item => {
          if (Object.prototype.toString.call(item) === '[object Object]') {
            return clearObject(item)
          } else if (!filters.includes(item)) {
            return item
          }
        }).filter(Boolean)
        // 如果数组长度为空，则删除此项
        if (backupParams[key].length === 0) {
          delete backupParams[key]
        }
      } else {
        backupParams[key] = params[key]
      }
    }
  })
  return backupParams
}

// 检测中括号
// eslint-disabled
const BRACKETS_REG = /[[]]/g

export default {
  name: 'FcSearch',

  components: {
    Form,
    FormItem,
    Button,
    Input,
    Select,
    Option,
    DatePicker,
    Cascader
  },

  model: {
    prop: 'search',
    event: 'change'
  },

  props: {
    schema: {
      required: true,
      type: Object
    },

    initialValues: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      fields: [],
      values: {}
    }
  },

  watch: {
    schema: {
      handler() {
        this.onInitFormFields()
        this.onInitFormValues()
      },
      immediate: true,
      deep: true
    },

    initialValues: {
      handler() {
        this.onInitFormValues()
      },
      immediate: true,
      deep: true
    }
  },

  created() {
    this.onEmitChange()
  },

  methods: {
    onEmitChange() {
      this.$emit('change', {
        values: this.values,
        initialValues: this.initialValues,
        onSearch: this.onSearch,
        onReset: this.onReset
      })
    },

    onInitFormFields() {
      this.fields = []
      for (const key in this.schema) {
        const field = this.schema[key]
        const { visible = true } = field
        if (visible) {
          field.key = key
          this.fields.push(field)
        }
      }
    },

    onInitFormValues() {
      this.values = {}
      const valuesEntries = Object.entries(this.initialValues)
      this.fields.map(field => {
        const { key } = field
        const value = field.default || this.initialValues[key]
        // 解析组装 [startTime, endTime] 的数据格式
        if (BRACKETS_REG.test(key)) {
          const keyEntries = key.replace(BRACKETS_REG, '').split(',').map((keyEntry, index) => {
            if (Array.isArray(value)) {
              return [keyEntry.trim(), value[index]]
            }
            return [keyEntry.trim(), this.initialValues[keyEntry.trim()]]
          })
          valuesEntries.push([key, keyEntries.map(entry => entry[1]).filter(Boolean)])
        } else {
          valuesEntries.push([field.key, value])
        }
      })
      valuesEntries.forEach(([key, value]) => {
        this.$set(this.values, key, value)
      })
      this.onEmitChange()
    },

    onSubmitFormValues() {
      const submitValues = {}
      Object.entries(this.values).map(valueEntry => {
        const [key, value] = valueEntry
        // 解析组装 [startTime, endTime] 的数据格式
        if (BRACKETS_REG.test(key)) {
          key.replace(BRACKETS_REG, '')
            .split(',')
            .map((keyEntry, index) => {
              submitValues[keyEntry.trim()] = value[index]
            })
        } else {
          submitValues[key] = value
        }
      })
      return clearObject(submitValues)
    },

    onSearch() {
      this.onEmitChange()
      this.$emit('search', this.onSubmitFormValues())
    },

    onReset() {
      this.onInitFormValues()
      this.$emit('search', this.onSubmitFormValues())
    },

    renderControl(field) {
      const { key, type, props = {}, ...rest } = field
      const componentProps = {
        class: rest.class,
        style: rest.style,
        attrs: props,
        props,
        domProps: rest.domProps,
        key
      }

      if (type === 'Input') {
        return (
          <Input
            v-model={this.values[key]}
            {...componentProps}
          />
        )
      }
      if (type === 'Select') {
        return (
          <Select
            v-model={this.values[key]}
            {...componentProps}
          >
            {
              (props.options || []).map(optionProps => (
                <Option
                  key={optionProps.value}
                  { ... { props: optionProps, attrs: optionProps } }
                />
              ))
            }
          </Select>
        )
      }

      if (type === 'DatePicker') {
        return (
          <DatePicker
            v-model={this.values[key]}
            {...componentProps}
          />
        )
      }
    }
  },

  render() {
    return (
      <Form
        class='fc-search'
        model={this.values}
      >
        <div class='fc-search__form'>
          {
            this.fields.map(field => {
              const { key, title } = field
              return (
                <FormItem
                  key={key}
                  label={title}
                >
                  {this.renderControl(field)}
                </FormItem>
              )
            })
          }
          <FormItem data-role='operation'>
            <Button
              type='primary'
              onClick={this.onSearch}
            >
              查询
            </Button>
            <Button
              onClick={this.onReset}
            >
              重置
            </Button>
          </FormItem>
        </div>
      </Form>
    )
  }
}
</script>
<style lang="less">
.fc-search {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  border-bottom: 1px solid #e9ecf0;
  margin-bottom: 20px;

  &__form {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    background-color: #ffffff;

    .el-form-item {
      display: grid;
      grid-template-columns: 110px 250px;
      margin: 0 4px 10px;

      &:before {
        display: none;
      }

      .el-form-item__label {
        padding-left: 10px;
        text-align: right;
      }

      .el-form-item__content {
        .el-date-editor,
        .el-cascader,
        .el-select {
          width: 100%;
          min-width: 250px;
        }
      }

      // 搜索按钮
      &[data-role='operation'] {
        width: 360px;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-form-item__content {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;

          .el-button {
            width: 120px;
          }
        }
      }
    }
  }
}
</style>
