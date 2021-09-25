export const isFunction = (params) => {
  return (typeof params).endsWith('function')
}

export const isArray = (params) => {
  return Array.isArray(params)
}
