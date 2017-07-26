<template>
    <div class="dashboard">
        <Row :gutter="16">
          <Col span="6">
            <router-link to="/user">
              <Card class="card card-user">
                <Row>
                  <Col span="12" class="icon-wrap">
                    <img src="../assets/tip/user.png" />
                  </Col>
                  <Col span="12">
                      <span class="value">{{today.newAccount}}</span>
                      <span class="note">今日新增用户(人)</span>
                  </Col>
                </Row>
              </Card>
            </router-link>
          </Col>

          <Col span="6">
            <Card class="card card-deposit">
              <Row>
                <Col span="12" class="icon-wrap">
                  <img src="../assets/tip/cash-pledge.png" />
                </Col>
                <Col span="12">
                    <span class="value">{{today.deposit | cent-to-yuan}}</span>
                    <span class="note">今日收到押金(元)</span>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span="6">
            <Card class="card card-recharge">
              <Row>
                <Col span="12" class="icon-wrap">
                  <img src="../assets/tip/recharge.png" />
                </Col>
                <Col span="12">
                    <span class="value">{{today.balance | cent-to-yuan}}</span>
                    <span class="note">今日充值金额(元)</span>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span="6">
            <Card class="card card-consume">
              <Row>
                <Col span="12" class="icon-wrap">
                  <img src="../assets/tip/income.png" />
                </Col>
                <Col span="12">
                    <span class="value">{{today.income | cent-to-yuan}}</span>
                    <span class="note">今日收入(元)</span>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        
        <h2 class="section-title">车辆统计</h2>

        <Row :gutter="16">
            <Col span="12">
                <Card>
                    <p class="chart-title" slot="title">
                        总投放: {{ total.putIntoBike }} 辆
                    </p>
                    <highcharts :options="putIntoBike" ref="highcharts"></highcharts>
                </Card>
            </Col>
            <Col span="12">
                <Card>
                    <p class="chart-title" slot="title">
                        活跃: {{ today.usedBike }} 辆
                    </p>
                    <highcharts :options="usedBike" ref="highcharts"></highcharts>
                </Card>
            </Col>
        </Row>

        <h2 class="section-title">财务统计</h2>
        <Row :gutter="16">
            <Col span="8">
                <Card>
                    <p class="chart-title" slot="title">
                        押金总额: {{total.deposit | cent-to-yuan}} 元
                    </p>
                    <highcharts :options="deposit" ref="highcharts"></highcharts>
                </Card>
            </Col>
            <Col span="8">
                <Card>
                    <p class="chart-title" slot="title">
                        充值总额: {{total.balance | cent-to-yuan}} 元
                    </p>
                    <highcharts :options="balance" ref="highcharts"></highcharts>
                </Card>
            </Col>
            <Col span="8">
                <Card>
                    <p class="chart-title" slot="title">
                        骑行消费总额: {{total.consume | cent-to-yuan}} 元
                    </p>
                    <highcharts :options="consume" ref="highcharts"></highcharts>
                </Card>
            </Col>
        </Row>

    </div>
</template>
<script type="text/javascript">
    export default {

        data(){
            return {
                today: {
                  newAccount: '--',
                  deposit: '--',
                  balance: '--',
                  income: '--',
                  usedBike: '--'
                },
                total: {
                  income: '--',
                  deposit: '--',
                  balance: '--',
                  putIntoBike: '--'
                },
                putIntoBike: {
                  chart: {
                    type: 'area'
                  },
                  credits: {
                      enabled: false
                  },
                  title: {
                    text: ''
                  },
                  xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y-%m-%d<br/>%H:%M:%S',
                            minute: '%Y-%m-%d<br/>%H:%M',
                            hour: '%Y-%m-%d<br/>%H:%M',
                            day: '%Y<br/>%m-%d',
                            week: '%Y<br/>%m-%d',
                            month: '%Y-%m',
                            year: '%Y9'
                        }
                  },
                  yAxis: {
                    title: {
                      text: ''
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                  },
                  tooltip: {
                    valueSuffix: '辆'
                  },
                  legend: {
                    enable: false
                  },
                  series: [{
                    color: '#00c396',
                    fillColor: '#c7f3e9',
                    marker: {
                      enabled: true,
                      symbol: 'circle',
                      radius: 3,
                      states: {
                        hover: {
                          radius: 3.75
                        },
                        select: {
                          radius: 3.75
                        }
                      }
                    },
                    lineWidth:1,
                    states: {
                      hover: {
                        lineWidth:1,
                        halo: {
                          size: 7.5
                        }
                      }
                    },
                    showInLegend: false,
                    name: '时间',
                    data: []
                  }]
                },

                usedBike: {
                  chart: {
                    type: 'area'
                  },
                  credits: {
                      enabled: false
                  },
                  title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                  },
                  xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y-%m-%d<br/>%H:%M:%S',
                            minute: '%Y-%m-%d<br/>%H:%M',
                            hour: '%Y-%m-%d<br/>%H:%M',
                            day: '%Y<br/>%m-%d',
                            week: '%Y<br/>%m-%d',
                            month: '%Y-%m',
                            year: '%Y9'
                        }
                  },
                  yAxis: {
                    title: {
                      text: ''
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                  },
                  tooltip: {
                    valueSuffix: '辆'
                  },
                  legend: {
                    enable: false
                  },
                  series: [{
                    color: '#04b9f1',
                    fillColor: '#c8eefc',
                    marker: {
                      enabled: true,
                      symbol: 'circle',
                      radius: 3,
                      states: {
                        hover: {
                          radius: 3.75
                        },
                        select: {
                          radius: 3.75
                        }
                      }
                    },
                    lineWidth:1,
                    states: {
                      hover: {
                        lineWidth:1,
                        halo: {
                          size: 7.5
                        }
                      }
                    },
                    showInLegend: false,
                    name: '被使用',
                    data: []
                  }]
                },

                deposit: {
                  chart: {
                    height: 322,
                    type: 'area'
                  },
                  credits: {
                      enabled: false
                  },
                  title: {
                    text: ''
                  },
                  xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y-%m-%d<br/>%H:%M:%S',
                            minute: '%Y-%m-%d<br/>%H:%M',
                            hour: '%Y-%m-%d<br/>%H:%M',
                            day: '%Y<br/>%m-%d',
                            week: '%Y<br/>%m-%d',
                            month: '%Y-%m',
                            year: '%Y9'
                        }
                  },
                  yAxis: {
                    title: {
                      text: ''
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                  },
                  tooltip: {
                    valueSuffix: '元'
                  },
                  legend: {
                    enable: false
                  },
                  series: [{
                    color: '#00c396',
                    fillColor: '#c7f3e9',
                    marker: {
                      enabled: true,
                      symbol: 'circle',
                      radius: 3,
                      states: {
                        hover: {
                          radius: 3.75
                        },
                        select: {
                          radius: 3.75
                        }
                      }
                    },
                    lineWidth:1,
                    states: {
                      hover: {
                        lineWidth:1,
                        halo: {
                          size: 7.5
                        }
                      }
                    },
                    showInLegend: false,
                    name: '时间',
                    data: []
                  }]
                },

                balance: {
                  chart: {
                    height: 325,
                    type: 'area'
                  },
                  credits: {
                      enabled: false
                  },
                  title: {
                    text: ''
                  },
                  xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y-%m-%d<br/>%H:%M:%S',
                            minute: '%Y-%m-%d<br/>%H:%M',
                            hour: '%Y-%m-%d<br/>%H:%M',
                            day: '%Y<br/>%m-%d',
                            week: '%Y<br/>%m-%d',
                            month: '%Y-%m',
                            year: '%Y9'
                        }
                  },
                  yAxis: {
                    title: {
                      text: '',
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                  },
                  tooltip: {
                    valueSuffix: '元'
                  },
                  legend: {
                    enable: false
                  },
                  series: [{
                    color: '#04b9f1',
                    fillColor: '#c8eefc',
                    marker: {
                      enabled: true,
                      symbol: 'circle',
                      radius: 3,
                      states: {
                        hover: {
                          radius: 3.75
                        },
                        select: {
                          radius: 3.75
                        }
                      }
                    },
                    lineWidth:1,
                    states: {
                      hover: {
                        lineWidth:1,
                        halo: {
                          size: 7.5
                        }
                      }
                    },
                    showInLegend: false,
                    name: '时间',
                    data: [
                        [Date.now() - 5 * 86400000, 10000],
                        [Date.now() - 4 * 86400000, 20000],
                        [Date.now() - 3 * 86400000, 50000],
                        [Date.now() - 2 * 86400000, 55000],
                        [Date.now() - 1 * 86400000, 70000],
                        [Date.now(), 90000]
                    ]
                  }]
                },

                consume: {
                  chart: {
                    height: 325,
                    type: 'area'
                  },
                  credits: {
                      enabled: false
                  },
                  title: {
                    text: ''
                  },
                  xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y-%m-%d<br/>%H:%M:%S',
                            minute: '%Y-%m-%d<br/>%H:%M',
                            hour: '%Y-%m-%d<br/>%H:%M',
                            day: '%Y<br/>%m-%d',
                            week: '%Y<br/>%m-%d',
                            month: '%Y-%m',
                            year: '%Y9'
                        }
                  },
                  yAxis: {
                    title: {
                      text: ''
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                  },
                  tooltip: {
                    valueSuffix: '元'
                  },
                  legend: {
                    enable: false
                  },
                  series: [{
                    color: '#ff947a',
                    fillColor: '#ffe9e4',
                    marker: {
                      enabled: true,
                      symbol: 'circle',
                      radius: 3,
                      states: {
                        hover: {
                          radius: 3.75
                        },
                        select: {
                          radius: 3.75
                        }
                      }
                    },
                    lineWidth:1,
                    states: {
                      hover: {
                        lineWidth:1,
                        halo: {
                          size: 7.5
                        }
                      }
                    },
                    showInLegend: false,
                    name: '时间',
                    data: [
                        [Date.now() - 5 * 86400000, 10000],
                        [Date.now() - 4 * 86400000, 20000],
                        [Date.now() - 3 * 86400000, 40000],
                        [Date.now() - 2 * 86400000, 60000],
                        [Date.now() - 1 * 86400000, 67000],
                        [Date.now(), 80000]
                    ]
                  }]
                },
            }
        },
        methods: {
          parseData(data) {
            const todayData = data.items[data.items.length-1];
            const seriesDeposit = [], seriesBalance = [], seriesConsume = [];
            const result = {
              today: {
                newAccount: data.inc_account_in_today,
                deposit: todayData.deposit,
                balance: todayData.balance,
                income: todayData.total
              },
              total: {
                income: data.total_income,
                deposit: data.total_deposit,
                balance: data.total_balance,
                consume: data.total_consume
              },
              series: {
                deposit: [],
                balance: [],
                consume: []
              }
            };

            function toYuan(val) {
              return util.accurateNumber(val/100);
            }
            data.items.forEach((item) => {
              seriesDeposit.push([item.timestamp * 1000, toYuan(item.deposit)]);
              seriesBalance.push([item.timestamp * 1000, toYuan(item.balance)]);
              seriesConsume.push([item.timestamp * 1000, toYuan(item.consume)]);
            });
            result.series.deposit = seriesDeposit;
            result.series.balance = seriesBalance;
            result.series.consume = seriesConsume;

            return result
          },
          fixData(start, end, data) {
            // 服务端返回的数据不是很理想, 如果当天数据为 0 , 就不存在那个点, 下面补回来
            const points = [];
            const indexedData = {};
            data.forEach((item) => {
              indexedData[item.date] = item.value;
            });

            for (let t = moment(start).startOf('day').valueOf(), d; t < end; t += 86400000) {
              d = moment(t).format('YYYY-M-D');
              points.push({date: d, value: indexedData[d] || 0});
            }

            return points;
          }
        },
        created() {
          const now = parseInt(Date.now()/1000);
          const start = now - 6 * 86400;
          const end = now;

          this.$http({
            url: '/admin_api/income_stat',
            params: {
              from: start,
              to: end
            }
          }).then((result) => {
            const data = this.parseData(result.data);

            Object.assign(this.today, data.today);
            Object.assign(this.total, data.total);

            this.deposit.series[0].data = data.series.deposit;
            this.balance.series[0].data = data.series.balance;
            this.consume.series[0].data = data.series.consume;
          });

          this.$http({
            url: '/admin_api/bike_statistics',
            params: {
              start: start,
              end: end
            }
          }).then((res) => {
            const result = res.data;
            if (result.status == 0) {
              result.put_into_bike = this.fixData(start * 1000, end * 1000, result.put_into_bike);
              result.used_bike = this.fixData(start * 1000, end * 1000, result.used_bike);
              const putIntoBikeData = result.put_into_bike.map((item) => [+new Date(item.date), item.value]);
              const usedBikeData = result.used_bike.map((item) => [+new Date(item.date), item.value]);

              this.putIntoBike.series[0].data = putIntoBikeData;
              this.total.putIntoBike = putIntoBikeData[putIntoBikeData.length-1][1];
              this.usedBike.series[0].data = usedBikeData;
              this.today.usedBike = usedBikeData[usedBikeData.length-1][1];
            }
          });
        }

    }
</script>

<style type="text/css" scoped>
  .dashboard {
    padding: 24px 22px;
    background: #eff3f7;
  }
  .card {
    height: 130px;
    border-bottom:1px solid #e5e9ee;
    color: #454c5a;
  }
  .card .value,
  .card .note {
    display: block;
    text-align: right;
  }
  .value {
    margin-top: 21px;
    font-size: 36px;
    line-height: 42px;
  }
  .note {
    font-size: 12px;
    color: #8d9ea1;
  }

  .section-title {
    margin: 24px 0;
    line-height: 48px;
    background: #fff;
    text-indent: 32px;
    border-bottom:1px solid #e5e9ee;
    color: #454c5a;
  }

  .icon-wrap {
    position: relative;
    margin: 13px 16px;
    width: 72px;
    height: 72px;
    border-radius: 36px;
  }
  .icon-wrap img {
    position: absolute;
  }
  .card-user .icon-wrap {
    background: #00c1c7;
  }
  .card-user .icon-wrap img {
    top: 20px;
    left: 20px;
  }
  .card-deposit .icon-wrap {
    background: #30b5f0;
  }
  .card-deposit .icon-wrap img {
    top: 20px;
    left: 20px;
  }
  .card-recharge .icon-wrap {
    background: #ff947a
  }
  .card-recharge .icon-wrap img {
    top: 25px;
    left: 20px;
  }
  .card-consume .icon-wrap {
    background: #4b5666
  }
  .card-consume .icon-wrap img {
    top: 24px;
    left: 21px;
  }
  .chart-title {
    margin-left: 16px;
    padding-left: 8px;
    height: 16px;
    line-height: 18px;
    font-size: 16px;
    border-left: 3px solid #464c5b;
    color: #454c5a;
  }
</style>