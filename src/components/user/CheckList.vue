<script>
  export default {
    data(){
      return{
        roomNum:'',
        type:'',
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        formList:[],
        time:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
            {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }
          ,{
              text: '最近半个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                picker.$emit('pick', [start, end]);
              }
            },
            {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    methods:{
      getFormList(){
        var params={};
        params.roomNum = this.roomNum;
        params.type = this.type;
        params.pageSize = this.pageSize;
        params.pageNumber = this.pageNumber;
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
      checkOut(){

      },
      showAddTimeDialog(row){

      },
      handleSizeChange(val){

      },
      handleCurrentChange(val){

      }
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
      <el-form-item label="房间类型" label-width="100px">
        <el-select v-model="type" placeholder="请选择">
          <el-option label="无" value=""></el-option>
          <el-option label="单人间" value="单人间"></el-option>
          <el-option label="双人间" value="双人间"></el-option>
          <el-option label="三人间" value="三人间"></el-option>
          <el-option label="四人间" value="四人间"></el-option>
          <el-option label="总统套房" value="总统套房"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围" label-width="100px">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <template>
          <el-button  type="primary" @click="getFormList">查询</el-button>
        </template>
      </el-form-item>
    </el-form>
    <el-table
      :data="formList"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="id"
        label="序号"
      >
      </el-table-column>
      <el-table-column
        prop="roomNum"
        label="房间号"
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
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
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showAddTimeDialog(scope.row)">续住</el-button>
          <el-button type="danger" size="small" @click="checkOut">退房</el-button>
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
  </div>
</template>

<style scoped>

</style>
