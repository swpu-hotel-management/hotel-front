<template>
    <div class="app-container">
        <div class="total-layout">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="total-frame">
                        <div class="total-title">今日订单总数</div>
                        <div class="total-value">{{this.orderList.orderNumToday}}</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="total-frame">
                        <div class="total-title">今日销售总额</div>
                        <div class="total-value">¥{{this.orderList.dayTurnover}}</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="total-frame">
                        <div class="total-title">昨日销售总额</div>
                        <div class="total-value">¥{{this.orderList.yesterdayTurnover}}</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="total-frame">
                        <div class="total-title">昨日订单总数</div>
                        <div class="total-value">{{this.orderList.orderNumYesterday}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
            <div class="statistics-layout">
                <div class="layout-title">订单统计</div>
                <el-row>
                        <div style="display: flex; flex-direction: row; justify-content: space-around; align-items: center;">
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="color: #909399;font-size: 14px">本月订单总数</div>
                                <div style="color: #606266;font-size: 24px;padding: 10px 0">{{this.orderList.orderNumMonth}}</div>
                                <div style="display: flex; align-items: center;">
                                    <span :style="{color: getColor(this.orderList.orderNumPerMonth), fontSize: '14px'}">{{ this.orderList.orderNumPerMonth }}%</span>
                                    <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="color: #909399;font-size: 14px">本周订单总数</div>
                                <div style="color: #606266;font-size: 24px;padding: 10px 0">{{this.orderList.orderNumWeek}}</div>
                                <div style="display: flex; align-items: center;">
                                    <span :style="{color: getColor(this.orderList.orderNumPerWeek), fontSize: '14px'}">{{ this.orderList.orderNumPerWeek }}%</span>
                                    <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="color: #909399;font-size: 14px">本月销售总额</div>
                                <div style="color: #606266;font-size: 24px;padding: 10px 0">¥{{this.orderList.monthTurnover}}</div>
                                <div style="display: flex; align-items: center;">
                                    <span :style="{color: getColor(this.orderList.orderTurnoverPerMonth), fontSize: '14px'}">{{ this.orderList.orderTurnoverPerMonth }}%</span>
                                    <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="color: #909399;font-size: 14px">本周销售总额</div>
                                <div style="color: #606266;font-size: 24px;padding: 10px 0">¥{{this.orderList.weekTurnover}}</div>
                                <div style="display: flex; align-items: center;">
                                <span :style="{color: getColor(this.orderList.orderTurnoverPerWeek), fontSize: '14px'}">{{ this.orderList.orderTurnoverPerWeek }}%</span>
                                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
                            </div>
                        </div>
                    </div>
            </el-row>
        </div>
        <!-- <div ref="chart" style="width: 600px; height: 400px;"></div> -->
    </div>
</template>

<script>
// import * as echarts from 'echarts';

    export default {
        data(){
            return{
                orderList: {},
                // chart: null
            }
        },
        methods:{
            getData(){
                var params = {
                }
                this.$axios.get('/order/getdata',{params:params})
                .then(res => {
                this.orderList = res.data.data;
                })
                .catch(e => {
                    console.log(e);
                })
            },
            getColor(percent){
                if(percent > 0){
                    return 'red';
                }else if(percent < 0){
                    return 'green';
                }else{
                    return '#C0C4CC'
                }
            },
            // initChart(){
            //     this.chart = echarts.init(this.$refs.chart);

            //     const option = {
            //         title: {
            //             text: '30日营业额折线图'
            //         },
            //         tooltip: {
            //             trigger: 'axis'
            //         },
            //         xAxis: {
            //             type: 'category',
            //             data: this.orderList
            //         },yAxis: {
            //             type: 'value'
            //         },
            //         series: [{
            //             data: this.orderList,
            //             type: 'line'
            //         }]
            //     };
            //     this.chart.setOption(option);
            // }
        },
        mounted(){
            this.getData();
        },
/*         beforeDestroy(){
            if(this.chart){
                this.chart.dispose();
            }
        } */
    }
</script>

<style scoped>
    .app-container {
        margin-top: 40px;
        margin-left: 120px;
        margin-right: 120px;
    }
    .total-frame {
        display: flex;
        flex-direction: column;
        justify-self: center;
        align-items: center;
        border: 1px solid #409EFF;
        padding: 20px;
        height: 100px;
        box-sizing: border-box;
        text-align: center;
    }

    .total-icon {
        color: #409EFF;
        width: 60px;
        height: 60px;
    }
    .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    bottom: -15px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
