import {
  h,
  ref,
  Ref,
  PropType,
  defineComponent,
  onMounted,
  watchEffect,
} from 'vue'

import { StripeElement, StripeElementChangeEvent } from '@stripe/stripe-js'

const emits = ['change', 'focus', 'blur', 'click', 'ready']

export default defineComponent({
  name: 'StripeElement',
  props: {
    element: {
      type: Object as PropType<StripeElement>,
      default: null,
    },
  },
  emits,
  setup(props, { emit }) {
    const domRef = (ref(null) as unknown) as Ref<HTMLElement>

    const setupElement = (element: StripeElement) => {
      const [change, ...eventNames] = emits
      for (const key of eventNames) {
        // @ts-ignore
        element.on(key, () => emit(key))
      }

      props.element.on(
        // @ts-ignore
        change,
        (
          event: StripeElementChangeEvent & {
            value?: string
            bankName?: string
            branchName?: string
            brand?: string
            country?: string
          }
        ) => emit(change, event)
      )
    }

    onMounted(() => {
      watchEffect(() => {
        if (!props.element) {
          return
        }

        setupElement(props.element)
        props.element.mount(domRef.value)
      })
    })

    return () => h('div', { ref: domRef })
  },
})
