<script >
export default {

  data() {
    return {
      empList:[],
      username:'',
      options: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      },{
        value: '',
        label: '不限'
      }],
      sex:'',
      name:'',
      pageSize:5,
      total:0,
      pageNumber:1,
      addEmp:{},
      addEmpFormVisible:false,
      updateEmp:{},
      updateEmpFormVisible:false,

      empRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        age: [
          { validator: this.validateAge, trigger: 'blur' }
        ],
        position:[
          {required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      roles:[],

    }
  },
  methods: {
    getRoles(){
      this.$axios.get('/role/getRoleName')
        .then(res => {
          this.roles = res.data.data
        })
        .catch(e=>{
          console.log(e)
        })
    },

    getEmpList() {

      var params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        username: this.username,
        sex:this.sex,
        age:this.age,
        name:this.name
      }
      if (this.username != '' || this.name!='' || this.sex!='' || this.age!='') {
        params.username = this.username
        params.sex=this.sex
        params.name=this.name
      }
      this.$axios.get('/emp/page', {params: params})
        .then(res => {
          this.empList = res.data.data.rows
          this.total = res.data.data.total
        })
    },
    reset(){
      this.username=''
      this.name=''
      this.sex=''
      this.age=''
      this.getEmpList()
    },
    validateAge(rule, value, callback) {
      if (value < 0 || value > 100) {
        callback(new Error('年龄必须在0到100之间'));
      } else {
        callback();
      }
    },
    handleSizeChange(val) {
      //将修改后的page赋值给this.pageSize
      this.pageSize = val
      this.getEmpList()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getEmpList()
    },
    handleAvatarSuccess(res, file){
      this.addEmp.imgUrl = res.data;
    },
    showAddEmpDialog(){
      this.addEmpFormVisible=true;
    },
    cancelAddEmp(){

      this.addEmpFormVisible = false
      this.addEmp = {imgUrl:''}
      this.getEmpList()
    },
    //添加用户对象保存按钮
    saveEmp(){
      this.$refs.addEmpForm.validate((valid) => {
        if (valid) {
          // 如果验证通过，则执行保存操作
          // 例如发送数据到后端
          console.log('数据有效，可以提交');

          this.$axios.post('/emp/add', this.addEmp)
            .then(res=>{
              var data=res.data
              if(data.code==200){
                this.$message.success(data.msg)
                this.getEmpList()
                this.addEmpFormVisible = false
                this.addEmp = {}
              }

              else{this.$message.warning(data.msg)}
            })
            .catch(e=>{
              console.log(e)
            })
        } else {
          console.log('验证失败');
          return false;
        }
      });

    },
    cancelUptateEmp(){

      this.getEmpList()
      this.updateEmp={imgUrl:''}
      this.updateEmpFormVisible = false
    },
    modifyEmp(){
      this.$refs.updateEmpForm.validate((valid) => {
        if (valid) {
          // 如果验证通过，则执行保存操作
          console.log('数据有效，可以提交');
          // 这里可以添加修改用户信息的逻辑
          this.$axios.post('/emp/update', this.updateEmp)
            .then(res=>{
              var data=res.data
              if(data.code==200){
                this.$message.success(data.msg)
                this.updateEmpFormVisible = false
              }

              else{this.$message.warning(data.msg)}

            })
            .catch(e=>{
              console.log(e)
            })
        } else {
          console.log('验证失败');
          return false;
        }
      });


    },
    handleUpdateAvatarSuccess(res, file){
      this.updateEmp.imgUrl = res.data
    },
    showUpdateEmpDialog(row){
      this.updateEmpFormVisible = true
      this.updateEmp = row
    },
    deleteEmp(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {type: 'warning'})
        .then(()=> {
          this.$axios.get('/emp/delete',{params:{"id":id}})
            .then(res=>{
              var data=res.data
              if(data.code==200){
                this.$message.success(data.msg)
                this.getEmpList()
              }
              else{this.$message.warning(data.msg)}
            })
            .catch(e=>{
              console.log(e)
            })
        })
        .catch(()=>{
        this.$message.info('取消删除')
      })

    }
  },
  mounted() {
    this.getEmpList()
    this.getRoles()
  }

}
</script>

<template>
  <div >
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="name" placeholder="姓名" style="width: 15vh"></el-input>
        <el-input v-model="username" placeholder="用户名" style="width: 15vh"></el-input>
        <el-select v-model="sex" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>


      </el-form-item>
      <el-form-item>
        <el-button  @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getEmpList()">查询</el-button>
      </el-form-item>

      <el-form-item>
<!--        按钮靠左-->

        <el-button type="primary" @click="showAddEmpDialog" style="float: right;">添加员工</el-button>

      </el-form-item>
    </el-form>
    <el-table :data="empList" border style="width: 100%;opacity: 0.8">
      <el-table-column fixed prop="id" label="序号">
      </el-table-column>
      <el-table-column prop="name" label="姓名" >
      </el-table-column>
      <el-table-column prop="username" label="用户名" >
      </el-table-column>

      <el-table-column prop="age" label="年龄" >
      </el-table-column>
      <el-table-column prop="sex" label="性别" >
      </el-table-column>
      <el-table-column prop="phone" label="电话" >
      </el-table-column>
      <el-table-column prop="position" label="职位" >
      </el-table-column>
      <el-table-column prop="imgUrl" label="头像">
        <template slot-scope="scope">

          <img :src="scope.row.imgUrl" alt="" style="width: 50px;height: 50px"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showUpdateEmpDialog(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteEmp(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件
    @size-change每页显示条数 改变时会触发
    currentPage 页码改变时会触发-->
    <el-paginatio
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="[5,10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-paginatio>

    <!--    添加用户-->

    <el-dialog title="添加员工" :visible.sync="addEmpFormVisible" @close="cancelAddEmp">
      <el-form :model="addEmp" ref="addEmpForm" :rules="empRules">
        <el-form-item label="姓名" label-width=120px prop="name">
          <el-input v-model="addEmp.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" label-width=120px >
          <el-input v-model="addEmp.idNum" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="用户名" label-width=120px  prop="username">
          <el-input v-model="addEmp.username" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="初始密码" label-width=120px  prop="password">
          <el-input v-model="addEmp.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="年龄" label-width=120px prop="age">
          <el-input v-model="addEmp.age" ></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width=120px>
          <el-select v-model="addEmp.sex" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" label-width=120px>
          <el-input v-model="addEmp.phone" ></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width=120px prop="position">
          <el-select v-model="addEmp.position" placeholder="请选择">
            <el-option v-for="role in roles" :key="role" :value="role">{{ role }}</el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="头像" label-width="120px">
          <!--            头像上传组件-->
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8088/emp/img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="addEmp.imgUrl" :src="addEmp.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddEmp">取 消</el-button>
        <el-button type="primary" @click="saveEmp">确 定</el-button>
      </div>
    </el-dialog>

    <!--   修改用户对话框-->

    <el-dialog title="修改员工" :visible.sync="updateEmpFormVisible" @close="cancelUptateEmp">
      <el-form :model="updateEmp" ref="updateEmpForm" :rules="empRules">
        <el-form-item label="ID" label-width=120px >
          <el-input v-model="updateEmp.id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width=120px prop="name" >
          <el-input v-model="updateEmp.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" label-width=120px >
          <el-input v-model="updateEmp.idNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width=120px prop="username">
          <el-input v-model="updateEmp.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width=120px prop="password">
          <el-input v-model="updateEmp.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width=120px>
          <el-select v-model="updateEmp.sex" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" label-width=120px prop="age">
          <el-input v-model="updateEmp.age" ></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width=120px>
          <el-select v-model="updateEmp.position" placeholder="请选择">
            <el-option v-for="role in roles" :key="role" :value="role">{{ role }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像" label-width="120px">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8088/emp/img"
            :show-file-list="false"

            :on-success="handleUpdateAvatarSuccess">
            <img v-if="updateEmp.imgUrl" :src="updateEmp.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUptateEmp">取 消</el-button>
        <el-button type="primary" @click="modifyEmp">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>
