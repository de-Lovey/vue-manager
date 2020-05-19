<template>
    <div>
      <el-card>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" style="width: 700px;height:400px;"></div>
      </el-card>
    </div>
</template>

<script>
  // 下载echarts.js  导入
  import echarts from 'echarts'
  import _ from 'lodash'
    export default {
        name: 'Report',
      data() {
          return {
            options: {
              title: {
                text: '用户来源'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#E9EEF3'
                  }
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  boundaryGap: false
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ]
            }
          }
      },
      async mounted() {
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('main'))
        // 测试成功后, 请求数据
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$message.error('获取报表失败')
        // 成功
        // 使用lodash中merge方法, 合并对象
        const resObj = _.merge(res.data, this.options)
        // 把图表的配置项展示成数据
        myChart.setOption(resObj)
      }
    }
</script>

<style scoped>

</style>
