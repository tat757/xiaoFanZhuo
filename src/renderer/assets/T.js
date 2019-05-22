const T = {
  setTime: (time, option) => {
    const optionArray = option.split('')
    const optionCache = {}
    for (let i = optionArray.length - 1; i >= 0; i--) {
      optionCache[optionArray[i]] = true
    }
    let result = ''
    const formatTime = new Date(time)
    if (optionCache['Y']) {
      result += formatTime.getFullYear()
    }
    if (optionCache['M']) {
      result += '-' + (formatTime.getMonth() + 1 < 10 ? '0'+ (formatTime.getMonth() + 1) : formatTime.getMonth() + 1)
    }
    if (optionCache['D']) {
      result += '-' + (formatTime.getDate() < 10 ? '0' + formatTime.getDate() : formatTime.getDate())
    }
    if (optionCache['H']) {
      result += ' ' + (formatTime.getHours() < 10 ? '0' + formatTime.getHours() : formatTime.getHours())
    }
    if (optionCache['m']) {
      result += ':' + (formatTime.getMinutes() < 10 ? '0' + formatTime.getMinutes() : formatTime.getMinutes())
    }
    if (optionCache['S']) {
      result += ':' + (formatTime.getSeconds() < 10 ? '0' + formatTime.getSeconds() : formatTime.getSeconds())
    }
    if (optionCache['N']) {
      const now = Date.now()
      const cap = now - formatTime
      const minute = 60 * 1000
      const hour = minute * 60
      const day = hour * 24
      const month = day * 30
      const year = month * 12
      let text = ''
      if (cap < minute) {
        text = cap + '秒前'
      } else if (cap < hour) {
        text = Math.floor(cap / minute) + '分钟前'
      } else if (cap < day) {
        text = Math.floor(cap / hour) + '小时前'
      } else if (cap < month) {
        text = Math.floor(cap / day) + '天前'
      } else if (cap < year) {
        text = Math.floor(cap / month) + '月前'
      } else {
        text = Math.floor(cap / year) + '年前'
      }
      result += '(' + text + ')'
    }
    return result
  }
}

export default T