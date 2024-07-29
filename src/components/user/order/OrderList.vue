<template>
  <div class="container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>筛选搜索</span>
        <el-button
        style="float: right;"
        type="primary"
        @click="getOrderList"
        size="small">
        查询搜索
      </el-button>
      <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="输入搜索:">
            <el-input v-model="orderNum" class="input-width" placeholder="订单编号">
            </el-input>
          </el-form-item>
          <el-form-item label="客户名:">
            <el-input v-model="clientName" class="input-width" placeholder="客户名">
            </el-input>
          </el-form-item>
          <el-form-item label="提交时间:">
            <el-date-picker
              class="input-width"
              v-model="createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="orderList"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="240" align="center">
          <template slot-scope="scope">{{ scope.row.orderNum }}</template>
        </el-table-column>
        <el-table-column label="房间号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.roomNum }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template slot-scope="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="客户名" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.clientName }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
            size="small"
            @click="deleteOrder(scope.row.id)"
            type="danger">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-button type="danger" @click="handleDeleteIds">批量删除</el-button>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5,10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>

</template>
<script>

  export default {
    data(){
      return{
        orderList:[],
        page:1,
        pageSize:10,
        total:0,
        id:'',
        orderNum:'',
        multipleSelection: [],
        clientName:'',
        createTime:null
      }
    },
    methods:{
      getOrderList(){
        var params={
          page:this.page,
          pageSize:this.pageSize,
          orderNum:this.orderNum,
          clientName:this.clientName,
          createTime:this.createTime
        }
        if(this.orderNum != ''){
          params.orderNum = this.orderNum;
        }
        if(this.clientName != ''){
          params.clientName = this.clientName;
        }
        if(this.createTime != null){
          console.log(this.createTime);
          params.createTime = this.createTime;
        }
        this.$axios.get('/order/page',{params:params})
        .then(res => {
          this.orderList = res.data.data.rows;
          this.total = res.data.data.total;
        })
      },
      handleResetSearch(){
        this.page=1;
        this.pageSize=10;
        this.orderNum='';
        this.clientName='';
        this.createTime=null;
        this.getOrderList();
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.getOrderList();
      },
      handleCurrentChange(val){
        this.page = val;
        this.getOrderList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleDeleteIds(){
        let ids=[];
        for(let i = 0;i < this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      },
      deleteOrder(ids){
        const idsToSend = Array.isArray(ids) ? ids : [ids];
        console.log(idsToSend)
        this.$confirm('此操作将永久删除该订单，是否继续？','提示',{type:'warning'})
        .then(() =>{
          this.$axios.post('/order/delete',{"ids":idsToSend})
          .then(res => {
            var data = res.data;
            if(data.code == 200){
              this.$message.success(data.msg);
              this.getOrderList();
            }else{
              this.$message.warning(data.msg);
            }
          })
          .catch(e=>{
            console.log(e);
          })
        })
      }
    },
    mounted(){
      this.getOrderList();
    }
  }
</script>
