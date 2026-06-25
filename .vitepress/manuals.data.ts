import { manualSummary } from './sidebar'

export default {
  watch: ['**/*.md'],
  load() {
    return manualSummary()
  }
}
