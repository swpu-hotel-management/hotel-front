<template>
  <div class="room-list-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>筛选搜索</span>
        <el-button
          style="float: right;"
          type="primary"
          @click="searchRooms"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="resetSearch"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="房间号:">
            <el-input v-model="roomNumber" class="input-width" placeholder="请输入房间号">
            </el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <el-select v-model="roomType" class="input-width" placeholder="请选择房间类型">
              <el-option
                v-for="item in roomTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="roomStatus" class="input-width" placeholder="请选择房间状态">
              <el-option
                v-for="item in roomStatuses"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="roomTable"
                :data="roomList"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="房间号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.roomNum}}</template>
        </el-table-column>
        <el-table-column label="类型" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.type }}</template>
        </el-table-column>
        <el-table-column label="价格" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="描述" width="240" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editRoom(scope.row)"
              type="success">编辑</el-button>
            <el-button
              size="small"
              @click="showDeleteConfirmation(scope.row.roomNum)"
              type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  data() {
    return {
      roomList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      roomNumber: '',
      roomType: '',
      roomStatus: '',
      roomTypes: [
        { value: 'single', label: '单人间' },
        { value: 'double', label: '双人间' },
        { value: 'suite', label: '套房' }
      ],
      roomStatuses: [
        { value: 1, label: '可用', type: 'success' },
        { value: 2, label: '占用', type: 'info' },
        { value: -1, label: '清扫', type: 'warning' }
      ],
      listLoading: false
    };
  },
  methods: {
    searchRooms() {
      this.listLoading = true;
      this.$axios.get('/room/list', {
        params: {
          roomNumber: this.roomNumber,
          type: this.roomType,
          status: this.roomStatus
        }
      })
        .then(res => {
          this.roomList = res.data;
          this.total = this.roomList.length;
          this.listLoading = false;
          console.log('Loaded room list:', this.roomList); // 添加调试输出
        })
        .catch(error => {
          console.error('Error fetching rooms:', error);
          this.listLoading = false;
        });
    },
    resetSearch() {
      this.page = 1;
      this.pageSize = 10;
      this.roomNumber = '';
      this.roomType = '';
      this.roomStatus = '';
      this.searchRooms();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchRooms();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.searchRooms();
    },
    showDeleteConfirmation(roomNum) {
      this.$confirm('此操作将永久删除所选房间，是否继续？', '提示', { type: 'warning' })
        .then(() => {
          this.deleteRoom(roomNum);
        })
        .catch(() => {
          // 用户取消了删除操作
        });
    },
    deleteRoom(roomNum) {
      this.$axios.post('/room/delete', { "roomNum": roomNum })
        .then(res => {
          const data = res.data;
          if (data) {
            this.$message.success('删除成功');
            this.searchRooms(); // 刷新页面
          } else {
            this.$message.warning('删除失败');
          }
        })
        .catch(e => {
          console.log(e);
          this.$message.error('删除时发生错误');
        });
    },
    editRoom(room) {
      // 实现编辑房间的功能
      console.log(`Editing room ${room.roomNum}`);
    },
    getStatusType(status) {
      const found = this.roomStatuses.find(s => s.value === status);
      return found ? found.type : 'default';
    },
    getStatusLabel(status) {
      const found = this.roomStatuses.find(s => s.value === status);
      return found ? found.label : '未知';
    }
  },
  mounted() {
    this.searchRooms();
  }
};
</script>

<style scoped>
.room-list-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.input-width {
  width: 200px;
}

.operate-container {
  margin-bottom: 10px;
}

.table-container {
  margin-bottom: 20px;
}
</style>