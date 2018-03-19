const USER_LIST = 'aUser'
if (!window.localStorage) {
  alert('浏览器不支持localStorage，无法保存数据')
}
export default {
  /**
   * 用户类
   */
  User: {
    /**
     * 获取用户列表
     */
    Get: () => {
      return new Promise((resolve, reject) => {
        let aListData
        if (!localStorage.getItem(USER_LIST)) {
          aListData = []
          resolve(aListData)
        } else {
          aListData = localStorage.getItem(USER_LIST)
          aListData = JSON.parse(aListData)
          resolve(aListData)
        }
      })
    },
    /**
     * 新增用户
     * @param {Object}data 用户数据对象
     * @param CallBack 回调函数
     */
    Post: (data) => {
      return new Promise((resolve, reject) => {
        let aListData
        if (!localStorage.getItem(USER_LIST)) {
          aListData = []
        } else {
          aListData = localStorage.getItem(USER_LIST)
          aListData = JSON.parse(aListData)
        }
        aListData.push(data)
        const jListData = JSON.stringify(aListData)
        localStorage.setItem(USER_LIST, jListData)
        resolve(aListData)
      })
    },
    /**
     * 修改用户
     * @param {String}uid 用户数据对象
     * @param {Object}data 用户数据对象
     * @param CallBack 回调函数
     */
    Put: (uid, data) => {
      return new Promise((resolve, reject) => {
        let aListData
        if (!localStorage.getItem(USER_LIST)) {
          reject('未查询到数据')
        } else {
          aListData = localStorage.getItem(USER_LIST)
          aListData = JSON.parse(aListData)
          const dataIndex = aListData.findIndex(function (value, index, arr) {
            return value.uid === uid
          })
          if (dataIndex === -1) {
            reject('未查询到数据')
          } else {
            aListData[dataIndex] = data
            const jListData = JSON.stringify(aListData)
            localStorage.setItem(USER_LIST, jListData)
            resolve(aListData)
          }
        }
      })
    },
    /**
     * 删除用户
     * @param {String}uid 用户数据对象
     * @param {Object}data 用户数据对象
     * @param CallBack 回调函数
     */
    Delete: (uid) => {
      return new Promise((resolve, reject) => {
        let aListData
        if (!localStorage.getItem(USER_LIST)) {
          reject('未查询到数据')
        } else {
          aListData = localStorage.getItem(USER_LIST)
          aListData = JSON.parse(aListData)
          const dataIndex = aListData.findIndex(function (value, index, arr) {
            return value.uid === uid
          })
          if (dataIndex === -1) {
            reject('未查询到数据')
          } else {
            aListData[dataIndex] = aListData
            aListData.splice(dataIndex, 1)//删除这条数据
            const jListData = JSON.stringify(aListData)
            localStorage.setItem(USER_LIST, jListData)
            resolve(aListData)
          }
        }
      })
    },

  }
}