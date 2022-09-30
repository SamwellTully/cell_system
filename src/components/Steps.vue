<template>
    <div class="m-steps-area">
      <div class="m-steps">
        <div
          :class="['m-steps-item',
            { 'finished': currentStep > n,
              'process': currentStep === n && n !== totalSteps && currentStatus === 2,
              'rejectProcess': currentStep === n && n !== totalSteps && currentStatus === 1,
              'last-process': currentStep === totalSteps && n === totalSteps,
              'middle-wait': currentStep < n && n !== totalSteps,
              'last-wait': currentStep < n && n === totalSteps,
            }
          ]"
          v-for="n in totalSteps"
          :key="n"
          @click="onChange(n)">
          <div class="m-steps-icon">
            <span class="u-icon" v-if="currentStep<=n">{{ n }}</span>
            <span class="u-icon" v-else>√</span>
          </div>
          <div class="m-steps-content">
            <div class="u-steps-title">{{ stepsLabel[n-1] || 'S ' + n }}</div>
            <div class="u-steps-description">{{ stepsDesc[n-1] || 'Desc ' + n }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'Steps',
    props: {
      stepsLabel: { // 步骤title数组
        type: Array,
        default: () => {
          return []
        }
      },
      stepsDesc: { // 步骤description数组
        type: Array,
        default: () => {
          return []
        }
      },
      totalSteps: { // 总的步骤数
        type: Number,
        default: 3
      },
      currentStep: { // 当前选中的步骤
        type: Number,
        default: 1
      },
      currentStatus: {
        type: Number,
        default : 2
      }
    },
    data () {
      return {
        // 若当前选中步骤超过总步骤数，则默认选择步骤1
        current: this.currentStep > this.totalSteps ? 1 : this.currentStep
      }
    },
    methods: {
      onChange (index) { // 点击切换选择步骤
        // console.log('index:', index)
        // if (this.current !== index) {
        //   this.current = index
        //   this.$emit('change', index)
        // }
      }
    }
  }
  </script>
  <style lang="less" scoped>
  .m-steps-area {
    width: 1100px;
    margin: 0px auto;
    .m-steps {
      padding: 30px 0;
      display: flex;
      .m-steps-item {
        display: inline-block;
        flex: 1; // 弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容
        overflow: hidden;
        font-size: 16px;
        line-height: 32px;
        .m-steps-icon {
          display: inline-block;
          margin-right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          text-align: center;
        }
        .m-steps-content {
          display: inline-block;
          vertical-align: top;
          padding-right: 16px;
          .u-steps-title {
            position: relative;
            display: inline-block;
            padding-right: 16px;
          }
          .u-steps-description {
            font-size: 14px;
            max-width: 140px;
          }
        }
      }
      .finished {
        margin-right: 16px;
        cursor: pointer;
        &:hover {
          .m-steps-content {
            .u-steps-title {
              color: #1890ff;
            }
            .u-steps-description {
              color: #1890ff;
            }
          }
        }
        .m-steps-icon {
          background: #fff;
          border: 1px solid rgba(0,0,0,.25);
          border-color: #1890ff;
          .u-icon {
            color: #1890ff;
          }
        }
        .m-steps-content {
          color: rgba(0,0,0,.65);
          .u-steps-title {
            color: rgba(0,0,0,.65);
            &:after {
              background: #1890ff;
              position: absolute;
              top: 16px;
              left: 100%;
              display: block;
              width: 9999px;
              height: 1px;
              content: "";
            }
          }
          .u-steps-description {
            color: rgba(0,0,0,.45);
          }
        }
      }
      .process {
        margin-right: 16px;
        .m-steps-icon {
          background: #1890ff;
          border: 1px solid rgba(0,0,0,.25);
          border-color: #1890ff;
          .u-icon {
            color: #fff;
          }
        }
        .m-steps-content {
          color: rgba(0,0,0,.65);
          .u-steps-title {
            font-weight: 600;
            color: rgba(0,0,0,.85);
            &:after {
              background: #e8e8e8;
              position: absolute;
              top: 16px;
              left: 100%;
              display: block;
              width: 9999px;
              height: 1px;
              content: "";
            }
          }
          .u-steps-description {
            color: rgba(0,0,0,.65);
          }
        }
      }
      .rejectProcess {
        margin-right: 16px;
        .m-steps-icon {
          background: red;
          border: 1px solid rgba(0,0,0,.25);
          border-color: red;
          .u-icon {
            color: #fff;
          }
        }
        .m-steps-content {
          color: red;
          .u-steps-title {
            font-weight: 600;
            color: red;
            &:after {
              background: #e8e8e8;
              position: absolute;
              top: 16px;
              left: 100%;
              display: block;
              width: 9999px;
              height: 1px;
              content: "";
            }
          }
          .u-steps-description {
            color: red;
          }
        }
      }
      .last-process {
        margin-right: 0;
        .m-steps-icon {
          background: #1890ff;
          border: 1px solid rgba(0,0,0,.25);
          border-color: #1890ff;
          .u-icon {
            color: #fff;
          }
        }
        .m-steps-content {
          color: rgba(0,0,0,.65);
          .u-steps-title {
            font-weight: 600;
            color: rgba(0,0,0,.85);
          }
          .u-steps-description {
            color: rgba(0,0,0,.65);
          }
        }
      }
      .middle-wait {
        margin-right: 16px;
        cursor: pointer;
        &:hover {
          .m-steps-icon {
            border: 1px solid #1890ff;
            .u-icon {
              color: #1890ff;
            }
          }
          .m-steps-content {
            .u-steps-title {
              color: #1890ff;
            }
            .u-steps-description {
              color: #1890ff;
            }
          }
        }
        .m-steps-icon {
          background: #fff;
          border: 1px solid rgba(0,0,0,.25);
          .u-icon {
            color: rgba(0,0,0,.25);
          }
        }
        .m-steps-content {
          color: rgba(0,0,0,.65);
          .u-steps-title {
            color: rgba(0,0,0,.45);
            &:after {
              background: #e8e8e8;
              position: absolute;
              top: 16px;
              left: 100%;
              display: block;
              width: 9999px;
              height: 1px;
              content: "";
            }
          }
          .u-steps-description {
            color: rgba(0,0,0,.45);
          }
        }
      }
      .last-wait {
        margin-right: 0;
        cursor: pointer;
        &:hover {
          .m-steps-icon {
            border: 1px solid #1890ff;
            .u-icon {
              color: #1890ff;
            }
          }
          .m-steps-content {
            .u-steps-title {
              color: #1890ff;
            }
            .u-steps-description {
              color: #1890ff;
            }
          }
        }
        .m-steps-icon {
          background: #fff;
          border: 1px solid rgba(0,0,0,.25);
          .u-icon {
            color: rgba(0,0,0,.25);
          }
        }
        .m-steps-content {
          color: rgba(0,0,0,.65);
          .u-steps-title {
            color: rgba(0,0,0,.45);
          }
          .u-steps-description {
            color: rgba(0,0,0,.45);
          }
        }
      }
    }
  }
  </style>