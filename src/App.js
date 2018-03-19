import React, { Component } from 'react'
import constant from './common/js/constant/constant'
import './common/css/font-awesome.min.css'
import './common/css/App.css'

// 获取选项数据
const aSexList = constant.user.sex

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
        <div className="col-md-2">
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

class BtnGroup extends Component {
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
          <button className="btn btn-primary" disabled={confirmDisable}>确认</button>
          <button className="btn btn-primary">取消</button>
        </div>
      )
    } else {
      // 查看按钮
      btn = <button className="btn btn-success">修改</button>
    }
    return (
      <div className="form-group text-center">
        {btn}
      </div>
    )
  }
}

class UserDetailTable extends Component {
  constructor (props) {
    super(props)
    const data = this.props.data
    const valid = this.props.valid
    this.inputChange = this.inputChange.bind(this)
    this.state = {
      form: {
        name: {
          value: data.name,
          valid,
          error: ''
        },
        age: {
          value: data.age,
          valid,
          error: ''
        },
        sex: {
          value: data.sex,
          valid,
          error: ''
        },
        avatar: {
          value: data.avatar,
          valid,
          error: ''
        },
      },
      allValidated: valid,
      isEditable: this.props.isEditable
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

  editableChange (boolean) {
    this.setState({isEditable: boolean})
  }

  render () {
    const data = this.props.data
    const isEditable = true
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
          <BtnGroup onEditableChange={this.editableChange} allValidated={this.state.allValidated}
                    editable={isEditable}/>
        </form>
      </div>
    )
  }
}

class CollapsePanel extends Component {
  render () {
    let collapseClass = 'panel-collapse collapse'
    //是否打开
    if (this.props.expanded) {
      collapseClass += 'in'
    }
    return (
      <div className={collapseClass}>
        <UserDetailTable data={this.props.data} valid={true}/>
      </div>
    )
  }
}

class UserRow extends Component {
  render () {
    const data = this.props.data
    return (
      <div>
        <div className="panel-heading my-panel-heading">
          <h5 className="head-container">
            <div className="head-title">
              <i className="fa fa-angle-right icon-expand" aria-hidden="true"></i>
              {data.name}
            </div>
            <div className="head-btn text-right">
              <button className="btn btn-xs btn-danger">删除</button>
            </div>
          </h5>

        </div>
        <CollapsePanel data={data} expanded={true}/>
      </div>
    )
  }
}

class UserList extends Component {
  render () {
    const listItems = this.props.data.map((item) =>
      <div className="panel panel-default my-panel" key={item.uid}>
        <UserRow data={item}/>
      </div>
    )
    return (
      <div className="panel-group">
        {listItems}
      </div>
    )
  }
}

class Modal extends Component {
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
              <button className="close" type="button"><span aria-hidden="true">×</span><span
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
  render () {
    let listContent = null
    if (userListData.length > 0) {
      listContent = <UserList data={userListData}/>
    } else {
      listContent = <p className="text-danger">暂无数据，请添加用户</p>
    }
    return (
      <div>
        <div className="container navbar-fixed-top">
          <div className="navbar-addmore">
            <button className="btn btn-sm btn-success">新增</button>
          </div>
        </div>
        <div className="container list-container">
          <div className="list-wrapper">
            {listContent}
          </div>
        </div>
        <Modal title="添加用户" show={false}>
          <UserDetailTable data={{}}/>
        </Modal>
        <Modal title="提示" show={false}>
          <p>是否删除此用户</p>
          <BtnGroup editable={true}/>
        </Modal>
      </div>
    )
  }
}

const userListData = [
  {
    uid: 'Sporting Goods',
    name: 'Football',
    age: '22',
    sex: '0',
    avatar: 'http://ww1.sinaimg.cn/large/a7f60d8agy1fph9cixkxfg20dc0dc74p.jpg'
  },
  {
    uid: 'Sporting Good',
    name: 'Football',
    age: '22',
    sex: '0',
    avatar: 'http://ww1.sinaimg.cn/large/a7f60d8agy1fph9cixkxfg20dc0dc74p.jpg'
  },
  {
    uid: 'Sporting Goo',
    name: 'Football',
    age: '22',
    sex: '0',
    avatar: 'http://ww1.sinaimg.cn/large/a7f60d8agy1fph9cixkxfg20dc0dc74p.jpg'
  },
  {
    uid: 'Sporting Go',
    name: 'Football',
    age: '22',
    sex: '0',
    avatar: 'http://ww1.sinaimg.cn/large/a7f60d8agy1fph9cixkxfg20dc0dc74p.jpg'
  },
  {
    uid: 'Sporting G',
    name: 'Football',
    age: '22',
    sex: '0',
    avatar: 'http://ww1.sinaimg.cn/large/a7f60d8agy1fph9cixkxfg20dc0dc74p.jpg'
  },
  {
    uid: 'Sporting',
    name: 'Football',
    age: '22',
    sex: '0',
    avatar: 'http://ww1.sinaimg.cn/large/a7f60d8agy1fph9cixkxfg20dc0dc74p.jpg'
  },
  {
    uid: 'Sportin',
    name: 'Football',
    age: '22',
    sex: '0',
    avatar: 'http://ww1.sinaimg.cn/large/a7f60d8agy1fph9cixkxfg20dc0dc74p.jpg'
  }
]

export default App
