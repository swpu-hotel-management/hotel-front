<script>
  import axios from "axios";

  export default {
    data(){
      return{
        roomNum:'',
        type:'',
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        formList:[],
        status:'',
        addTimeFormVisible:false,
        hours:'',
        id:''
      }
    },
    methods:{
      getFormList(){
        var params={};
        params.roomNum = this.roomNum;
        params.pageSize = this.pageSize;
        params.pageNumber = this.pageNumber;
        params.status = this.status;
        this.$axios.get('form/page',{params:params})
          .then(res=>{
            var data = res.data;
            if(data.code==200){
              this.formList=data.data.rows;
              this.total=data.data.total;
            }
          })
          .catch(e=>{
            console.log(e)
          })
      },
      setNull(){
        this.roomNum='';
        this.status='';
        this.getFormList();
      },
      checkOut(id){
        this.$confirm("确定退房？","提示",{
          confirmButtonText:"确定",
          cancelButtonText:"取消",
          type:"warning"
        })
          .then(()=>{
            this.$axios.get('/form/checkOut',{params:{"id":id}})
              .then((res)=>{
                var data = res.data;
                if(data.code == 200){
                  this.$message.success(data.msg);
                  this.getFormList();
                }else{
                  this.$message.error("出现未知错误");
                }
              })
              .catch(e=>{
                console.log(e);
              })
          })
      },
      showAddTimeDialog(id){
        this.addTimeFormVisible=true;
        this.id=id;
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.getFormList();
      },
      handleCurrentChange(val){
        this.pageNumber = val;
        this.getFormList();
      },
      cancelAddTime(){
        this.hours=0;
        this.addTimeFormVisible=false;
      },
      saveAddTime(){
        this.$confirm("确定为客人续住？","提示",{
          confirmButtonText:"确定",
          cancelButtonText:"取消",
          type:"warning"
        })
        .then(()=>{
          var params={};
          params.hours=this.hours;
          params.id = this.id;
          this.$axios.get('form/addTime',{params:params})
            .then(res=>{
              var data = res.data;
              if(data.code==200){
                this.$message.success(data.msg);
                this.addTimeFormVisible=false;
                this.getFormList();
              }else {
                this.$message.error("出错了");
              }
            })
            .catch(e=>{
              console.log(e)
            })
        })
      },
    },
    mounted() {
      this.getFormList();
    }
  }
</script>

<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="房间号">
        <el-input v-model="roomNum" placeholder="请输入房间号"></el-input>
      </el-form-item>
      <el-form-item label="是否退房" label-width="100px">
        <el-select v-model="status" placeholder="请选择">
          <el-option label="无" value=""></el-option>
          <el-option label="未退房" value="0"></el-option>
          <el-option label="已退房" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <template>
          <el-button @click="setNull">重置</el-button>
          <el-button  type="primary" @click="getFormList">查询</el-button>
        </template>
      </el-form-item>
    </el-form>
    <el-table
      :data="formList"
      border
      style="width: 100%"
      max-height="600"
      :default-sort = "{prop: 'id', order: 'ascending'}"
    >
      <el-table-column
        fixed
        prop="id"
        label="序号"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="roomNum"
        label="房间号"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="client1Name"
        label="入住人员1"
      >
      </el-table-column>
      <el-table-column
        prop="client2Name"
        label="入住人员2"
      >
      </el-table-column>
      <el-table-column
        prop="client3Name"
        label="入住人员3"
      >
      </el-table-column>
      <el-table-column
        prop="client4Name"
        label="入住人员4"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="退房状态"
        sortable
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'danger'"
            disable-transitions>{{scope.row.status===1?"已退房":"未退房"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="157"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showAddTimeDialog(scope.row.id)">续住</el-button>
          <el-button type="danger" size="small" @click="checkOut(scope.row.id)">退房</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="[5, 10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog title="续住操作" :visible.sync="addTimeFormVisible">
      <el-form>
        <el-form-item label="增加时间(小时)" label-width="120px">
            <el-select v-model="hours" placeholder="请选择">
              <el-option label="3小时" value="3"></el-option>
              <el-option label="6小时" value="6"></el-option>
              <el-option label="9小时" value="9"></el-option>
              <el-option label="12小时" value="12"></el-option>
              <el-option label="24小时" value="24"></el-option>
              <el-option label="36小时" value="36"></el-option>
              <el-option label="48小时" value="48"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddTime">取 消</el-button>
        <el-button type="primary" @click="saveAddTime">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>
