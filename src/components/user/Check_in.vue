<script>
export default {
  data() {
    return {
      roomNum: '',
      type: '',
      status: '',
      roomList: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      chickInFormVisible: false,
      checkForm: {},
      client1: {},
      client2: {},
      client3: {},
      client4: {},
      clients: [],
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
            picker.$emit('pick', date);
          }
        }, {
          text: '大后天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
            picker.$emit('pick', date);
          }
        }]
      }
    }
  },
  methods: {
    getRoomList() {
      var params = {};
      params.roomNum = this.roomNum;
      params.type = this.type;
      params.status = this.status;
      params.pageSize = this.pageSize;
      params.pageNumber = this.pageNumber;
      this.$axios.get('room/checkPage', {params: params})
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.roomList = data.data.rows;
            this.total = data.data.total;
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    showCheckInDialog() {
      this.chickInFormVisible = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRoomList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getRoomList();
    },
    cancelCheckIn() {
      this.checkForm = {};
      this.clients = [];
      this.client1 = {};
      this.client2 = {};
      this.client3 = {};
      this.client4 = {};
      this.chickInFormVisible = false;
    },
    saveCheckIn() {
      this.clients.push(this.client1);
      this.clients.push(this.client2);
      this.clients.push(this.client3);
      this.clients.push(this.client4);
      this.checkForm.clients = this.clients;

      this.$axios.post("/form/add", this.checkForm)
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.$message.success(data.msg);
            this.cancelCheckIn();
            // this.chickInFormVisible = false;
            this.getRoomList();
            // this.checkForm = {};
            // this.clients = [];
            // this.client1 = {};
            // this.client2 = {};
            // this.client3 = {};
            // this.client4 = {};
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    setNull() {
      this.roomNum = '';
      this.type = '';
      this.status = '';
      this.getRoomList();
    },
  },
  mounted() {
    this.getRoomList();
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
      <el-form-item label="房间状态" label-width="100px">
        <el-select v-model="status" placeholder="请选择">
          <el-option label="无" value=""></el-option>
          <el-option label="空闲" value="1"></el-option>
          <el-option label="使用" value="2"></el-option>
          <el-option label="清扫" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <template>
          <el-button @click="setNull">重置</el-button>
          <el-button type="primary" @click="getRoomList">查询</el-button>
          <el-button type="primary" @click="showCheckInDialog">登记入住</el-button>
        </template>
      </el-form-item>
    </el-form>
    <el-table
      :data="roomList"
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
        prop="type"
        label="类型"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : scope.row.status===2?'danger' : 'warning'"
            disable-transitions>{{ scope.row.status === 1 ? "空闲" : scope.row.status === 2 ? "使用" : "清扫" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
      >
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

    <el-dialog title="入住登记" :visible.sync="chickInFormVisible" @close="cancelCheckIn">
      <el-form :model="checkForm">
        <el-form-item label="房间号" label-width="120px">
          <el-input v-model="checkForm.roomNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" label-width="120px">
          <el-date-picker
            v-model="checkForm.startTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="120px">
          <el-date-picker
            v-model="checkForm.endTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客人1" label-width="120px">
          <el-input v-model="client1.name" autocomplete="off" placeholder="客人1的姓名"></el-input>
          <el-input v-model="client1.idNum" autocomplete="off" placeholder="客人1的身份证号"></el-input>
          <el-input v-model="client1.sex" autocomplete="off" placeholder="客人1的性别"></el-input>
          <el-input v-model="client1.age" autocomplete="off" placeholder="客人1的年龄"></el-input>
          <el-input v-model="client1.address" autocomplete="off" placeholder="客人1的地址"></el-input>
        </el-form-item>
        <el-form-item label="客人2" label-width="120px">
          <el-input v-model="client2.name" autocomplete="off" placeholder="客人2的姓名"></el-input>
          <el-input v-model="client2.idNum" autocomplete="off" placeholder="客人2的身份证号"></el-input>
          <el-input v-model="client2.sex" autocomplete="off" placeholder="客人2的性别"></el-input>
          <el-input v-model="client2.age" autocomplete="off" placeholder="客人2的年龄"></el-input>
          <el-input v-model="client2.address" autocomplete="off" placeholder="客人2的地址"></el-input>
        </el-form-item>
        <el-form-item label="客人3" label-width="120px">
          <el-input v-model="client3.name" autocomplete="off" placeholder="客人3的姓名"></el-input>
          <el-input v-model="client3.idNum" autocomplete="off" placeholder="客人3的身份证号"></el-input>
          <el-input v-model="client3.sex" autocomplete="off" placeholder="客人3的性别"></el-input>
          <el-input v-model="client3.age" autocomplete="off" placeholder="客人3的年龄"></el-input>
          <el-input v-model="client3.address" autocomplete="off" placeholder="客人3的地址"></el-input>
        </el-form-item>
        <el-form-item label="客人4" label-width="120px">
          <el-input v-model="client4.name" autocomplete="off" placeholder="客人4的姓名"></el-input>
          <el-input v-model="client4.idNum" autocomplete="off" placeholder="客人4的身份证号"></el-input>
          <el-input v-model="client4.sex" autocomplete="off" placeholder="客人4的性别"></el-input>
          <el-input v-model="client4.age" autocomplete="off" placeholder="客人4的年龄"></el-input>
          <el-input v-model="client4.address" autocomplete="off" placeholder="客人4的地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCheckIn">取 消</el-button>
        <el-button type="primary" @click="saveCheckIn">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<style scoped>

</style>
