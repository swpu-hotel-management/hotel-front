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
      <el-button
        style="float: right; margin-right: 15px;"
        type="primary"
        @click="openAddModal"
        size="small">
        增加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roomTable"
                :data="roomList"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="房间号" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editing" v-model="scope.row.roomNum" class="input-width"></el-input>
            <span v-else>{{ scope.row.roomNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="160" align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editing" v-model="scope.row.type" class="input-width"></el-input>
            <span v-else>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="160" align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editing" v-model.number="scope.row.price" class="input-width"></el-input>
            <span v-else>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="240" align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editing" v-model="scope.row.description" class="input-width"></el-input>
            <span v-else>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">
            <el-select v-if="scope.row.editing" v-model="scope.row.status" class="input-width" placeholder="请选择房间状态">
              <el-option
                v-for="item in roomStatuses"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-else>
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusLabel(scope.row.status) }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.editing"
              size="small"
              @click="toggleEdit(scope.row)"
              type="success">更新</el-button>
            <el-button
              v-else
              size="small"
              @click="saveChanges(scope.row)"
              type="success">保存</el-button>
            <el-button
              v-if="scope.row.editing"
              size="small"
              @click="cancelEdit(scope.row)"
              type="info">取消</el-button>
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
    <el-dialog title="新增房间" :visible.sync="addModalVisible" width="50%">
      <el-form :model="newRoom" label-width="100px">
        <el-form-item label="房间号">
          <el-input v-model="newRoom.roomNum"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="newRoom.type" placeholder="请选择房间类型">
            <el-option
              v-for="item in roomTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="newRoom.price"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newRoom.description"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newRoom.status" placeholder="请选择房间状态">
            <el-option
              v-for="item in roomStatuses"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addModalVisible = false">取消</el-button>
        <el-button type="primary" @click="addRoom">保存</el-button>
      </span>
    </el-dialog>
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
        { value: '单人间', label: '单人间' },
        { value: '双人间', label: '双人间' },
        { value: '套房', label: '套房' }
      ],
      roomStatuses: [
        { value: 1, label: '可用', type: 'success' },
        { value: 2, label: '占用', type: 'info' },
        { value: -1, label: '清扫', type: 'warning' }
      ],
      listLoading: false,
      addModalVisible: false,
      newRoom: {
        roomNum: '',
        type: '',
        price: null,
        description: '',
        status: ''
      }
    };
  },
  methods: {
searchRooms() {
  this.listLoading = true;

  if (this.roomNumber) {
    // 如果提供了房间号，则尝试查询单个房间
    this.$axios.get('/room/select', {
      params: {
        roomNum: this.roomNumber
      }
    })
      .then(res => {
        const room = res.data;
        if (room) {
          this.roomList = [{ ...room, editing: false }];
          this.total = 1;
          this.listLoading = false;
          console.log('Loaded room by number:', this.roomList[0]); // 添加调试输出
        } else {
          this.$message.warning('未找到指定的房间号！');
          this.roomList = [];
          this.total = 0;
          this.listLoading = false;
        }
      })
      .catch(error => {
        console.error('Error fetching room by number:', error);
        this.$message.error('查询房间时发生错误');
        this.listLoading = false;
      });
  } else if (this.roomType) {
    // 如果提供了房间类型，则尝试查询具有该类型的房间
    this.$axios.get('/room/selectByType', {
      params: {
        type: this.roomType
      }
    })
      .then(res => {
        const rooms = res.data;
        if (rooms && rooms.length > 0) {
          this.roomList = rooms.map(room => ({ ...room, editing: false }));
          this.total = this.roomList.length;
          this.listLoading = false;
          console.log('Loaded rooms by type:', this.roomList); // 添加调试输出
        } else {
          this.$message.warning('未找到指定类型的房间！');
          this.roomList = [];
          this.total = 0;
          this.listLoading = false;
        }
      })
      .catch(error => {
        console.error('Error fetching rooms by type:', error);
        this.$message.error('查询房间时发生错误');
        this.listLoading = false;
      });
  } else {
    // 如果没有提供房间号或类型，则获取所有房间
    this.$axios.get('/room/list')
      .then(res => {
        this.roomList = res.data.map(room => ({ ...room, editing: false }));
        this.total = this.roomList.length;
        this.listLoading = false;
        console.log('Loaded all rooms:', this.roomList); // 添加调试输出
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        this.$message.error('获取房间列表时发生错误');
        this.listLoading = false;
      });
  }
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
    toggleEdit(room) {
      room.editing = !room.editing;
    },
    saveChanges(room) {
      this.$confirm('是否保存更新？', '提示', { type: 'warning' })
        .then(() => {
          this.updateRoom(room)
            .then(() => {
              room.editing = false;
            });
        })
        .catch(() => {
          // 用户取消了保存操作
          room.editing = false;
        });
    },
    cancelEdit(room) {
      room.editing = false;
    },
    updateRoom(room) {
      return new Promise((resolve, reject) => {
        // 显示正在更新的房间号，以帮助调试
        console.log('Updating room:', room);

        // 发送 PUT 请求
        this.$axios.put('/room/update', room)
          .then(res => {
            const data = res.data;
            if (data) {
              resolve();
            } else {
              reject(new Error('更新失败'));
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    openAddModal() {
      this.newRoom = {
        roomNum: '',
        type: '',
        price: null,
        description: '',
        status: ''
      };
      this.addModalVisible = true;
    },
    addRoom() {
      this.$axios.post('/room/add', this.newRoom)
        .then(res => {
          const data = res.data;
          if (data) {
            this.$message.success('新增成功');
            this.searchRooms(); // 刷新页面
            this.addModalVisible = false; // 关闭模态框
          } else {
            this.$message.warning('新增失败');
          }
        })
        .catch(e => {
          console.log(e);
          this.$message.error('新增时发生错误');
        });
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
