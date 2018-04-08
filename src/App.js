import React, { Component } from 'react'
import constant from './common/js/constant/constant'
import Storage from './common/js/resource'
import uuidv4 from 'uuid/v4'
import './common/css/font-awesome.min.css'
import './common/css/App.css'

// 获取常量数据
const aSexList = constant.user.sex

//姓名输入框
class NameInput extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onInputChange('name', e.target.value.trim())
  }

  render () {
    let className = 'form-group'
    let errorText = ''
    if (this.props.value.error) {
      className += ' has-error'
      errorText = this.props.value.error
    }
    return (
      <div className={className}>
        <label className="col-md-2">姓名
          {this.props.required &&
          <span className="text-danger">*</span>
          }
        </label>
        <div className="col-md-8">
          <input type="text" className="form-control" value={this.props.value.value} onChange={this.handleChange}
                 disabled={!this.props.editable}/>
          <p className="text-danger">{errorText}</p>
        </div>
      </div>
    )
  }
}

//年龄输入框
class AgeInput extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onInputChange('age', e.target.value)
  }

  render () {
    let className = 'form-group'
    let errorText = ''
    if (this.props.value.error) {
      className += ' has-error'
      errorText = this.props.value.error
    }
    return (
      <div className={className}>
        <label className="col-md-2">年龄
          {this.props.required &&
          <span className="text-danger">*</span>
          }
        </label>
        <div className="col-md-8">
          <input type="number" className="form-control" value={this.props.value.value} onChange={this.handleChange}
                 disabled={!this.props.editable}/>
          <p className="text-danger">{errorText}</p>
        </div>
      </div>
    )
  }
}

//性别输入框
class SexSelect extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.props.onInputChange('sex', e.target.value)
  }

  render () {
    let className = 'form-group'
    let errorText = ''
    if (this.props.value.error) {
      className += ' has-error'
      errorText = this.props.value.error
    }
    return (
      <div className={className}>
        <label className="col-md-2">性别
          {this.props.required &&
          <span className="text-danger">*</span>
          }
        </label>
        <div className="col-md-4">
          <select className="form-control" value={this.props.value.value} onChange={this.handleChange}
                  disabled={!this.props.editable}>
            <option value="">请选择</option>
            {aSexList.map((item) =>
              <option value={item.type} key={item.type}>{item.name}</option>
            )}
          </select>
          <p className="text-danger">{errorText}</p>
        </div>
      </div>
    )
  }
}

//头像上传
class ImgInput extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      loading: false
    }
  }

  handleChange (e) {
    //过渡动画
    this.setState({loading: true})
    const file = e.target.files[0]
    let formData = new FormData()
    formData.append('smfile', file)
    //第三方图片上传接口，https://sm.ms/doc/
    fetch('https://sm.ms/api/upload', {
      method: 'POST',
      mode: 'cors',
      body: formData
    }).then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        this.setState({loading: false})
        console.log('网络故障')
      }
    }).then((msg) => {
      this.setState({loading: false})
      if (msg.code === 'success') {
        this.props.onInputChange('avatar', msg.data.url)
      } else {
        console.log(msg.msg)
      }
    }).catch(function (error) {
      this.setState({loading: false})
      console.log(error.message)
    })
  }

  render () {
    let className = 'form-group'
    let errorText = ''
    let avatarContent = null
    if (this.props.value.error) {
      className += ' has-error'
      errorText = this.props.value.error
    }
    let divStyle = {
      backgroundImage: 'url(' + this.props.value.value + ')'
    }
    if (this.state.loading) {
      // 上传图片过渡动画
      avatarContent = <i className="fa fa-spinner fa-pulse fa-3x fa-fw loading"></i>
    } else {
      avatarContent = <div className="avatar-img" style={divStyle}></div>
    }
    return (
      <div className={className}>
        <label className="col-md-2">头像
          {this.props.required &&
          <span className="text-danger">*</span>
          }
        </label>
        <div className="col-md-8">
          <div className="avatar-item">
            {avatarContent}
          </div>
          <div className="avatar-item">
            <div className="upload">
              <i className="fa fa-upload" aria-hidden="true"></i>
              <p className="upload-text">点击上传</p>
            </div>
            <input type="file" className="input-upload" accept="image/*" onChange={this.handleChange}
                   disabled={!this.props.editable}/>
          </div>
          <p className="text-danger">{errorText}</p>
        </div>
      </div>
    )
  }
}

// 按钮组
class BtnGroup extends Component {
  constructor (props) {
    super(props)
    this.confirmHandle = this.confirmHandle.bind(this)
    this.cancleHandle = this.cancleHandle.bind(this)
    this.modifierHandle = this.modifierHandle.bind(this)
  }

  modifierHandle (e) {
    this.props.modifierHandle()
  }

  confirmHandle (e) {
    this.props.confirmHandle()
  }

  cancleHandle (e) {
    this.props.cancleHandle()
  }
  render () {
    let btn = null
    let confirmDisable
    if (this.props.allValidated) {
      confirmDisable = false
    } else {
      confirmDisable = true
    }
    if (this.props.editable) {
      // 编辑按钮
      btn = (
        <div className="my-btn-group">
          <button type="button" className="btn btn-primary" onClick={this.confirmHandle} disabled={confirmDisable}>确认
          </button>
          <button type="button" className="btn btn-primary" onClick={this.cancleHandle}>取消</button>
        </div>
      )
    } else {
      // 查看按钮
      btn = <button type="button" className="btn btn-success" onClick={this.modifierHandle}>修改</button>
    }
    return (
      <div className="form-group text-center">
        {btn}
      </div>
    )
  }
}

// 表单组件
class UserDetailTable extends Component {
  constructor (props) {
    super(props)
    this.getDefalutFormData = (props) => {
      const data = props.data
      const valid = props.valid
      return {
        name: {
          value: data.name || '',
          valid,
          error: ''
        },
        age: {
          value: data.age || '',
          valid,
          error: ''
        },
        sex: {
          value: data.sex || '',
          valid,
          error: ''
        },
        avatar: {
          value: data.avatar || '',
          valid,
          error: ''
        }
      }
    }
    this.defalutFormData = this.getDefalutFormData(this.props)
    this.inputChange = this.inputChange.bind(this)
    this.editableChange = this.editableChange.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.confirmHandle = this.confirmHandle.bind(this)
    this.cancleHandle = this.cancleHandle.bind(this)
    this.modifierHandle = this.modifierHandle.bind(this)
    this.state = {
      form: this.defalutFormData,
      allValidated: this.props.valid,
      isEditable: this.props.isEditable,
    }
  }

  //更新参数的回调
  componentWillReceiveProps (nextProps) {
    //判断resetModal 的prop是否改变
    console.log(nextProps.addMoreReset, this.props.addMoreReset)
    if (nextProps.addMoreReset !== this.props.addMoreReset) {
      this.resetForm()
    }
  }
  //表单验证
  inputChange (type, value) {
    let newValue = {value, valid: true, error: ''}
    let newForm
    switch (type) {
      case 'name': {
        if (value.length >= 11) {
          newValue.error = '用户名最多10个字符'
          newValue.valid = false
        } else if (value.length === 0) {
          newValue.error = '请输入用户名'
          newValue.valid = false
        }
        break
      }
      case 'age': {
        if (value > 100 || value <= 0) {
          newValue.error = '请输入1~100之间的数字'
          newValue.valid = false
        }
        break
      }
      case 'sex': {
        if (!value) {
          newValue.error = '请选择性别'
          newValue.valid = false
        }
        break
      }
      case 'avatar': {
        if (!value) {
          newValue.error = '请上传图片'
          newValue.valid = false
        }
        break
      }
      default: {

      }
    }
    newForm = {
      ...this.state.form,
      [type]: newValue
    }
    this.setState({form: newForm}, this.isAllValidated)
    // this.isAllValidated()
  }
  //是否全部验证通过
  isAllValidated () {
    for (let value of Object.values(this.state.form)) {
      if (value.valid !== true) {
        this.setState({allValidated: false})
        return false
      }
    }
    this.setState({allValidated: true})
  }

  //改变编辑状态
  editableChange (boolean) {
    if (boolean === false) {
      //重置表单数据
      this.setState({form: this.defalutFormData}, () => {
        //重置编辑状态
        this.setState({isEditable: boolean})
      })
    } else {
      //重置编辑状态
      this.setState({isEditable: boolean})
    }
  }

  //确认回调
  confirmHandle () {
    if (this.props.uploadType === 'Post') {
      const uid = uuidv4()
      let data = {}
      for (let key in this.state.form) {
        data[key] = this.state.form[key].value
      }
      data.uid = uid
      Storage.User.Post(data).then((aNewData) => {
        this.props.updateListData(aNewData)
        this.cancleHandle()
        alert('提交成功')
      }, (msg) => {
        alert(msg)
      })
    } else if (this.props.uploadType === 'Put') {
      const uid = this.props.data.uid
      let data = {}
      for (let [key, value] of Object.entries(this.state.form)) {
        data[key] = value.value
      }
      data.uid = uid
      Storage.User.Put(uid, data).then((aNewData) => {
        this.props.updateListData(aNewData)
        this.cancleHandle()
        alert('修改成功')
      }, (msg) => {
        alert(msg)
      })
    }
  }

  //取消回调
  cancleHandle () {
    if (this.props.uploadType === 'Post') {
      // this.setState({form: this.defalutFormData})
      // this.resetForm()
      this.props.onClose(false)
    } else if (this.props.uploadType === 'Put') {
      this.editableChange(false)
    }
  }

  //修改回调
  modifierHandle () {
    this.editableChange(true)
  }

  //重置表单
  resetForm () {
    this.setState({
      form: this.defalutFormData,
      allValidated: this.props.valid,
      isEditable: this.props.isEditable,
    })
  }

  render () {
    // const data = this.props.data
    let isEditable = this.state.isEditable
    return (
      <div className="panel-body">
        <form className="form-horizontal">
          <NameInput value={this.state.form.name} onInputChange={this.inputChange} required={true}
                     editable={isEditable}/>
          <AgeInput value={this.state.form.age} onInputChange={this.inputChange} required={true} editable={isEditable}/>
          <SexSelect value={this.state.form.sex} onInputChange={this.inputChange} required={true}
                     editable={isEditable}/>
          <ImgInput value={this.state.form.avatar} onInputChange={this.inputChange} required={true}
                    editable={isEditable}/>
          <BtnGroup modifierHandle={this.modifierHandle} allValidated={this.state.allValidated}
                    confirmHandle={this.confirmHandle}
                    cancleHandle={this.cancleHandle}
                    editable={isEditable}/>
        </form>
      </div>
    )
  }
}

// 收缩框组件
class CollapsePanel extends Component {
  render () {
    let collapseClass = 'panel-collapse collapse'
    //是否打开
    if (this.props.expanded) {
      collapseClass += 'in'
    }
    return (
      <div className={collapseClass}>
        <UserDetailTable data={this.props.data} valid={true} isEditable={false}
                         uploadType="Put" updateListData={this.props.updateListData}/>
      </div>
    )
  }
}

// 列表行组件
class UserRow extends Component {
  constructor (props) {
    super(props)
    this.deleteHandle = this.deleteHandle.bind(this)
    this.expandHandle = this.expandHandle.bind(this)
  }

  deleteHandle (e) {
    const uid = this.props.data.uid
    this.props.deleteHandle(uid, e)
  }

  expandHandle (e) {
    this.props.expandHandle(this.props.data.uid, e)
  }
  render () {
    const data = this.props.data
    let collapseClass = 'fa fa-angle-right icon-expand'
    //是否打开
    if (this.props.expand) {
      collapseClass += ' fa-rotate-90'
    }
    return (
      <div>
        <div className="panel-heading my-panel-heading">
          <h5 className="head-container">
            <div className="head-title">
              <i className={collapseClass} aria-hidden="true" onClick={this.expandHandle}></i>
              {data.name}
            </div>
            <div className="head-btn text-right">
              <button type="button" className="btn btn-xs btn-danger" onClick={this.deleteHandle}>删除</button>
            </div>
          </h5>

        </div>
        <CollapsePanel data={data} expanded={this.props.expand} updateListData={this.props.updateListData}/>
      </div>
    )
  }
}

// 用户列表组件
class UserList extends Component {
  constructor (props) {
    super(props)
    this.expendHandle = this.expendHandle.bind(this)
    this.state = {
      selectId: ''
    }
  }

  expendHandle (uid, e) {
    if (this.state.selectId === uid) {
      this.setState({selectId: ''})
    } else {
      this.setState({selectId: uid})
    }
  }

  render () {
    const listItems = this.props.data.map((item) => {
        let isExpand
        if (this.state.selectId === item.uid) {
          isExpand = true
        } else {
          isExpand = false
        }
        return (<div className="panel panel-default my-panel" key={item.uid}>
          <UserRow data={item} updateListData={this.props.updateListData}
                   deleteHandle={this.props.deleteHandle}
                   expand={isExpand} expandHandle={this.expendHandle}/>
        </div>)
      }

    )
    return (
      <div className="panel-group">
        {listItems}
      </div>
    )
  }
}

// 模态框组件
class Modal extends Component {
  constructor (props) {
    super(props)
    this.closeHandle = this.closeHandle.bind(this)
  }

  closeHandle () {
    this.props.onClose()
  }
  render () {
    let modalClass = 'modal fade'
    //是否打开
    if (this.props.show) {
      modalClass += ' in'
    }
    return (
      <div className={modalClass}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button className="close" type="button" onClick={this.closeHandle}><span aria-hidden="true">×</span><span
                className="sr-only">Close</span></button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    // this.addMorePropDefalue = {
    //   data: {},
    //   valid: false,
    //   isEditable: true
    // }
    const addMorePropDefalue = {
      data: {},
      valid: false,
      isEditable: true
    }
    this.addMoreHandle = this.addMoreHandle.bind(this)
    this.addMoreCloseHandle = this.addMoreCloseHandle.bind(this)
    this.updateListData = this.updateListData.bind(this)
    this.deleteHandle = this.deleteHandle.bind(this)
    this.deleteConfirmHandle = this.deleteConfirmHandle.bind(this)
    this.deleteCancleHandle = this.deleteCancleHandle.bind(this)
    this.state = {
      listData: [],
      addMoreProp: addMorePropDefalue,
      addMoreShow: false,
      addMoreReset: false,
      deleteConfirmShow: false,
      deleteUid: ''
    }
  }

  componentDidMount () {
    Storage.User.Get().then((data) => {
      this.setState({listData: data})
    }, (msg) => {
      alert(msg)
    })
  }

  addMoreHandle () {
    this.setState({addMoreShow: true})
  }

  addMoreCloseHandle () {
    this.setState({
      addMoreShow: false,
      addMoreReset: !this.state.addMoreReset
    })
    // this.setState({
    //   addMoreProp: {
    //     data: {},
    //     valid: true
    //   }
    // })

  }

  updateListData (newData) {
    this.setState({listData: newData})
  }

  //点击删除
  deleteHandle (uid, e) {
    this.setState({deleteConfirmShow: true})
    this.setState({deleteUid: uid})
  }

  //删除确认
  deleteConfirmHandle (e) {
    Storage.User.Delete(this.state.deleteUid).then((aNewData) => {
      this.updateListData(aNewData)
      this.setState({deleteConfirmShow: false})
      this.setState({deleteUid: ''})
      alert('删除成功')
    }, (msg) => {
      alert(msg)
    })
  }

  //删除取消
  deleteCancleHandle (e) {
    this.setState({deleteConfirmShow: false})
    this.setState({deleteUid: ''})
  }
  render () {
    let listContent = null
    const userListData = this.state.listData
    if (userListData.length > 0) {
      listContent = <UserList data={userListData} updateListData={this.updateListData}
                              deleteHandle={this.deleteHandle}
      />
    } else {
      listContent = <p className="text-danger">暂无数据，请添加用户</p>
    }
    return (
      <div>
        <div className="container navbar-fixed-top">
          <div className="navbar-addmore">
            <button type="button" className="btn btn-sm btn-success" onClick={this.addMoreHandle}>新增</button>
          </div>
        </div>
        <div className="container list-container">
          <div className="list-wrapper">
            {listContent}
          </div>
        </div>
        <Modal title="添加用户" show={this.state.addMoreShow} onClose={this.addMoreCloseHandle}>
          <UserDetailTable data={this.state.addMoreProp.data} valid={this.state.addMoreProp.valid}
                           isEditable={this.state.addMoreProp.isEditable} updateListData={this.updateListData}
                           onClose={this.addMoreCloseHandle} addMoreReset={this.state.addMoreReset}
                           uploadType='Post'/>
        </Modal>
        <Modal title="提示" show={this.state.deleteConfirmShow} onClose={this.deleteCancleHandle}>
          <p>是否删除此用户</p>
          <BtnGroup editable={true} confirmHandle={this.deleteConfirmHandle}
                    cancleHandle={this.deleteCancleHandle}
                    allValidated={true}/>
        </Modal>
      </div>
    )
  }
}

// {...this.state.addMoreProp}

export default App
