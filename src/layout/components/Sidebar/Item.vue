<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span class={'sidebarSpan'} slot='title' >{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sidebarSpan{
    font-size: 17px;

    font-family: “Arial”,”Microsoft YaHei”,”黑体”,”宋体”,sans-serif;

    font-weight: bold;
  }
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.svg-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
