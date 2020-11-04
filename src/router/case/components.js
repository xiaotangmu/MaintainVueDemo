/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '组件',
    icon: 'component'
  },
  children: [
    {
      path: 'tinymce',
      component: () => import('@/views/case/components-demo/tinymce'),
      name: 'TinymceDemo',
      meta: { title: 'Tinymce' }
    },
    {
      path: 'markdown',
      component: () => import('@/views/case/components-demo/markdown'),
      name: 'MarkdownDemo',
      meta: { title: 'Markdown' }
    },
    {
      path: 'json-editor',
      component: () => import('@/views/case/components-demo/json-editor'),
      name: 'JsonEditorDemo',
      meta: { title: 'JSON Editor' }
    },
    {
      path: 'split-pane',
      component: () => import('@/views/case/components-demo/split-pane'),
      name: 'SplitpaneDemo',
      meta: { title: 'SplitPane' }
    },
    {
      path: 'avatar-upload',
      component: () => import('@/views/case/components-demo/avatar-upload'),
      name: 'AvatarUploadDemo',
      meta: { title: 'Upload' }
    },
    {
      path: 'dropzone',
      component: () => import('@/views/case/components-demo/dropzone'),
      name: 'DropzoneDemo',
      meta: { title: 'Dropzone' }
    },
    {
      path: 'sticky',
      component: () => import('@/views/case/components-demo/sticky'),
      name: 'StickyDemo',
      meta: { title: 'Sticky' }
    },
    {
      path: 'count-to',
      component: () => import('@/views/case/components-demo/count-to'),
      name: 'CountToDemo',
      meta: { title: 'Count To' }
    },
    {
      path: 'mixin',
      component: () => import('@/views/case/components-demo/mixin'),
      name: 'ComponentMixinDemo',
      meta: { title: 'Component Mixin' }
    },
    {
      path: 'back-to-top',
      component: () => import('@/views/case/components-demo/back-to-top'),
      name: 'BackToTopDemo',
      meta: { title: 'Back To Top' }
    },
    {
      path: 'drag-dialog',
      component: () => import('@/views/case/components-demo/drag-dialog'),
      name: 'DragDialogDemo',
      meta: { title: 'Drag Dialog' }
    },
    {
      path: 'drag-select',
      component: () => import('@/views/case/components-demo/drag-select'),
      name: 'DragSelectDemo',
      meta: { title: 'Drag Select' }
    },
    {
      path: 'dnd-list',
      component: () => import('@/views/case/components-demo/dnd-list'),
      name: 'DndListDemo',
      meta: { title: 'Dnd List' }
    },
    {
      path: 'drag-kanban',
      component: () => import('@/views/case/components-demo/drag-kanban'),
      name: 'DragKanbanDemo',
      meta: { title: 'Drag Kanban' }
    }
  ]
}

export default componentsRouter
