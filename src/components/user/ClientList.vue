<script>
  export default {
    data(){
      return{
        name:'',
        idNum:'',
        sex:'',
        age:'',
        address:'',
        clientList:[],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        dialogTableVisible:false,
        gridData:[{
          id:1,
          name: '王小明',
          idNum:'123456789',
          sex:'男',
          rooNum:'A111',
          address: '四川省成都市新都区新都大道8号',
          date: '2024-07-26'
        },
          {
            id:2,
            name: '王小明',
            idNum:'123456789',
            sex:'男',
            rooNum:'B111',
            address: '四川省成都市新都区新都大道8号',
            date: '2024-07-20'
          },
          {
            id:3,
            name: '王小明',
            idNum:'123456789',
            sex:'男',
            rooNum:'A107',
            address: '四川省成都市新都区新都大道8号',
            date: '2024-07-10'
          },
          {
            id:4,
            name: '王小明',
            idNum:'123456789',
            sex:'男',
            rooNum:'B110',
            address: '四川省成都市新都区新都大道8号',
            date: '2024-06-20'
          }]
      }
    },
    methods:{
      getClientList(){
        var params={};
        params.pageSize = this.pageSize;
        params.pageNumber = this.pageNumber;
        params.name = this.name;
        params.age = this.age;
        params.sex=this.sex;
        params.idNum = this.idNum;
        params.address = this.address;
        this.$axios.get('client/page',{params:params})
          .then(res=>{
            var data = res.data;
            if(data.code==200){
              this.clientList=data.data.rows;
              this.total=data.data.total;
            }
          })
          .catch(e=>{
            console.log(e)
          })
      },
      setNull(){
        this.name='';
        this.idNum='';
        this.sex='';
        this.age='';
        this.address='';
        this.getClientList();
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.getFormList();
      },
      handleCurrentChange(val){
        this.pageNumber = val;
        this.getFormList();
      }
    },
    mounted() {
      this.getClientList();
    }
  }
</script>

<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="姓名">
        <el-input v-model="name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="idNum" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="sex">
          <el-option label="所有" value=""></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="age" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="请输入地址">
        <el-input v-model="address" placeholder="地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setNull">重置</el-button>
        <el-button  type="primary" @click="getClientList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="clientList"
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
        prop="name"
        label="姓名"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="idNum"
        label="身份证号"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="dialogTableVisible = true">查看住宿记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="住宿记录" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="id" label="序号"></el-table-column>
        <el-table-column property="name" label="姓名" width="100"></el-table-column>
        <el-table-column property="idNum" label="身份证号" width="150"></el-table-column>
        <el-table-column property="sex" label="性别"></el-table-column>
        <el-table-column property="address" label="地址" width="230"></el-table-column>
        <el-table-column property="date" label="入住时间" width="100"></el-table-column>
        <el-table-column property="rooNum" label="入住房间"></el-table-column>
      </el-table>
    </el-dialog>

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
