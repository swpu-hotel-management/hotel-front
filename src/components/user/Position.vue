<script >
export default {
  data() {
    return {
      positionList:[],
      roleName:'',
      pageNumber:1,
      pageSize:5,
      total:0,
      addRoleFormVisible:false,

      addRole:{permType:2},
      updateRoleFormVisible:false,
      updateRole:{},
    }
  },
  methods: {

    getPositionList(){
      var params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        roleName:this.roleName
      }
      this.$axios.get('/role/positionPage', {params: params})
        .then(res => {
          this.positionList = res.data.data.rows
          this.total = res.data.data.total
        })
    },
    handleSizeChange(val) {
      //将修改后的page赋值给this.pageSize
      this.pageSize = val
      this.getPositionList()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getPositionList();
    },
    showAddRoleDialog(){
      //设置addUseerFormVisable为true

      this.addRoleFormVisible = true
    },
    //添加用户对象取消按钮
    cancelAddRole(){

      this.addRoleFormVisible = false
      this.addRole = {}
    },
    //添加用户对象保存按钮
    saveRole(){
      this.$axios.post('/role/add', this.addRole)
        .then(res=>{
          var data=res.data
          if(data.code==200){
            this.$message.success(data.msg)
            this.getPositionList()
            this.addRoleFormVisible = false
            this.addRole = {imgUrl:''}
          }

          else{this.$message.warning(data.msg)}
        })
        .catch(e=>{
          console.log(e)
        })


    },

    showUpdateRoleDialog(row){
      //设置为ture
      this.updateRoleFormVisible = true
      //将当前行数据回显到对话框

      this.updateRole = row;
    },
    cancelUptateRole(){

      this.getPositionList()
      this.updateRole={}
      this.updateRoleFormVisible = false
    },
    modifyRole(){

      this.$axios.post('/role/update', this.updateRole)
        .then(res=>{
          var data=res.data
          if(data.code==200){
            this.$message.success(data.data)
            this.updateRoleFormVisible = false
          }

          else{this.$message.warning(data.data)}

        })
        .catch(e=>{
          console.log(e)
        })
    },
    delateRole(id){

      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {type: 'warning'})
        .then(()=> {
          this.$axios.get('/role/delete',{params:{"id":id}})
            .then(res=>{
              var data=res.data
              if(data.code==200){
                this.$message.success(data.data)
                this.getPositionList()
              }
              else{
                this.$message.warning(data.data)
              }
            })
            .catch(e=>{
              console.log(e)
            })
        })

    },
  },
  mounted() {
    this.getPositionList()
  }
}

</script>

<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="roleName" placeholder="职位名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPositionList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showAddRoleDialog" >添加职位</el-button>

      </el-form-item>
    </el-form>
  <el-table :data="positionList" border style="width: 100%;opacity: 0.8">
    <el-table-column fixed prop="id" label="序号">
    </el-table-column>
    <el-table-column prop="roleName" label="职位名" >
    </el-table-column>
    <el-table-column prop="permType" label="管理员工权限">
      <template slot-scope="scope">
        <!-- 使用三元运算符来显示不同的文本 -->
        {{ scope.row.permType === 1 ? '有' : '没有' }}
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="showUpdateRoleDialog(scope.row)">修改</el-button>
        <el-button type="danger" size="small" @click="delateRole(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


<!--分页组件-->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageNumber"
    :page-sizes="[5,10, 20, 30, 40]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
    <!--    添加用户对话框
visible.sync控制对话框是否显示标记-->

    <el-dialog title="添加职位" :visible.sync="addRoleFormVisible">
      <el-form :model="addRole">
        <el-form-item label="职位名" label-width=120px >
          <el-input v-model="addRole.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员工权限" label-width="120px">
          <el-select v-model="addRole.permType" placeholder="请选择">
            <el-option label="有" value="1"></el-option>
            <el-option label="没有" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRole">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>


    <!--   修改用户对话框
   visible.sync控制对话框是否显示标记-->

    <el-dialog title="修改职位" :visible.sync="updateRoleFormVisible">
      <el-form :model="updateRole">
        <el-form-item label="ID" label-width=120px >
          <el-input v-model="updateRole.id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位名" label-width=120px >
          <el-input v-model="updateRole.roleName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="管理员工权限" label-width=120px>
          <el-select v-model="updateRole.permType" placeholder="请选择">

            <el-option label="有" value="1"></el-option>
            <el-option label="没有" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUptateRole">取 消</el-button>
        <el-button type="primary" @click="modifyRole">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<style scoped>

</style>
