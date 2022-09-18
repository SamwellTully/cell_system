/**
 * 验证不可输入特殊字符
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
 export function checkInputString(rule, value, callback) {
    if (value) {
      if (value.match(/^[\u4E00-\u9FA5A-Za-z0-9_]+?$/)) {
        callback()
      } else {
        callback(new Error('不可输入特殊字符'))
      }
    }
  }
  /**
   * 验证数字可为正负，数值大小，小数位数验证 参数 isNegative(是否可为负数，默认为false)，maxValue(不超过的最大值,默认为10000000)，decimal(小数位数，默认7位)
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  export function checkDecimal(rule, value, callback) {
    if (value) {
      value += ''
      var negative = rule.isNegative ? rule.isNegative : false
      var maxValue = rule.maxValue ? rule.maxValue : 10000000
      var minValue = 0
      var decimal = rule.decimal ? rule.decimal : 7
      if (rule.decimal === 0) {
        decimal = 0
      }
      var re = null
      if (negative) {
        minValue = '-' + maxValue
        // eslint-disable-next-line no-eval
        re = eval('/^(\\-)?(0|[1-9][0-9]*)(\\.\\d{0,' + decimal + '})?$/')
      } else {
        // eslint-disable-next-line no-eval
        re = eval('/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{0,' + decimal + '})?$/')
      }
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else {
        if (value.match(re)) {
          var num = parseFloat(value)
          if (negative) {
            if (num > minValue && num < maxValue) {
              callback()
            } else { callback(new Error('超出有效输入范围')) }
          } else {
            if (num >= minValue && num < maxValue) {
              callback()
            } else { callback(new Error('超出有效输入范围')) }
          }
        } else {
          callback(new Error('输入有误'))
        }
      }
    } else { callback() }
  }
  /**
   * 验证数字输入范围在0-10000000之间，且小数可7位
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  export function checkNumber(rule, value, callback) {
    if (value) {
      value += ''
      if (value.match(/^\d+$/)) {
        var num = parseFloat(value)
        if (num >= 0 && num < 10000000) {
          callback()
        } else { callback(new Error('超出有效输入范围')) }
      } else {
        callback(new Error('请输入正整数'))
      }
    } else { callback() }
  }
  /**
   * 验证经度输入范围在-180-180之间，且小数可7位
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  export function checkLon(rule, value, callback) {
    if (value) {
      value += ''
      if (value.match(/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,7})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/)) {
        callback()
      } else {
        callback(new Error('经度为-180~180,小数限7位!'))
      }
    } else {
      callback()
    }
  }
  /**
   * 验证纬度输入范围在-180-180之间，且小数可7位
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  export function checkLat(rule, value, callback) {
    if (value) {
      value += ''
      if (value.match(/^(\-|\+)?([0-8]?\d{1}\.\d{0,7}|90\.0{0,6}|[0-8]?\d{1}|90)$/)) {
        callback()
      } else {
        callback(new Error('纬度为-90~90,小数限7位'))
      }
    } else {
      callback()
    }
  }
  /**
   * 验证输入长度
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  export function checkLong(rule, value, callback) {
    if (value) {
      if (value.length < rule.length && value.length >= 0) {
        callback()
      } else {
        callback(new Error('输入不可超过' + rule.length + '个字符'))
      }
    } else {
      callback()
    }
  }
  
  /**
   * 验证不能为空
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  export function checkNull(rule, value, callback) {
    if (!value) {
      if (value === 0) { callback() } else {
        callback(new Error(rule.message))
      }
    } else {
      value += ''
      if (value.length > 0) {
        callback()
      } else { callback(new Error(rule.message)) }
    }
  }
  /**
   * 验证数组
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  export function checkArray(rule, value, callback) {
    console.log(value)
    if (value.length > 0) {
      callback()
    } else {
      callback(new Error(rule.message))
    }
  }
  
  
  